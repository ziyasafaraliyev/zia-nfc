import { MetadataRoute } from "next";
import { createPublicSupabaseClient } from "@/lib/supabase";

const BASE_URL = "https://zianfc.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Dynamic profile pages from Supabase
  try {
    const supabase = createPublicSupabaseClient();
    if (!supabase) return staticRoutes;

    const { data: profiles } = await supabase
      .from("profiles")
      .select("slug, updated_at")
      .eq("enabled", true)
      .order("created_at", { ascending: false });

    if (!profiles) return staticRoutes;

    const profileRoutes: MetadataRoute.Sitemap = profiles.map((p) => ({
      url: `${BASE_URL}/u/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...profileRoutes];
  } catch {
    return staticRoutes;
  }
}
