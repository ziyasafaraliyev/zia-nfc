"use client";

import {
  RestaurantCartProvider,
} from "@/components/restaurant-order/RestaurantCartContext";
import RestaurantOrderChrome from "@/components/restaurant-order/RestaurantOrderChrome";
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
    <RestaurantCartProvider restaurant={restaurant}>
      <RestaurantOrderChrome restaurant={restaurant} step={step}>
        {step === "menyu" ? <MenuStep /> : null}
        {step === "sebet" ? <CartStep /> : null}
        {step === "ode" ? <PayStep /> : null}
        {step === "hazir" ? <DoneStep /> : null}
      </RestaurantOrderChrome>
    </RestaurantCartProvider>
  );
}
