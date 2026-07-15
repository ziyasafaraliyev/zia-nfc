"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { RestaurantCartProvider } from "@/components/restaurant-order/RestaurantCartContext";
import RestaurantOrderChrome from "@/components/restaurant-order/RestaurantOrderChrome";
import type {
  OrderRestaurantPayload,
  OrderStepId,
} from "@/lib/restaurant-order";

type Props = {
  restaurant: OrderRestaurantPayload;
  children: React.ReactNode;
};

function stepFromPath(pathname: string): OrderStepId {
  if (pathname.endsWith("/sebet")) return "sebet";
  if (pathname.endsWith("/ode")) return "ode";
  if (pathname.endsWith("/hazir")) return "hazir";
  return "menyu";
}

/**
 * Persistent shell across /menyu → /sebet → /ode → /hazir soft navigations.
 * Cart provider stays mounted (no re-fetch / no re-hydrate wait between steps).
 */
export default function RestaurantOrderShell({
  restaurant,
  children,
}: Props) {
  const pathname = usePathname() || "";
  const step = useMemo(() => stepFromPath(pathname), [pathname]);

  return (
    <RestaurantCartProvider restaurant={restaurant}>
      <RestaurantOrderChrome restaurant={restaurant} step={step}>
        {children}
      </RestaurantOrderChrome>
    </RestaurantCartProvider>
  );
}
