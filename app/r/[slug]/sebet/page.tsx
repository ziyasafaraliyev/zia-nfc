import {
  generateOrderMetadata,
  renderOrderStep,
} from "@/lib/restaurant-order-page";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateOrderMetadata(slug, "sebet");
}

export default async function RestaurantCartPage({ params }: Props) {
  const { slug } = await params;
  return renderOrderStep(slug, "sebet");
}
