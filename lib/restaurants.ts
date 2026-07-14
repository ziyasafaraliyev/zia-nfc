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

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("enabled", true)
    .single();

  if (!data) return null;

  return mapRestaurant(data as Record<string, unknown>);
}

export async function getReviewsForRestaurant(restaurantId: string): Promise<RestaurantReview[]> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("restaurant_reviews")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  return (data ?? []) as RestaurantReview[];
}

export async function listRestaurants(): Promise<Restaurant[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase.from("restaurants").select("*").order("created_at", {
    ascending: false
  });

  return (data ?? []).map((restaurant) =>
    mapRestaurant(restaurant as Record<string, unknown>),
  );
}
