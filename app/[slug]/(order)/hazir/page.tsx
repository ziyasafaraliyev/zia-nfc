import { getRestaurantBySlug } from "@/lib/restaurants";
import { getProfileBySlug } from "@/lib/profiles";
import { notFound } from "next/navigation";
import { createServiceSupabaseClient } from "@/lib/supabase";
import {
  generateOrderMetadata,
  renderOrderStep,
} from "@/lib/restaurant-order-page";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<{ order_id?: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (restaurant) return generateOrderMetadata(slug, "hazir");
  return {
    title: "Hazır | Zia NFC",
    robots: { index: false, follow: false },
  };
}

export default async function CombinedDonePage({ params, searchParams }: Props) {
  const { slug } = await params;

  const profile = await getProfileBySlug(slug);
  if (profile?.enabled) notFound();

  // Require a valid server-side-paid order token
  const sp = searchParams ? await searchParams : undefined;
  const orderToken = sp?.order_id;
  if (!orderToken) {
    notFound();
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    // If no service DB key is configured, deny access to avoid accidental bypass
    notFound();
  }

  const { data, error } = await supabase
    .from("restaurant_orders")
    .select("id, status, restaurant_slug")
    .eq("token", orderToken)
    .limit(1)
    .maybeSingle();

  if (error || !data || data.status !== "paid" || data.restaurant_slug !== slug) {
    notFound();
  }

  return renderOrderStep(slug, "hazir");
}
