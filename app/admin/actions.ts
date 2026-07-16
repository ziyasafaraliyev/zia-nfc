"use server";

import { createServiceSupabaseClient } from "@/lib/supabase";
import {
  type GalleryFileMetaEntry,
  getUploadFileName,
  guessMimeType,
  isAllowedImageMime,
  isImageMime,
  asUploadEntry,
  isUploadEntry,
  safeImageExtension,
} from "@/lib/upload-entry";
import {
  clearRateAttempts,
  isRateLimited as isRateLimitedKey,
  recordRateAttempt,
  safeInternalPath,
  timingSafeEqualString,
  isSafeHttpUrl,
  clientIpFromHeaders,
} from "@/lib/security";
import { parseRestaurantMenu } from "@/lib/menu";
import { revalidatePath, revalidateTag } from "next/cache";
import { profileCacheTag } from "@/lib/profiles";
import { restaurantCacheTag } from "@/lib/restaurants";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sharp from "sharp";


// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const ADMIN_COOKIE = "zia_admin_session";
const MAX_UPLOAD_SIZE = 20 * 1024 * 1024; // 20 MB (portfolio / profil yükləmələri)
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
  // SVG intentionally blocked — XSS risk when served publicly
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
  "favicon.webp",
  "robots.txt",
  "sitemap.xml",
  "pay",
  "demo",
  "restoran",
  "r",
  "about",
  "privacy-policy",
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
// Rate Limiting (login — stricter)
// ──────────────────────────────────────────────
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60_000; // 15 minutes

function isRateLimited(ip: string): boolean {
  return isRateLimitedKey(`login:${ip}`, MAX_LOGIN_ATTEMPTS, RATE_LIMIT_WINDOW_MS);
}

function recordLoginAttempt(ip: string): void {
  recordRateAttempt(`login:${ip}`, RATE_LIMIT_WINDOW_MS);
}

function clearLoginAttempts(ip: string): void {
  clearRateAttempts(`login:${ip}`);
}

async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  return clientIpFromHeaders(hdrs);
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

function jsonField(formData: FormData, key: string): unknown | null {
  const value = formData.get(key);
  if (typeof value !== "string" || !value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

type GallerySectionInput = {
  id: string;
  name?: string;
  images?: string[];
};

type CatalogItemInput = {
  id?: string;
  name?: string;
  url?: string;
};

type UploadPayload = {
  blob: File | Blob;
  fileName: string;
  mimeType: string;
};

function collectGallerySectionFiles(
  formData: FormData,
  sections: GallerySectionInput[],
): { sectionId: string; files: UploadPayload[] }[] {
  const sectionFilesMap = new Map<string, UploadPayload[]>();

  const appendFiles = (sectionId: string, files: UploadPayload[]) => {
    if (!sectionId || files.length === 0) {
      return;
    }
    const existing = sectionFilesMap.get(sectionId) ?? [];
    sectionFilesMap.set(sectionId, [...existing, ...files]);
  };

  const metaRaw = jsonField(formData, "galleryFileMeta");
  const meta: GalleryFileMetaEntry[] = Array.isArray(metaRaw)
    ? metaRaw.filter(
        (entry): entry is GalleryFileMetaEntry =>
          typeof entry === "object" &&
          entry !== null &&
          "sectionId" in entry &&
          typeof (entry as GalleryFileMetaEntry).sectionId === "string",
      )
    : [];

  const indexedFiles = formData
    .getAll("galleryFiles")
    .map(asUploadEntry)
    .filter((entry): entry is File | Blob => entry !== null);

  if (meta.length > 0 && indexedFiles.length > 0) {
    indexedFiles.forEach((blob, index) => {
      const entry = meta[index];
      const sectionId = entry?.sectionId ?? "";
      if (!sectionId) {
        return;
      }

      const fileName = getUploadFileName(blob, entry.fileName);
      const mimeType = guessMimeType(fileName, entry.mimeType || blob.type);

      appendFiles(sectionId, [{ blob, fileName, mimeType }]);
    });
  }

  for (const section of sections) {
    const sectionId = section.id;
    if (!sectionId) {
      continue;
    }

    const legacyFiles = formData
      .getAll(`galleryFiles_${sectionId}`)
      .map(asUploadEntry)
      .filter((entry): entry is File | Blob => entry !== null);

    if (legacyFiles.length > 0 && !sectionFilesMap.has(sectionId)) {
      appendFiles(
        sectionId,
        legacyFiles.map((blob, index) => {
          const fileName = getUploadFileName(blob, `portfolio-${index + 1}.jpg`);
          return {
            blob,
            fileName,
            mimeType: guessMimeType(fileName, blob.type),
          };
        }),
      );
    }
  }

  return Array.from(sectionFilesMap.entries()).map(([sectionId, files]) => ({
    sectionId,
    files,
  }));
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
  return isSafeHttpUrl(url);
}

const socialBaseUrls = {
  whatsapp: "https://wa.me/994",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@",
  telegram: "https://t.me/",
  threads: "https://www.threads.net/@",
  website: "https://",
  waze: "https://www.waze.com/ul?ll=",
  facebook: "https://www.facebook.com/",
  x: "https://x.com/",
  linkedin: "https://www.linkedin.com/in/",
  youtube: "https://www.youtube.com/@",
  behance: "https://www.behance.net/",
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

  if (key === "website") {
    const trimmed = value.trim();
    const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

    try {
      const parsed = new URL(withProtocol);
      parsed.protocol = "https:";
      if (parsed.hostname.startsWith("www.")) {
        parsed.hostname = parsed.hostname.replace(/^www\./, "");
      }
      return parsed.toString();
    } catch {
      return null;
    }
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
    case "telegram":
      return `https://t.me/${username}`;
    case "threads":
      return `https://www.threads.net/@${username}`;
    case "facebook":
      return `https://www.facebook.com/${username}`;
    case "x":
      return `https://x.com/${username}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${username}`;
    case "youtube":
      return `https://www.youtube.com/@${username}`;
    case "behance":
      return `https://www.behance.net/${username}`;
    case "waze":
      // If user supplied coordinates like "40.4093,49.8671" convert to waze link
      const coordMatch = value.match(/^\s*([+-]?\d{1,3}\.\d+),\s*([+-]?\d{1,3}\.\d+)\s*$/);
      if (coordMatch) {
        const lat = coordMatch[1];
        const lon = coordMatch[2];
        return `https://www.waze.com/ul?ll=${lat},${lon}&navigate=yes`;
      }
      // Otherwise try prefixing with https://
      const prefixed = `https://${value}`;
      return isValidUrl(prefixed) ? prefixed : null;
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
// File Upload — raster images ALWAYS stored as .webp
// ──────────────────────────────────────────────

const IMAGE_EXTS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "heic",
  "heif",
  "tif",
  "tiff",
  "avif",
]);

type UploadKind = "avatar" | "cover" | "gallery" | "other";

function maxEdgeForKind(kind: UploadKind | undefined): number {
  switch (kind) {
    case "avatar":
      return 1200; // profil şəkli — full frame, fit inside (no crop)
    case "cover":
      return 2000; // cover / background
    case "gallery":
      return 1600;
    default:
      return 1600;
  }
}

/**
 * Decode any raster input → strip EXIF → optional resize → WebP only.
 * Output filename extension is always `.webp`.
 */
async function encodeRasterToWebp(
  input: Buffer,
  opts?: { maxEdge?: number; quality?: number },
): Promise<Buffer> {
  const maxEdge = opts?.maxEdge ?? 1600;
  let quality = opts?.quality ?? 82;

  const meta = await sharp(input, { failOn: "none", animated: false })
    .rotate()
    .metadata();
  const longestSide = Math.max(meta.width || 0, meta.height || 0);

  const build = (q: number) => {
    // rotate() applies EXIF orientation first so phone photos are not skewed/cropped
    let pipeline = sharp(input, { failOn: "none", animated: false }).rotate();
    if (maxEdge > 0 && longestSide > maxEdge) {
      // "inside" = scale to fit maxEdge, keep aspect ratio, NEVER crop/zoom
      pipeline = pipeline.resize({
        width: maxEdge,
        height: maxEdge,
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    return pipeline
      .webp({
        quality: q,
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer();
  };

  let webpBuffer = await build(quality);
  while (webpBuffer.length > MAX_UPLOAD_SIZE && quality > 40) {
    quality -= 12;
    webpBuffer = await build(quality);
  }
  if (webpBuffer.length > MAX_UPLOAD_SIZE) {
    throw new Error("File too large after compression");
  }
  return webpBuffer;
}

async function uploadFile(
  file: Blob | File | null,
  folder: string,
  options?: {
    fileName?: string;
    mimeType?: string;
    /** avatar | cover | gallery — sets max edge before WebP encode */
    kind?: UploadKind;
  },
) {
  if (!file || file.size === 0) {
    return null;
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("File too large");
  }

  // Sanitize folder — only allow path segments without traversal
  const safeFolder = folder
    .split("/")
    .map((s) => s.replace(/[^a-zA-Z0-9._-]/g, ""))
    .filter(Boolean)
    .join("/");
  if (!safeFolder || safeFolder.includes("..")) {
    throw new Error("Invalid upload path");
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return null;
  }

  const fileName = getUploadFileName(file, options?.fileName);
  const mimeType = guessMimeType(fileName, options?.mimeType || file.type);
  const extFromName = (fileName.split(".").pop() || "").toLowerCase();

  // Block SVG and other scriptable types
  if (
    mimeType === "image/svg+xml" ||
    fileName.toLowerCase().endsWith(".svg") ||
    mimeType === "text/html" ||
    mimeType === "application/javascript"
  ) {
    throw new Error("File type not allowed");
  }

  const looksLikeImage =
    (isImageMime(mimeType) && mimeType !== "image/svg+xml") ||
    IMAGE_EXTS.has(extFromName);

  let fileToUpload: Blob | Buffer;
  let contentType: string;
  let ext: string;

  if (looksLikeImage) {
    // ALWAYS re-encode to WebP (jpg/png/heic/… → .webp)
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      const webpBuffer = await encodeRasterToWebp(buffer, {
        maxEdge: maxEdgeForKind(options?.kind),
        quality:
          options?.kind === "avatar"
            ? 88
            : options?.kind === "cover"
              ? 86
              : 82,
      });
      fileToUpload = webpBuffer;
      contentType = "image/webp";
      ext = "webp";
    } catch (err) {
      if (err instanceof Error && err.message.includes("too large")) throw err;
      throw new Error("Invalid image file");
    }
  } else if (mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
    // PDF only for CV — magic-byte check
    const buffer = Buffer.from(await file.arrayBuffer());
    const header = buffer.subarray(0, 5).toString("utf8");
    if (!header.startsWith("%PDF")) {
      throw new Error("Invalid PDF file");
    }
    fileToUpload = buffer;
    contentType = "application/pdf";
    ext = "pdf";
  } else {
    throw new Error("File type not allowed");
  }

  // Path always ends with .webp for images
  const path = `${safeFolder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("profiles").upload(path, fileToUpload, {
    contentType,
    cacheControl: "31536000",
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

function setAdminSessionCookie(token: string) {
  // Fire-and-forget pattern via returned promise from cookies()
  return cookies().then((store) => {
    store.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
      path: "/",
      // Prefer __Host- style constraints when possible (path=/ + secure + no domain)
    });
  });
}

export async function loginAdmin(formData: FormData) {
  const ip = await getClientIp();
  const redirectTo = safeInternalPath(text(formData, "redirectTo"), "/admin");
  const failRedirect = `/admin?error=login&redirectTo=${encodeURIComponent(redirectTo)}`;

  // Rate limit check
  if (isRateLimited(ip)) {
    redirect(
      `/admin?error=rate-limited&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }

  const email = text(formData, "email")?.toLowerCase() ?? null;
  const password = text(formData, "password");
  const allowedEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const allowedPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length > 200 || email.length > 254) {
    recordLoginAttempt(ip);
    redirect(failRedirect);
  }

  // 1. Try Super Admin login (timing-safe compares)
  if (
    allowedEmail &&
    allowedPassword &&
    timingSafeEqualString(email, allowedEmail) &&
    timingSafeEqualString(password, allowedPassword)
  ) {
    clearLoginAttempts(ip);
    const token = createSessionToken(email);
    await setAdminSessionCookie(token);
    redirect(redirectTo);
  }

  // 2. Try Client Admin login (bcrypt)
  const supabase = createServiceSupabaseClient();
  if (supabase) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("client_email, client_password")
      .eq("client_email", email)
      .single();

    if (profile?.client_password) {
      if (await verifyPassword(password, profile.client_password)) {
        clearLoginAttempts(ip);
        const token = createSessionToken(email);
        await setAdminSessionCookie(token);
        redirect(redirectTo);
      }
    } else {
      // Dummy bcrypt (valid hash of unrelated secret) to reduce user-enumeration timing
      await bcrypt.compare(
        password,
        "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
      );
    }
  }

  // Failed login
  recordLoginAttempt(ip);
  redirect(failRedirect);
}

export async function logoutAdmin() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
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
  const galleryRaw = jsonField(formData, "gallery");
  const sections: GallerySectionInput[] = Array.isArray(galleryRaw)
    ? galleryRaw.filter(
        (section): section is GallerySectionInput =>
          typeof section === "object" &&
          section !== null &&
          "id" in section &&
          typeof (section as GallerySectionInput).id === "string",
      )
    : [];

  const expectedSectionCount = Number.parseInt(
    text(formData, "gallerySectionCount") ?? String(sections.length),
    10,
  );

  const sectionFiles = collectGallerySectionFiles(formData, sections);

  const metaRaw = jsonField(formData, "galleryFileMeta");
  const expectedUploadCount = Array.isArray(metaRaw) ? metaRaw.length : 0;
  const receivedUploadCount = sectionFiles.reduce(
    (total, entry) => total + entry.files.length,
    0,
  );

  if (expectedUploadCount > 0 && receivedUploadCount === 0) {
    redirectWithSaveError("gallery-files-missing");
  }

  const MAX_GALLERY_IMAGES = 30;
  let totalFiles = 0;
  for (const { files } of sectionFiles) {
    totalFiles += files.length;
  }
  if (totalFiles > MAX_GALLERY_IMAGES) {
    redirectWithSaveError("too-many-gallery-images");
  }

  for (const rawFile of [avatarFile, backgroundFile]) {
    const file = asUploadEntry(rawFile);
    if (!file) {
      continue;
    }

    const fileName = getUploadFileName(file);
    const mimeType = guessMimeType(fileName, file.type);

    if (file.size > MAX_UPLOAD_SIZE) {
      redirectWithSaveError("file-too-large");
    }

    if (!isAllowedImageMime(mimeType, fileName)) {
      redirectWithSaveError("unsupported-image");
    }
  }

  for (const upload of sectionFiles.flatMap((entry) => entry.files)) {
    if (upload.blob.size > MAX_UPLOAD_SIZE) {
      redirectWithSaveError("file-too-large");
    }

    if (!isAllowedImageMime(upload.mimeType, upload.fileName)) {
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

  const avatarUpload = asUploadEntry(avatarFile);
  const backgroundUpload = asUploadEntry(backgroundFile);
  const cvUpload = asUploadEntry(cvFile);

  const avatar = avatarUpload
    ? await uploadFile(avatarUpload, `avatars/${slug}`, {
        fileName: getUploadFileName(avatarUpload),
        mimeType: guessMimeType(getUploadFileName(avatarUpload), avatarUpload.type),
        kind: "avatar",
      }).catch(() => redirectWithSaveError("upload"))
    : null;
  const background = backgroundUpload
    ? await uploadFile(backgroundUpload, `backgrounds/${slug}`, {
        fileName: getUploadFileName(backgroundUpload),
        mimeType: guessMimeType(getUploadFileName(backgroundUpload), backgroundUpload.type),
        kind: "cover",
      }).catch(() => redirectWithSaveError("upload"))
    : null;
  const cv = cvUpload
    ? await uploadFile(cvUpload, `cvs/${slug}`, {
        fileName: getUploadFileName(cvUpload, "cv.pdf"),
        mimeType: guessMimeType(getUploadFileName(cvUpload, "cv.pdf"), cvUpload.type),
      }).catch(() => redirectWithSaveError("upload"))
    : null;

  // Upload files for each section (sequential to avoid storage rate limits)
  const sectionUploads: { [key: string]: string[] } = {};
  for (const { sectionId, files } of sectionFiles) {
    const uploads: string[] = [];
    for (const upload of files) {
      try {
        const url = await uploadFile(upload.blob, `gallery/${slug}`, {
          fileName: upload.fileName,
          mimeType: upload.mimeType,
          kind: "gallery",
        });
        if (!url) {
          redirectWithSaveError("upload");
        }
        uploads.push(url);
      } catch {
        redirectWithSaveError("upload");
      }
    }
    sectionUploads[sectionId] = uploads;
  }

  if (expectedUploadCount > 0 && receivedUploadCount > 0) {
    const uploadedCount = Object.values(sectionUploads).reduce(
      (total, urls) => total + urls.length,
      0,
    );
    if (uploadedCount < receivedUploadCount) {
      redirectWithSaveError("upload");
    }
  }

  // Portfolio sections: images only
  const newSections = sections.map((section) => ({
    id: section.id,
    name: section.name || "Untitled",
    images: [
      ...(section.images || []),
      ...(sectionUploads[section.id] || []),
    ],
  }));

  // Separate catalog: title + URL links
  const catalogRaw = jsonField(formData, "catalog");
  const catalogItems: CatalogItemInput[] = Array.isArray(catalogRaw)
    ? catalogRaw.filter(
        (item): item is CatalogItemInput =>
          typeof item === "object" && item !== null,
      )
    : [];
  const parsedCatalog = catalogItems
    .map((item) => {
      const rawUrl = typeof item.url === "string" ? item.url.trim() : "";
      if (!rawUrl) return null;
      const withProtocol = /^https?:\/\//i.test(rawUrl)
        ? rawUrl
        : `https://${rawUrl}`;
      if (!isValidUrl(withProtocol)) return null;
      return {
        id:
          typeof item.id === "string" && item.id
            ? item.id
            : crypto.randomUUID(),
        name:
          typeof item.name === "string" && item.name.trim()
            ? item.name.trim()
            : "Kataloq",
        url: withProtocol,
      };
    })
    .filter((item): item is { id: string; name: string; url: string } =>
      Boolean(item),
    );

  // Don't wipe existing catalog when form posts empty by accident
  // (stale admin tab / save without reloading). Explicit clear still works
  // when admin sends catalog_clear=on.
  const existingCatalog = Array.isArray(existingProfile?.catalog)
    ? (existingProfile.catalog as { id: string; name: string; url: string }[])
    : [];
  const clearCatalog = bool(formData, "catalog_clear");
  const newCatalog =
    parsedCatalog.length > 0
      ? parsedCatalog
      : clearCatalog
        ? []
        : existingCatalog.length > 0
          ? existingCatalog
          : [];

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
    portfolio_enabled: isSuper
      ? bool(formData, "portfolio_enabled")
      : (existingProfile?.portfolio_enabled ?? true),
    referral_enabled: isSuper
      ? bool(formData, "referral_enabled")
      : (existingProfile?.referral_enabled ?? false),
    ...(isSuper
      ? { referral_url: sanitizeUrl(formData, "referral_url") || null }
      : {}),
    name,
    profession: text(formData, "profession"),
    email: text(formData, "email") || null,
    bio: text(formData, "bio"),
    phone: text(formData, "phone"),
    phone2: text(formData, "phone2"),
    whatsapp: sanitizeUrl(formData, "whatsapp") ?? text(formData, "whatsapp"),
    whatsapp2: text(formData, "whatsapp2"),
    instagram: sanitizeUrl(formData, "instagram"),
    tiktok: sanitizeUrl(formData, "tiktok"),
    telegram: sanitizeUrl(formData, "telegram"),
    threads: sanitizeUrl(formData, "threads"),
    website: sanitizeUrl(formData, "website"),
    waze: sanitizeUrl(formData, "waze"),
    facebook: sanitizeUrl(formData, "facebook"),
    x: sanitizeUrl(formData, "x"),
    linkedin: sanitizeUrl(formData, "linkedin"),
    youtube: sanitizeUrl(formData, "youtube"),
    behance: sanitizeUrl(formData, "behance"),
    location: text(formData, "location"),
    location_url: sanitizeUrl(formData, "location_url"),
    ...(isSuper ? { google_review_url: sanitizeUrl(formData, "google_review_url") || null } : {}),
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
    catalog: newCatalog,
    ...(isSuper ? { client_email } : {}),
    ...(isSuper && client_password !== undefined ? { client_password } : {}),
  };

  const query = id
    ? supabase.from("profiles").update(payload).eq("id", id).select("gallery").single()
    : supabase.from("profiles").insert(payload).select("gallery").single();
  const { data: savedProfile, error } = await query;

  if (error) {
    if (error.code === "23505") {
      redirectWithSaveError("duplicate-slug");
    }

    redirectWithSaveError("save");
  }

  const savedGallery = savedProfile?.gallery;
  const savedSectionCount = Array.isArray(savedGallery)
    ? savedGallery.filter(
        (section) =>
          typeof section === "object" &&
          section !== null &&
          "id" in section,
      ).length
    : 0;

  if (
    Number.isFinite(expectedSectionCount) &&
    expectedSectionCount > 0 &&
    savedSectionCount < expectedSectionCount
  ) {
    redirectWithSaveError("gallery-save-mismatch");
  }

  revalidatePath("/admin");
  revalidatePath(`/${slug}`);
  revalidatePath(`/u/${slug}`);
  revalidateTag(profileCacheTag(slug));
  revalidateTag("profiles");
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
  revalidateTag(profileCacheTag(slug));
  revalidateTag("profiles");
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

  const avatarUpload = asUploadEntry(formData.get("avatar"));
  const coverUpload = asUploadEntry(formData.get("cover"));
  const galleryFiles = formData
    .getAll("galleryFiles")
    .map(asUploadEntry)
    .filter((entry): entry is File | Blob => entry !== null);

  for (const file of [avatarUpload, coverUpload, ...galleryFiles].filter(Boolean)) {
    const upload = file!;
    const fileName = getUploadFileName(upload);
    const mimeType = guessMimeType(fileName, upload.type);

    if (upload.size > MAX_UPLOAD_SIZE) {
      redirectWithSaveError("file-too-large", "/restoran");
    }

    if (!isAllowedImageMime(mimeType, fileName)) {
      redirectWithSaveError("unsupported-image", "/restoran");
    }
  }

  const avatar = avatarUpload
    ? await uploadFile(avatarUpload, `restaurants/avatars/${slug}`, {
        fileName: getUploadFileName(avatarUpload),
        mimeType: guessMimeType(getUploadFileName(avatarUpload), avatarUpload.type),
        kind: "avatar",
      }).catch(() => redirectWithSaveError("upload", "/restoran"))
    : null;
  const cover = coverUpload
    ? await uploadFile(coverUpload, `restaurants/covers/${slug}`, {
        fileName: getUploadFileName(coverUpload),
        mimeType: guessMimeType(getUploadFileName(coverUpload), coverUpload.type),
        kind: "cover",
      }).catch(() => redirectWithSaveError("upload", "/restoran"))
    : null;
  const galleryUploads = await Promise.all(
    galleryFiles.map((file) =>
      uploadFile(file, `restaurants/gallery/${slug}`, {
        fileName: getUploadFileName(file),
        mimeType: guessMimeType(getUploadFileName(file), file.type),
        kind: "gallery",
      }).catch(() => redirectWithSaveError("upload", "/restoran"))
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
    menu: parseRestaurantMenu(text(formData, "menu_json") || "[]"),
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
  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/menyu`);
  revalidatePath(`/${slug}/sebet`);
  revalidatePath(`/${slug}/ode`);
  revalidatePath(`/${slug}/hazir`);
  revalidatePath(`/r/${slug}`);
  revalidatePath(`/r/${slug}/menyu`);
  revalidateTag(restaurantCacheTag(slug));
  revalidateTag("restaurants");
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
  const ip = await getClientIp();
  if (isRateLimitedKey(`review:${ip}`, 10, 60_000)) {
    throw new Error("Too many reviews");
  }
  recordRateAttempt(`review:${ip}`, 60_000);

  const supabase = createServiceSupabaseClient();
  const restaurantId = text(formData, "restaurant_id");
  const rating = parseInt(text(formData, "rating") || "0", 10);
  const commentRaw = text(formData, "comment");
  const comment = commentRaw
    ? commentRaw.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").slice(0, 500)
    : null;

  // UUID v4-ish
  if (
    !supabase ||
    !restaurantId ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      restaurantId,
    ) ||
    !rating ||
    rating < 1 ||
    rating > 5
  ) {
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
