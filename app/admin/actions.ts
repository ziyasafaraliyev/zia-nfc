"use server";

import { createServiceSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adminCookie = "zia_admin_email";
const maxUploadSize = 5 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

async function requireAdmin() {
  const store = await cookies();
  const email = store.get(adminCookie)?.value;
  const allowedEmail = process.env.ADMIN_EMAIL || "ziya@gmail.com";
  if (!email || email !== allowedEmail) {
    throw new Error("Admin session not found");
  }
}

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
    .replace(/^\/+|\/+$/g, "");
}

function redirectWithSaveError(error: string): never {
  redirect(`/admin?error=${encodeURIComponent(error)}`);
}

async function uploadFile(file: File | null, folder: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return null;
  }

  const ext = file.name.split(".").pop() || "jpg";
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

export async function loginAdmin(formData: FormData) {
  const email = text(formData, "email");
  const password = text(formData, "password");
  const allowedEmail = process.env.ADMIN_EMAIL || "ziya@gmail.com";
  const allowedPassword = process.env.ADMIN_PASSWORD || "ziya";

  if (
    !email ||
    !password ||
    email !== allowedEmail ||
    password !== allowedPassword
  ) {
    redirect("/admin?error=login");
  }

  const store = await cookies();
  store.set(adminCookie, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(adminCookie);
  redirect("/admin");
}

export async function saveProfile(formData: FormData) {
  await requireAdmin();
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    redirectWithSaveError("supabase");
  }

  const id = text(formData, "id");
  const rawSlug = text(formData, "slug");
  const name = text(formData, "name");
  const slug = slugify(rawSlug || name || "");

  if (!slug || !name) {
    redirectWithSaveError("required");
  }

  if (["admin", "u", "api"].includes(slug)) {
    redirectWithSaveError("reserved-slug");
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

    if (file.size > maxUploadSize) {
      redirectWithSaveError("file-too-large");
    }

    if (!allowedImageTypes.has(file.type)) {
      redirectWithSaveError("unsupported-image");
    }
  }

  if (cvFile && cvFile.size > 0) {
    if (cvFile.size > maxUploadSize) {
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
      .filter(Boolean) ?? []),
    ...galleryUploads.filter((item): item is string => Boolean(item)),
  ];

  const removeAvatar = bool(formData, "remove_avatar");
  const removeBackground = bool(formData, "remove_background");
  const removeCv = bool(formData, "remove_cv");

  const payload = {
    slug,
    enabled: bool(formData, "enabled"),
    name,
    profession: text(formData, "profession"),
    bio: text(formData, "bio"),
    phone: text(formData, "phone"),
    whatsapp: text(formData, "whatsapp"),
    instagram: text(formData, "instagram"),
    tiktok: text(formData, "tiktok"),
    website: text(formData, "website"),
    facebook: text(formData, "facebook"),
    x: text(formData, "x"),
    linkedin: text(formData, "linkedin"),
    youtube: text(formData, "youtube"),
    location: text(formData, "location"),
    location_url: text(formData, "location_url"),
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
    ...(avatar ? { avatar_url: avatar } : removeAvatar ? { avatar_url: null } : {}),
    ...(background ? { background_url: background } : removeBackground ? { background_url: null } : {}),
    ...(cv ? { cv_url: cv } : removeCv ? { cv_url: null } : {}),
    gallery: galleryUrls,
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
  await requireAdmin();
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
  await requireAdmin();
  const supabase = createServiceSupabaseClient();
  const id = text(formData, "id");
  const slug = text(formData, "slug");

  if (!supabase || !id || !slug) {
    throw new Error("Missing Supabase or profile id or slug");
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
