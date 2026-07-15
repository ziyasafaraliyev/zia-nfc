import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createPublicSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase";
import { parseRestaurantMenu } from "@/lib/menu";
import type { Restaurant, RestaurantReview } from "@/lib/types";

function mapRestaurant(data: Record<string, unknown>): Restaurant {
  return {
    ...(data as unknown as Restaurant),
    gallery: Array.isArray(data.gallery) ? (data.gallery as string[]) : [],
    menu: parseRestaurantMenu(data.menu),
  };
}

async function fetchRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("enabled", true)
    .maybeSingle();

  if (!data) return null;
  return mapRestaurant(data as Record<string, unknown>);
}

/**
 * Public restaurant for NFC menu — request-deduped + cross-request cache.
 */
export const getRestaurantBySlug = cache(
  async (slug: string): Promise<Restaurant | null> => {
    if (!slug || slug.length < 2 || slug.length > 50) return null;

    return unstable_cache(
      () => fetchRestaurantBySlug(slug),
      ["restaurant-by-slug", slug],
      {
        revalidate: 120,
        tags: [`restaurant:${slug}`, "restaurants"],
      },
    )();
  },
);

export function restaurantCacheTag(slug: string) {
  return `restaurant:${slug}`;
}

export async function getReviewsForRestaurant(
  restaurantId: string,
): Promise<RestaurantReview[]> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("restaurant_reviews")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  return (data ?? []) as RestaurantReview[];
}

export async function listRestaurants(): Promise<Restaurant[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []).map((restaurant) =>
    mapRestaurant(restaurant as Record<string, unknown>),
  );
}
