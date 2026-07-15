import RestaurantOrderShell from "@/components/restaurant-order/RestaurantOrderShell";
import { getRestaurantBySlug } from "@/lib/restaurants";
import { toOrderRestaurantPayload } from "@/lib/restaurant-order";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

/**
 * Shared order layout — restaurant fetched once; cart survives step changes.
 */
export default async function CombinedOrderLayout({ children, params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant?.enabled) {
    return children;
  }

  return (
    <RestaurantOrderShell restaurant={toOrderRestaurantPayload(restaurant)}>
      {children}
    </RestaurantOrderShell>
  );
}
