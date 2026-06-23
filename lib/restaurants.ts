import { createPublicSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase";
import type { Restaurant, RestaurantReview } from "@/lib/types";

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

  return {
    ...data,
    gallery: data.gallery || []
  } as Restaurant;
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

  return (data ?? []).map(restaurant => ({
    ...restaurant,
    gallery: restaurant.gallery || []
  })) as Restaurant[];
}
