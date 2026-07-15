"use client";

/**
 * @deprecated Order steps use RestaurantOrderShell in (order)/layout.
 * Kept as thin re-export for any residual imports.
 */
import RestaurantOrderShell from "@/components/restaurant-order/RestaurantOrderShell";
import MenuStep from "@/components/restaurant-order/steps/MenuStep";
import CartStep from "@/components/restaurant-order/steps/CartStep";
import PayStep from "@/components/restaurant-order/steps/PayStep";
import DoneStep from "@/components/restaurant-order/steps/DoneStep";
import type {
  OrderRestaurantPayload,
  OrderStepId,
} from "@/lib/restaurant-order";

type Props = {
  restaurant: OrderRestaurantPayload;
  step: OrderStepId;
};

export default function RestaurantOrderFlow({ restaurant, step }: Props) {
  return (
    <RestaurantOrderShell restaurant={restaurant}>
      {step === "menyu" ? <MenuStep /> : null}
      {step === "sebet" ? <CartStep /> : null}
      {step === "ode" ? <PayStep /> : null}
      {step === "hazir" ? <DoneStep /> : null}
    </RestaurantOrderShell>
  );
}
