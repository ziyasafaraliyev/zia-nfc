import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createPublicSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase";
import type { CarProfile } from "@/lib/types";

async function fetchCarProfileBySlug(slug: string): Promise<CarProfile | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("car_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("enabled", true)
    .maybeSingle();

  if (!data) return null;
  return data as unknown as CarProfile;
}

export const getCarProfileBySlug = cache(
  async (slug: string): Promise<CarProfile | null> => {
    if (!slug || slug.length < 2 || slug.length > 50) return null;

    return unstable_cache(
      () => fetchCarProfileBySlug(slug),
      ["car-profile-by-slug", slug],
      {
        revalidate: 120,
        tags: [`car-profile:${slug}`, "car_profiles"],
      },
    )();
  },
);

export function carProfileCacheTag(slug: string) {
  return `car-profile:${slug}`;
}

export async function listCarProfiles(): Promise<CarProfile[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("car_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as CarProfile[];
}
