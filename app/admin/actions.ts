"use server";

import { createServiceSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import bcrypt from "bcrypt";
import sharp from "sharp";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const ADMIN_COOKIE = "zia_admin_session";
const MAX_UPLOAD_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/svg+xml",
  "image/heic",
  "image/heif",
]);
const RESERVED_SLUGS = new Set([
  "admin",
  "u",
  "api",
  "login",
  "logout",
  "auth",
  "settings",
  "dashboard",
  "static",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);
const SLUG_MIN_LENGTH = 2;
const SLUG_MAX_LENGTH = 50;

// ──────────────────────────────────────────────
// HMAC Session Token
// ──────────────────────────────────────────────
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable must be set");
  }
  return secret;
}

function createSessionToken(email: string): string {
  const payload = `${email}|${Date.now()}`;
  const hmac = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
  // token = base64(payload) + "." + hmac
  const encodedPayload = Buffer.from(payload).toString("base64url");
  return `${encodedPayload}.${hmac}`;
}

function verifySessionToken(token: string): string | null {
  try {
    const [encodedPayload, hmac] = token.split(".");
    if (!encodedPayload || !hmac) return null;

    const payload = Buffer.from(encodedPayload, "base64url").toString();
    const expectedHmac = crypto
      .createHmac("sha256", getSessionSecret())
      .update(payload)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return null;
    }

    const [email, timestampStr] = payload.split("|");
    const timestamp = parseInt(timestampStr, 10);

    // Session expires after 8 hours
    const MAX_AGE_MS = 8 * 60 * 60 * 1000;
    if (Date.now() - timestamp > MAX_AGE_MS) {
      return null;
    }

    return email || null;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Rate Limiting (in-memory, per-process)
// ──────────────────────────────────────────────
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_LOGIN_ATTEMPTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    return false;
  }

  return record.count >= MAX_LOGIN_ATTEMPTS;
}

function recordLoginAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    record.count += 1;
  }
}

function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  return (
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown"
  );
}

// ──────────────────────────────────────────────
// Admin Auth Helpers
// ──────────────────────────────────────────────
const BCRYPT_SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

async function getAdminEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export type AdminSession = {
  email: string;
  role: "super_admin" | "client";
  profileId?: string;
  profileSlug?: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const email = await getAdminEmail();
  if (!email) return null;

  const allowedEmail = process.env.ADMIN_EMAIL;
  if (allowedEmail && email === allowedEmail) {
    return { email, role: "super_admin" };
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, slug")
    .eq("client_email", email)
    .single();

  if (profile) {
    return {
      email,
      role: "client",
      profileId: profile.id,
      profileSlug: profile.slug,
    };
  }

  return null;
}

async function requireSuperAdmin() {
  const session = await getAdminSession();
  if (!session || session.role !== "super_admin") {
    throw new Error("Super Admin session required");
  }
  return session;
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Admin session not found or invalid");
  }
  return session;
}

/** Exported for admin page.tsx to check session */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

// ──────────────────────────────────────────────
// Form Helpers
// ──────────────────────────────────────────────
function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function option(
  formData: FormData,
  key: string,
  allowed: string[],
  fallback: string,
) {
  const value = text(formData, key);
  return value && allowed.includes(value) ? value : fallback;
}

// ──────────────────────────────────────────────
// Slug Validation
// ──────────────────────────────────────────────
function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[ə]/g, "e")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ü]/g, "u")
    .replace(/[ş]/g, "s")
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^\/+|\/+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);
}

function validateSlug(slug: string): string | null {
  if (slug.length < SLUG_MIN_LENGTH) {
    return "slug-too-short";
  }
  if (slug.length > SLUG_MAX_LENGTH) {
    return "slug-too-long";
  }
  if (RESERVED_SLUGS.has(slug)) {
    return "reserved-slug";
  }
  return null;
}

// ──────────────────────────────────────────────
// URL Validation
// ──────────────────────────────────────────────
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

const socialBaseUrls = {
  whatsapp: "https://wa.me/994",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@",
  website: "https://www.",
  facebook: "https://www.facebook.com/",
  x: "https://x.com/",
  linkedin: "https://www.linkedin.com/in/",
  youtube: "https://www.youtube.com/@",
} as const;

function normalizeUrlForCompare(value: string) {
  return value.trim().replace(/\/+$/, "").toLowerCase();
}

function isBareSocialBaseUrl(key: string, value: string) {
  const baseUrl = socialBaseUrls[key as keyof typeof socialBaseUrls];
  if (!baseUrl) return false;
  return normalizeUrlForCompare(value) === normalizeUrlForCompare(baseUrl);
}

function sanitizeUrl(formData: FormData, key: string): string | null {
  const value = text(formData, key);
  if (!value) return null;

  if (isBareSocialBaseUrl(key, value)) {
    return null;
  }

  // Ignore the bare WhatsApp prefix until the user adds the remaining digits.
  if (key === "whatsapp" && normalizeUrlForCompare(value) === normalizeUrlForCompare(socialBaseUrls.whatsapp)) {
    return null;
  }

  // Allow phone-like values for whatsapp field and normalize them into wa.me links.
  if (key === "whatsapp" && /^\+?[\d\s\-()]+$/.test(value)) {
    const digits = value.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : null;
  }

  // If it already starts with http:// or https://, validate it
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return isValidUrl(value) ? value : null;
  }

  // If it contains a dot, it's likely a partial URL (e.g. instagram.com/user)
  if (value.includes(".")) {
    const prefixed = `https://${value}`;
    return isValidUrl(prefixed) ? prefixed : null;
  }

  // If it's a social key and looks like a username (e.g. "ziya" or "@ziya")
  const username = value.replace(/^@/, "");
  switch (key) {
    case "instagram":
      return `https://www.instagram.com/${username}`;
    case "tiktok":
      return `https://www.tiktok.com/@${username}`;
    case "facebook":
      return `https://www.facebook.com/${username}`;
    case "x":
      return `https://x.com/${username}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${username}`;
    case "youtube":
      return `https://www.youtube.com/@${username}`;
    default:
      const defaultPrefixed = `https://${value}`;
      return isValidUrl(defaultPrefixed) ? defaultPrefixed : null;
  }
}

// ──────────────────────────────────────────────
// Redirect helpers
// ──────────────────────────────────────────────
function redirectWithSaveError(error: string, basePath = "/admin"): never {
  redirect(`${basePath}?error=${encodeURIComponent(error)}`);
}

// Helper to extract storage path from URL
function extractPathFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    console.log("Full path parts from URL:", url, "→", pathParts);
    
    // Standard Supabase format: /storage/v1/object/public/<bucket>/<path>
    const objectIndex = pathParts.indexOf("object");
    const publicIndex = pathParts.indexOf("public");
    
    if (objectIndex !== -1 && publicIndex !== -1 && publicIndex === objectIndex + 1) {
      // Path is everything after "public"
      const extractedPath = pathParts.slice(publicIndex + 1).join("/");
      console.log("Extracted path (standard) from URL:", url, "→", extractedPath);
      return extractedPath;
    }
    
    // Fallback: If URL just starts with /profiles/
    if (pathParts[0] === "profiles" && pathParts.length > 1) {
      const extractedPath = pathParts.slice(1).join("/");
      console.log("Extracted path (fallback) from URL:", url, "→", extractedPath);
      return extractedPath;
    }
    
    // Last resort: Just use the full pathname without leading slash
    const fallbackPath = pathParts.join("/");
    console.log("Extracted path (last resort) from URL:", url, "→", fallbackPath);
    return fallbackPath;
  } catch (error) {
    console.error("Error extracting path from URL:", url, error);
  }
  console.log("Could not extract path from URL:", url);
  return null;
}

// ──────────────────────────────────────────────
// File Upload
// ──────────────────────────────────────────────
async function uploadFile(file: File | null, folder: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return null;
  }

  // Check if it's an image file
  const isImage = file.type.startsWith("image/") && file.type !== "application/pdf";
  let fileToUpload: File | Buffer;
  let contentType: string;
  let ext: string;

  // 1MB threshold - 1 * 1024 * 1024 bytes
  const ONE_MB = 1 * 1024 * 1024;

  if (isImage) {
    // If image is already WebP or smaller than 1MB, keep original format
    const isWebP = file.type === "image/webp";
    const isSmallEnough = file.size < ONE_MB;

    if (isWebP || isSmallEnough) {
      // Keep original file
      const rawExt = (file.name.split(".").pop() || "webp").toLowerCase();
      const safeExtensions = new Set(["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "heic", "heif"]);
      ext = safeExtensions.has(rawExt) ? rawExt : "webp";
      fileToUpload = file;
      contentType = file.type;
    } else {
      // Convert large non-WebP image (>=1MB) to WebP with dynamic quality
      const buffer = Buffer.from(await file.arrayBuffer());
      let webpBuffer: Buffer;
      let quality = 85; // Start with 85%
      
      // Try different qualities until we get under 20MB
      while (true) {
        webpBuffer = await sharp(buffer)
          .webp({ quality })
          .toBuffer();
        
        if (webpBuffer.length <= 20 * 1024 * 1024 || quality <= 10) {
          break; // Stop if we're under 20MB or quality is too low
        }
        quality -= 10; // Reduce quality by 10% each time
      }
      
      fileToUpload = webpBuffer!;
      contentType = "image/webp";
      ext = "webp";
    }
  } else {
    // For non-image files (like PDF), keep as is
    const rawExt = (file.name.split(".").pop() || "pdf").toLowerCase();
    const safeExtensions = new Set(["pdf"]);
    ext = safeExtensions.has(rawExt) ? rawExt : "pdf";
    fileToUpload = file;
    contentType = file.type || "application/octet-stream";
  }

  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("profiles").upload(path, fileToUpload, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("profiles").getPublicUrl(path);
  return data.publicUrl;
}

// ══════════════════════════════════════════════
// Server Actions
// ══════════════════════════════════════════════

export async function loginAdmin(formData: FormData) {
  const ip = await getClientIp();
  const redirectTo = text(formData, "redirectTo");

  // Rate limit check
  if (isRateLimited(ip)) {
    redirect(`/admin?error=rate-limited${redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ""}`);
  }

  const email = text(formData, "email");
  const password = text(formData, "password");
  const allowedEmail = process.env.ADMIN_EMAIL;
  const allowedPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    redirect(`/admin?error=login${redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ""}`);
  }

  // 1. Try Super Admin login
  if (
    allowedEmail &&
    allowedPassword &&
    email.toLowerCase() === allowedEmail.toLowerCase() &&
    password === allowedPassword
  ) {
    clearLoginAttempts(ip);

    const token = createSessionToken(email);
    const store = await cookies();
    store.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    redirect(redirectTo || "/admin");
  }

  // 2. Try Client Admin login
  const supabase = createServiceSupabaseClient();
  if (supabase) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("client_email, client_password")
      .eq("client_email", email.toLowerCase())
      .single();

    if (profile && profile.client_password) {
      if (await verifyPassword(password, profile.client_password)) {
        clearLoginAttempts(ip);

        const token = createSessionToken(email);
        const store = await cookies();
        store.set(ADMIN_COOKIE, token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 8,
          path: "/",
        });

        redirect(redirectTo || "/admin");
      }
    }
  }

  // Failed login
  recordLoginAttempt(ip);
  redirect(`/admin?error=login${redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ""}`);
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}
export async function saveProfile(formData: FormData) {
  const session = await requireAdmin();
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    redirectWithSaveError("supabase");
  }

  const id = text(formData, "id");
  const rawSlug = text(formData, "slug");
  const name = text(formData, "name");

  // Load existing profile for everyone (super admin and client admin)
  let existingProfile: any = null;
  const isSuper = session.role === "super_admin";

  if (id) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      existingProfile = data;
    }
  }

  if (!isSuper) {
    if (!id || !existingProfile || id !== session.profileId) {
      redirectWithSaveError("unauthorized");
    }
  }

  // Client admin (müştəri) slug/lini dəyişə bilməməlidir.
  // Super admin slug/lini dəyişə bilər.
  if (!isSuper) {
    const requestedSlug = (rawSlug ?? "").trim();
    const currentSlug = existingProfile.slug;

    // FormData manipulyasiyası edilsə belə slug dəyişimini bloklayırıq.
    if (requestedSlug && requestedSlug !== currentSlug) {
      redirectWithSaveError("slug-change-not-allowed");
    }
  }

  const slug = isSuper
    ? slugify(rawSlug || name || "")
    : existingProfile?.slug || slugify(name || "");

  const enabled = isSuper
    ? bool(formData, "enabled")
    : existingProfile?.enabled ?? true;

  if (!slug || !name) {
    redirectWithSaveError("required");
  }

  if (isSuper) {
    const slugError = validateSlug(slug);
    if (slugError) {
      redirectWithSaveError(slugError);
    }
  }

  const avatarFile = formData.get("avatar") as File | null;
  const backgroundFile = formData.get("background") as File | null;
  const cvFile = formData.get("cv") as File | null;
  const galleryJson = text(formData, "gallery");
  let sections: any[] = [];
  
  try {
    if (galleryJson) {
      sections = JSON.parse(galleryJson);
    }
  } catch (e) {
    sections = [];
  }

  // Collect all gallery files with their section ids
  const sectionFiles: { sectionId: string; files: File[] }[] = [];
  for (const section of sections) {
    const sectionId = section.id;
    const files = formData
      .getAll(`galleryFiles_${sectionId}`)
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    sectionFiles.push({ sectionId, files });
  }

  const MAX_GALLERY_IMAGES = 30;
  let totalFiles = 0;
  for (const { files } of sectionFiles) {
    totalFiles += files.length;
  }
  if (totalFiles > MAX_GALLERY_IMAGES) {
    redirectWithSaveError("too-many-gallery-images");
  }

  for (const file of [avatarFile, backgroundFile, ...sectionFiles.flatMap(s => s.files)]) {
    if (!(file instanceof File) || file.size === 0) {
      continue;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      redirectWithSaveError("file-too-large");
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      redirectWithSaveError("unsupported-image");
    }
  }

  if (cvFile && cvFile.size > 0) {
    if (cvFile.size > MAX_UPLOAD_SIZE) {
      redirectWithSaveError("file-too-large");
    }
    if (cvFile.type !== "application/pdf") {
      redirectWithSaveError("unsupported-cv");
    }
  }

  const avatar = await uploadFile(avatarFile, `avatars/${slug}`).catch(() =>
    redirectWithSaveError("upload"),
  );
  const background = await uploadFile(
    backgroundFile,
    `backgrounds/${slug}`,
  ).catch(() => redirectWithSaveError("upload"));
  const cv = await uploadFile(
    cvFile,
    `cvs/${slug}`,
  ).catch(() => redirectWithSaveError("upload"));

  // Upload files for each section
  const sectionUploads: { [key: string]: string[] } = {};
  for (const { sectionId, files } of sectionFiles) {
    const uploads = await Promise.all(
      files.map((file) =>
        uploadFile(file, `gallery/${slug}`).catch(() =>
          redirectWithSaveError("upload"),
        ),
      ),
    );
    sectionUploads[sectionId] = uploads.filter((item): item is string => Boolean(item));
  }

  // Build final sections with both existing and new images
  const newSections = sections.map(section => ({
    id: section.id,
    name: section.name || "Untitled",
    images: [
      ...(section.images || []),
      ...(sectionUploads[section.id] || [])
    ]
  }));

  const removeAvatar = bool(formData, "remove_avatar");
  const removeBackground = bool(formData, "remove_background");
  const removeCv = bool(formData, "remove_cv");

  // Collect files to delete from storage
  const pathsToDelete: string[] = [];

  // Delete old avatar if we're uploading a new one or removing it
  if ((avatar || removeAvatar) && existingProfile?.avatar_url) {
    const path = extractPathFromUrl(existingProfile.avatar_url);
    if (path) pathsToDelete.push(path);
  }

  // Delete old background if we're uploading a new one or removing it
  if ((background || removeBackground) && existingProfile?.background_url) {
    const path = extractPathFromUrl(existingProfile.background_url);
    if (path) pathsToDelete.push(path);
  }

  // Delete old cv if we're uploading a new one or removing it
  if ((cv || removeCv) && existingProfile?.cv_url) {
    const path = extractPathFromUrl(existingProfile.cv_url);
    if (path) pathsToDelete.push(path);
  }

  // Delete gallery images that are no longer in the new list
  const allNewImageUrls = new Set(newSections.flatMap(s => s.images || []));
  
  // Collect all old image urls
  let allOldImageUrls: string[] = [];
  if (existingProfile?.gallery && Array.isArray(existingProfile.gallery)) {
    // Check if it's old format (strings) or new format (objects)
    if (existingProfile.gallery.length > 0 && typeof existingProfile.gallery[0] === 'object' && 'images' in existingProfile.gallery[0]) {
      // New format (sections)
      allOldImageUrls = (existingProfile.gallery as any[]).flatMap(s => s.images || []);
    } else {
      // Old format (flat array)
      allOldImageUrls = existingProfile.gallery as string[];
    }
  }
  
  // Find images to delete
  for (const oldUrl of allOldImageUrls) {
    if (!allNewImageUrls.has(oldUrl)) {
      const path = extractPathFromUrl(oldUrl);
      if (path) pathsToDelete.push(path);
    }
  }

  // Delete the collected files from storage
  if (pathsToDelete.length > 0) {
    const uniquePaths = [...new Set(pathsToDelete)];
    console.log("Files to delete from storage:", uniquePaths);
    try {
      const { data, error } = await supabase.storage.from("profiles").remove(uniquePaths);
      if (error) {
        console.error("Error deleting files from storage:", error);
      } else {
        console.log("Successfully deleted files from storage:", data);
      }
    } catch (error) {
      console.error("Exception when deleting files from storage:", error);
    }
  } else {
    console.log("No files to delete from storage");
  }

  let client_email = undefined;
  let client_password = undefined;

  if (isSuper) {
    client_email = text(formData, "client_email") || null;
    const rawPass = text(formData, "client_password");
    if (rawPass) {
      client_password = await hashPassword(rawPass);
    }
  }

  const payload = {
    slug,
    enabled,
    reservation_enabled: isSuper ? bool(formData, "reservation_enabled") : existingProfile?.reservation_enabled,
    name,
    profession: text(formData, "profession"),
    bio: text(formData, "bio"),
    phone: text(formData, "phone"),
    phone2: text(formData, "phone2"),
    whatsapp: sanitizeUrl(formData, "whatsapp") ?? text(formData, "whatsapp"),
    whatsapp2: text(formData, "whatsapp2"),
    instagram: sanitizeUrl(formData, "instagram"),
    tiktok: sanitizeUrl(formData, "tiktok"),
    website: sanitizeUrl(formData, "website"),
    facebook: sanitizeUrl(formData, "facebook"),
    x: sanitizeUrl(formData, "x"),
    linkedin: sanitizeUrl(formData, "linkedin"),
    youtube: sanitizeUrl(formData, "youtube"),
    location: text(formData, "location"),
    location_url: sanitizeUrl(formData, "location_url"),
    cover_style: option(
      formData,
      "cover_style",
      ["auto", "square", "banner"],
      "auto",
    ),
    cover_position: option(
      formData,
      "cover_position",
      ["top", "center", "bottom"],
      "center",
    ),
    theme: option(
      formData,
      "theme",
      ["light", "dark", "premium", "emerald", "ruby", "violet", "sapphire", "sunset", "copper"],
      "light",
    ),
    ...(avatar ? { avatar_url: avatar } : removeAvatar ? { avatar_url: null } : {}),
    ...(background ? { background_url: background } : removeBackground ? { background_url: null } : {}),
    ...(cv ? { cv_url: cv } : removeCv ? { cv_url: null } : {}),
    gallery: newSections,
    ...(isSuper ? { client_email } : {}),
    ...(isSuper && client_password !== undefined ? { client_password } : {}),
  };

  const query = id
    ? supabase.from("profiles").update(payload).eq("id", id)
    : supabase.from("profiles").insert(payload);
  const { error } = await query;

  if (error) {
    if (error.code === "23505") {
      redirectWithSaveError("duplicate-slug");
    }

    redirectWithSaveError("save");
  }

  revalidatePath("/admin");
  revalidatePath(`/${slug}`);
  revalidatePath(`/u/${slug}`);
  redirect("/admin?saved=1");
}

export async function toggleProfile(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceSupabaseClient();
  const id = text(formData, "id");
  const enabled = formData.get("enabled") === "true";

  if (!supabase || !id) {
    throw new Error("Missing Supabase or profile id");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ enabled: !enabled })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProfile(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceSupabaseClient();
  const id = text(formData, "id");
  const slug = text(formData, "slug");

  if (!supabase || !id || !slug) {
    throw new Error("Missing Supabase or profile id or slug");
  }

  // First, get the profile to extract gallery URLs and other storage URLs
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, background_url, cv_url, gallery")
    .eq("id", id)
    .single();

  // Clean up storage files for this profile
  const folders = [`avatars/${slug}`, `backgrounds/${slug}`, `gallery/${slug}`, `cvs/${slug}`];
  const allPathsToDelete: string[] = [];

  // Collect files from folders
  for (const folder of folders) {
    try {
      const { data: files } = await supabase.storage.from("profiles").list(folder);
      if (files && files.length > 0) {
        const paths = files.map((f) => `${folder}/${f.name}`);
        allPathsToDelete.push(...paths);
      }
    } catch {
      // Storage cleanup is best-effort
    }
  }

  // Collect paths from profile URLs (avatar, background, cv, gallery)
  if (profile) {
    if (profile.avatar_url) {
      const path = extractPathFromUrl(profile.avatar_url);
      if (path) allPathsToDelete.push(path);
    }
    if (profile.background_url) {
      const path = extractPathFromUrl(profile.background_url);
      if (path) allPathsToDelete.push(path);
    }
    if (profile.cv_url) {
      const path = extractPathFromUrl(profile.cv_url);
      if (path) allPathsToDelete.push(path);
    }
    if (profile.gallery && Array.isArray(profile.gallery)) {
      let galleryUrls: string[] = [];
      if (profile.gallery.length > 0 && typeof profile.gallery[0] === 'object' && 'images' in profile.gallery[0]) {
        // New format (sections)
        galleryUrls = (profile.gallery as any[]).flatMap(s => s.images || []);
      } else {
        // Old format (flat array)
        galleryUrls = profile.gallery as string[];
      }
      for (const galleryUrl of galleryUrls) {
        const path = extractPathFromUrl(galleryUrl);
        if (path) allPathsToDelete.push(path);
      }
    }
  }

  // Delete all collected files (remove duplicates first)
  if (allPathsToDelete.length > 0) {
    const uniquePaths = [...new Set(allPathsToDelete)];
    console.log("All files to delete (including folders):", uniquePaths);
    try {
      const { data, error } = await supabase.storage.from("profiles").remove(uniquePaths);
      if (error) {
        console.error("Error deleting all files from storage:", error);
      } else {
        console.log("Successfully deleted all files from storage:", data);
      }
    } catch (error) {
      console.error("Exception when deleting all files from storage:", error);
    }
  } else {
    console.log("No files to delete from storage (delete operation)");
  }

  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/${slug}`);
  revalidatePath(`/u/${slug}`);
  redirect("/admin");
}

// RESTAURANT ACTIONS

const socialBaseUrlsForRestaurant = {
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@",
  facebook: "https://www.facebook.com/",
} as const;

function isBareSocialBaseUrlForRestaurant(key: string, value: string) {
  const baseUrl = socialBaseUrlsForRestaurant[key as keyof typeof socialBaseUrlsForRestaurant];
  if (!baseUrl) return false;
  return normalizeUrlForCompare(value) === normalizeUrlForCompare(baseUrl);
}

function sanitizeRestaurantUrl(formData: FormData, key: string): string | null {
  const value = text(formData, key);
  if (!value) return null;

  if (isBareSocialBaseUrlForRestaurant(key, value)) {
    return null;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return isValidUrl(value) ? value : null;
  }

  if (value.includes(".")) {
    const prefixed = `https://${value}`;
    return isValidUrl(prefixed) ? prefixed : null;
  }

  const username = value.replace(/^@/, "");
  switch (key) {
    case "instagram":
      return `https://www.instagram.com/${username}`;
    case "tiktok":
      return `https://www.tiktok.com/@${username}`;
    case "facebook":
      return `https://www.facebook.com/${username}`;
    default:
      const defaultPrefixed = `https://${value}`;
      return isValidUrl(defaultPrefixed) ? defaultPrefixed : null;
  }
}

export async function saveRestaurant(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    redirectWithSaveError("supabase", "/restoran");
  }

  const id = text(formData, "id");
  const rawSlug = text(formData, "slug");
  const name = text(formData, "name");

  // Load existing restaurant if we're updating
  let existingRestaurant: any = null;
  if (id) {
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      existingRestaurant = data;
    }
  }

  const slug = slugify(rawSlug || name || "");

  if (!slug || !name) {
    redirectWithSaveError("required", "/restoran");
  }

  const slugError = validateSlug(slug);
  if (slugError) {
    redirectWithSaveError(slugError, "/restoran");
  }

  const avatarFile = formData.get("avatar") as File | null;
  const coverFile = formData.get("cover") as File | null;
  const galleryFiles = formData
    .getAll("galleryFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  for (const file of [avatarFile, coverFile, ...galleryFiles]) {
    if (!(file instanceof File) || file.size === 0) {
      continue;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      redirectWithSaveError("file-too-large", "/restoran");
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      redirectWithSaveError("unsupported-image", "/restoran");
    }
  }

  const avatar = await uploadFile(avatarFile, `restaurants/avatars/${slug}`).catch(() =>
    redirectWithSaveError("upload", "/restoran")
  );
  const cover = await uploadFile(coverFile, `restaurants/covers/${slug}`).catch(() =>
    redirectWithSaveError("upload", "/restoran")
  );
  const galleryUploads = await Promise.all(
    galleryFiles.map((file) =>
      uploadFile(file, `restaurants/gallery/${slug}`).catch(() =>
        redirectWithSaveError("upload", "/restoran")
      )
    )
  );

  const existingGalleryUrls = text(formData, "gallery")?.split("\n").map((item) => item.trim()).filter((item) => item && isValidUrl(item)) ?? [];
  const newGalleryUrls = [...existingGalleryUrls, ...galleryUploads.filter((item): item is string => Boolean(item))];

  const removeAvatar = bool(formData, "remove_avatar");
  const removeCover = bool(formData, "remove_cover");

  // Collect files to delete from storage
  const pathsToDelete: string[] = [];

  // Delete old avatar if we're uploading a new one or removing it
  if ((avatar || removeAvatar) && existingRestaurant?.avatar_url) {
    const path = extractPathFromUrl(existingRestaurant.avatar_url);
    if (path) pathsToDelete.push(path);
  }

  // Delete old cover if we're uploading a new one or removing it
  if ((cover || removeCover) && existingRestaurant?.cover_url) {
    const path = extractPathFromUrl(existingRestaurant.cover_url);
    if (path) pathsToDelete.push(path);
  }

  // Delete gallery images that are no longer in the new list
  if (existingRestaurant?.gallery && Array.isArray(existingRestaurant.gallery)) {
    const oldGalleryUrls = existingRestaurant.gallery as string[];
    const oldGallerySet = new Set(oldGalleryUrls);
    const newGallerySet = new Set(newGalleryUrls);
    for (const oldUrl of oldGallerySet) {
      if (!newGallerySet.has(oldUrl)) {
        const path = extractPathFromUrl(oldUrl);
        if (path) pathsToDelete.push(path);
      }
    }
  }

  // Delete the collected files from storage
  if (pathsToDelete.length > 0) {
    const uniquePaths = [...new Set(pathsToDelete)];
    console.log("Files to delete from storage:", uniquePaths);
    try {
      const { data, error } = await supabase.storage.from("profiles").remove(uniquePaths);
      if (error) {
        console.error("Error deleting files from storage:", error);
      } else {
        console.log("Successfully deleted files from storage:", data);
      }
    } catch (error) {
      console.error("Exception when deleting files from storage:", error);
    }
  } else {
    console.log("No files to delete from storage");
  }

  const payload = {
    slug,
    enabled: bool(formData, "enabled"),
    name,
    description: text(formData, "description"),
    phone: text(formData, "phone"),
    instagram: sanitizeRestaurantUrl(formData, "instagram"),
    tiktok: sanitizeRestaurantUrl(formData, "tiktok"),
    facebook: sanitizeRestaurantUrl(formData, "facebook"),
    menu_url: sanitizeRestaurantUrl(formData, "menu_url"),
    location_name: text(formData, "location_name"),
    location_url: sanitizeRestaurantUrl(formData, "location_url"),
    cover_style: option(
      formData,
      "cover_style",
      ["auto", "square", "banner"],
      "auto"
    ),
    cover_position: option(
      formData,
      "cover_position",
      ["top", "center", "bottom"],
      "center"
    ),
    theme: option(
      formData,
      "theme",
      ["light", "dark", "premium", "emerald", "ruby", "violet", "sapphire", "sunset", "copper"],
      "light"
    ),
    ...(avatar ? { avatar_url: avatar } : removeAvatar ? { avatar_url: null } : {}),
    ...(cover ? { cover_url: cover } : removeCover ? { cover_url: null } : {}),
    gallery: newGalleryUrls,
    revenue: parseFloat(text(formData, "revenue") || "0") || 0,
    orders_count: parseInt(text(formData, "orders_count") || "0") || 0,
    rating: parseFloat(text(formData, "rating") || "0") || 0,
  };

  const query = id
    ? supabase.from("restaurants").update(payload).eq("id", id)
    : supabase.from("restaurants").insert(payload);
  const { error } = await query;

  if (error) {
    if (error.code === "23505") {
      redirectWithSaveError("duplicate-slug", "/restoran");
    }
    redirectWithSaveError("save", "/restoran");
  }

  revalidatePath("/admin");
  revalidatePath("/restoran");
  redirect("/restoran?saved=1");
}

export async function toggleRestaurant(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceSupabaseClient();
  const id = text(formData, "id");
  const enabled = formData.get("enabled") === "true";

  if (!supabase || !id) {
    throw new Error("Missing Supabase or restaurant id");
  }

  const { error } = await supabase
    .from("restaurants")
    .update({ enabled: !enabled })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/restoran");
  redirect("/restoran");
}

export async function deleteRestaurant(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceSupabaseClient();
  const id = text(formData, "id");
  const slug = text(formData, "slug");

  if (!supabase || !id || !slug) {
    throw new Error("Missing Supabase or restaurant id or slug");
  }

  // First, get the restaurant to extract gallery URLs and other storage URLs
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("avatar_url, cover_url, gallery")
    .eq("id", id)
    .single();

  // Clean up storage files for this restaurant
  const folders = [`restaurants/avatars/${slug}`, `restaurants/covers/${slug}`, `restaurants/gallery/${slug}`];
  const allPathsToDelete: string[] = [];

  // Collect files from folders
  for (const folder of folders) {
    try {
      const { data: files } = await supabase.storage.from("profiles").list(folder);
      if (files && files.length > 0) {
        const paths = files.map((f) => `${folder}/${f.name}`);
        allPathsToDelete.push(...paths);
      }
    } catch {
      // Storage cleanup is best-effort
    }
  }

  // Collect paths from restaurant URLs (avatar, cover, gallery)
  if (restaurant) {
    if (restaurant.avatar_url) {
      const path = extractPathFromUrl(restaurant.avatar_url);
      if (path) allPathsToDelete.push(path);
    }
    if (restaurant.cover_url) {
      const path = extractPathFromUrl(restaurant.cover_url);
      if (path) allPathsToDelete.push(path);
    }
    if (restaurant.gallery && Array.isArray(restaurant.gallery)) {
      const galleryUrls = restaurant.gallery as string[];
      for (const galleryUrl of galleryUrls) {
        const path = extractPathFromUrl(galleryUrl);
        if (path) allPathsToDelete.push(path);
      }
    }
  }

  // Delete all collected files (remove duplicates first)
  if (allPathsToDelete.length > 0) {
    const uniquePaths = [...new Set(allPathsToDelete)];
    console.log("All files to delete (including folders):", uniquePaths);
    try {
      const { data, error } = await supabase.storage.from("profiles").remove(uniquePaths);
      if (error) {
        console.error("Error deleting all files from storage:", error);
      } else {
        console.log("Successfully deleted all files from storage:", data);
      }
    } catch (error) {
      console.error("Exception when deleting all files from storage:", error);
    }
  } else {
    console.log("No files to delete from storage (delete operation)");
  }

  const { error } = await supabase.from("restaurants").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/restoran");
  redirect("/restoran");
}

export async function submitRestaurantReview(formData: FormData) {
  const supabase = createServiceSupabaseClient();
  const restaurantId = text(formData, "restaurant_id");
  const rating = parseInt(text(formData, "rating") || "0", 10);
  const comment = text(formData, "comment");

  if (!supabase || !restaurantId || !rating || rating < 1 || rating > 5) {
    throw new Error("Invalid input");
  }

  const { error } = await supabase.from("restaurant_reviews").insert({
    restaurant_id: restaurantId,
    rating,
    comment
  });

  if (error) {
    throw new Error(error.message);
  }

  // Get the slug to revalidate
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("id", restaurantId)
    .single();

  if (restaurant) {
    revalidatePath(`/${restaurant.slug}`);
  }
}
