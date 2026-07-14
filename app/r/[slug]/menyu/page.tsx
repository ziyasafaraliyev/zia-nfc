import {
  generateOrderMetadata,
  renderOrderStep,
} from "@/lib/restaurant-order-page";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateOrderMetadata(slug, "menyu");
}

export default async function RestaurantMenuPage({ params }: Props) {
  const { slug } = await params;
  return renderOrderStep(slug, "menyu");
}
