import { getRestaurantBySlug } from "@/lib/restaurants";
import { getProfileBySlug } from "@/lib/profiles";
import { notFound } from "next/navigation";
import {
  generateOrderMetadata,
  renderOrderStep,
} from "@/lib/restaurant-order-page";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (restaurant) return generateOrderMetadata(slug, "menyu");
  return {
    title: "Menyu tapılmadı | Zia NFC",
    robots: { index: false, follow: false },
  };
}

export default async function CombinedMenuPage({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (profile?.enabled) notFound();
  return renderOrderStep(slug, "menyu");
}
