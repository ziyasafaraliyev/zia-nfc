import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createPublicSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

/** Public fields only — never pull client_password / secrets */
const PUBLIC_PROFILE_SELECT = [
  "id",
  "slug",
  "enabled",
  "reservation_enabled",
  "referral_enabled",
  "referral_url",
  "name",
  "profession",
  "bio",
  "phone",
  "phone2",
  "whatsapp",
  "whatsapp2",
  "instagram",
  "tiktok",
  "telegram",
  "threads",
  "waze",
  "website",
  "facebook",
  "x",
  "linkedin",
  "youtube",
  "behance",
  "location",
  "location_url",
  "google_review_url",
  "email",
  "avatar_url",
  "background_url",
  "cover_style",
  "cover_position",
  "avatar_shape",
  "gallery",
  "catalog",
  "portfolio_enabled",
  "wallet_enabled",
  "cv_url",
  "theme",
].join(",");

async function fetchPublicProfileBySlug(slug: string): Promise<Profile | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(PUBLIC_PROFILE_SELECT)
    .eq("slug", slug)
    .eq("enabled", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as Profile;
}

/**
 * Cached public profile for NFC / customer views.
 * - React cache(): dedupe metadata + page in same request
 * - unstable_cache: cross-request ISR data cache (tagged for admin save)
 */
export const getProfileBySlug = cache(async (slug: string): Promise<Profile | null> => {
  if (!slug || slug.length < 2 || slug.length > 50) return null;

  return unstable_cache(
    () => fetchPublicProfileBySlug(slug),
    ["profile-by-slug-v5", slug],
    {
      revalidate: 60,
      tags: [`profile:${slug}`, "profiles"],
    },
  )();
});

/** Admin list — service role, full rows (not public cache) */
export async function listProfiles(): Promise<Profile[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Profile[];
}

export function profileCacheTag(slug: string) {
  return `profile:${slug}`;
}
