import { generateOrderMetadata, renderOrderStep } from "@/lib/restaurant-order-page";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }>; searchParams?: { order_id?: string } };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateOrderMetadata(slug, "hazir");
}

export default async function RestaurantDonePage({ params, searchParams }: Props) {
  const { slug } = await params;

  const orderToken = searchParams?.order_id;
  if (!orderToken) notFound();

  const supabase = createServiceSupabaseClient();
  if (!supabase) notFound();

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
