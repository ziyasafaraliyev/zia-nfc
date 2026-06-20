"use server";

import { createServiceSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const ADMIN_COOKIE = "zia_admin_session";
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
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
  const secret = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error("SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY must be set");
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
const MAX_LOGIN_ATTEMPTS = 5;
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
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
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

function sanitizeUrl(formData: FormData, key: string): string | null {
  const value = text(formData, key);
  if (!value) return null;

  // Allow phone-like values for whatsapp field (just digits)
  if (key === "whatsapp" && /^\+?[\d\s\-()]+$/.test(value)) {
    return value;
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
      return `https://instagram.com/${username}`;
    case "tiktok":
      return `https://tiktok.com/@${username}`;
    case "facebook":
      return `https://facebook.com/${username}`;
    case "x":
      return `https://x.com/${username}`;
    case "linkedin":
      return `https://linkedin.com/in/${username}`;
    case "youtube":
      return `https://youtube.com/@${username}`;
    default:
      const defaultPrefixed = `https://${value}`;
      return isValidUrl(defaultPrefixed) ? defaultPrefixed : null;
  }
}

// ──────────────────────────────────────────────
// Redirect helpers
// ──────────────────────────────────────────────
function redirectWithSaveError(error: string): never {
  redirect(`/admin?error=${encodeURIComponent(error)}`);
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

  // Sanitize file extension — only allow known safe extensions
  const rawExt = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif", "pdf"]);
  const ext = safeExtensions.has(rawExt) ? rawExt : "jpg";

  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("profiles").upload(path, file, {
    contentType: file.type || "application/octet-stream",
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

  // Rate limit check
  if (isRateLimited(ip)) {
    redirect("/admin?error=rate-limited");
  }

  const email = text(formData, "email");
  const password = text(formData, "password");
  const allowedEmail = process.env.ADMIN_EMAIL;
  const allowedPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    redirect("/admin?error=login");
  }

  // 1. Try Super Admin login
  if (
    allowedEmail &&
    allowedPassword &&
    email === allowedEmail &&
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

    redirect("/admin");
  }

  // 2. Try Client Admin login
  const supabase = createServiceSupabaseClient();
  if (supabase) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("client_email, client_password")
      .eq("client_email", email)
      .single();

    if (profile && profile.client_password) {
      const hashedPassword = hashPassword(password);
      if (profile.client_password === hashedPassword) {
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

        redirect("/admin");
      }
    }
  }

  // Failed login
  recordLoginAttempt(ip);
  redirect("/admin?error=login");
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

  // Load existing profile if it's a Client Admin to preserve critical fields
  let existingProfile: any = null;
  const isSuper = session.role === "super_admin";

  if (!isSuper) {
    if (!id || id !== session.profileId) {
      redirectWithSaveError("unauthorized");
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (!data) {
      redirectWithSaveError("save");
    }
    existingProfile = data;
  }

  const slug = isSuper
    ? slugify(rawSlug || name || "")
    : existingProfile.slug;

  const enabled = isSuper
    ? bool(formData, "enabled")
    : existingProfile.enabled;

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
  const galleryFiles = formData
    .getAll("galleryFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  for (const file of [avatarFile, backgroundFile, ...galleryFiles]) {
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
  const galleryUploads = await Promise.all(
    galleryFiles.map((file) =>
      uploadFile(file, `gallery/${slug}`).catch(() =>
        redirectWithSaveError("upload"),
      ),
    ),
  );

  const galleryUrls = [
    ...(text(formData, "gallery")
      ?.split("\n")
      .map((item) => item.trim())
      .filter((item) => item && isValidUrl(item)) ?? []),
    ...galleryUploads.filter((item): item is string => Boolean(item)),
  ];

  const removeAvatar = bool(formData, "remove_avatar");
  const removeBackground = bool(formData, "remove_background");
  const removeCv = bool(formData, "remove_cv");

  let client_email = undefined;
  let client_password = undefined;

  if (isSuper) {
    client_email = text(formData, "client_email") || null;
    const rawPass = text(formData, "client_password");
    if (rawPass) {
      client_password = hashPassword(rawPass);
    }
  }

  const payload = {
    slug,
    enabled,
    name,
    profession: text(formData, "profession"),
    bio: text(formData, "bio"),
    phone: text(formData, "phone"),
    whatsapp: sanitizeUrl(formData, "whatsapp") ?? text(formData, "whatsapp"),
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
      ["light", "dark"],
      "light",
    ),
    ...(avatar ? { avatar_url: avatar } : removeAvatar ? { avatar_url: null } : {}),
    ...(background ? { background_url: background } : removeBackground ? { background_url: null } : {}),
    ...(cv ? { cv_url: cv } : removeCv ? { cv_url: null } : {}),
    gallery: galleryUrls,
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

  // Clean up storage files for this profile
  const folders = [`avatars/${slug}`, `backgrounds/${slug}`, `gallery/${slug}`, `cvs/${slug}`];
  for (const folder of folders) {
    try {
      const { data: files } = await supabase.storage.from("profiles").list(folder);
      if (files && files.length > 0) {
        const paths = files.map((f) => `${folder}/${f.name}`);
        await supabase.storage.from("profiles").remove(paths);
      }
    } catch {
      // Storage cleanup is best-effort
    }
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
