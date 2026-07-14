import { getRestaurantBySlug } from "@/lib/restaurants";
import { toOrderRestaurantPayload, type OrderStepId } from "@/lib/restaurant-order";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RestaurantOrderFlow from "@/components/restaurant-order/RestaurantOrderFlow";

const stepMeta: Record<
  OrderStepId,
  { titleSuffix: string; description: string }
> = {
  menyu: {
    titleSuffix: "Menyu",
    description: "Rəqəmsal menyu — məhsul seç və səbətə əlavə et",
  },
  sebet: {
    titleSuffix: "Səbət",
    description: "Sifarişi yoxla və təsdiqlə",
  },
  ode: {
    titleSuffix: "Ödəniş",
    description: "Apple Pay / Google Pay ilə ödə",
  },
  hazir: {
    titleSuffix: "Hazır",
    description: "Ödəniş uğurlu — qəbz hazırdır",
  },
};

export async function generateOrderMetadata(
  slug: string,
  step: OrderStepId,
): Promise<Metadata> {
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.enabled) {
    return {
      title: "Restoran tapılmadı | Zia NFC",
      robots: { index: false, follow: false },
    };
  }
  const meta = stepMeta[step];
  const title = `${restaurant.name} — ${meta.titleSuffix}`;
  return {
    title,
    description: `${restaurant.name}: ${meta.description}`,
    openGraph: {
      title,
      description: meta.description,
      siteName: "Zia NFC",
      type: "website",
    },
  };
}

export async function renderOrderStep(slug: string, step: OrderStepId) {
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.enabled) notFound();

  return (
    <RestaurantOrderFlow
      restaurant={toOrderRestaurantPayload(restaurant)}
      step={step}
    />
  );
}
