import { createPublicSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("enabled", true)
    .single();

  return data as Profile | null;
}

export async function listProfiles(): Promise<Profile[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase.from("profiles").select("*").order("created_at", {
    ascending: false
  });

  return (data ?? []) as Profile[];
}
