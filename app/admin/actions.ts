"use server";

import { createServiceSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adminCookie = "zia_admin_email";

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
    throw new Error("Supabase service key is missing");
  }

  const id = text(formData, "id");
  const slug = text(formData, "slug");
  const name = text(formData, "name");

  if (!slug || !name) {
    throw new Error("Slug and name are required");
  }

  const avatar = await uploadFile(
    formData.get("avatar") as File | null,
    `avatars/${slug}`,
  );
  const background = await uploadFile(
    formData.get("background") as File | null,
    `backgrounds/${slug}`,
  );
  const galleryUploads = await Promise.all(
    formData
      .getAll("galleryFiles")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .map((file) => uploadFile(file, `gallery/${slug}`)),
  );

  const galleryUrls = [
    ...(text(formData, "gallery")
      ?.split("\n")
      .map((item) => item.trim())
      .filter(Boolean) ?? []),
    ...galleryUploads.filter((item): item is string => Boolean(item)),
  ];

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
    location: text(formData, "location"),
    ...(avatar ? { avatar_url: avatar } : {}),
    ...(background ? { background_url: background } : {}),
    gallery: galleryUrls,
  };

  const query = id
    ? supabase.from("profiles").update(payload).eq("id", id)
    : supabase.from("profiles").insert(payload);
  const { error } = await query;

  if (error) {
    throw new Error(error.message);
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
