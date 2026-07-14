import {
  generateOrderMetadata,
  renderOrderStep,
} from "@/lib/restaurant-order-page";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateOrderMetadata(slug, "hazir");
}

export default async function RestaurantDonePage({ params }: Props) {
  const { slug } = await params;
  return renderOrderStep(slug, "hazir");
}
