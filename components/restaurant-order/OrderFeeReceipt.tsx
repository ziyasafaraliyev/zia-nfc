"use client";

import type { OrderFeeBreakdown } from "@/lib/restaurant-order";

type Props = {
  fees: OrderFeeBreakdown;
  formatPrice: (n: number) => string;
  /** Compact for cart preview; full for pay/receipt */
  variant?: "compact" | "full";
};

export default function OrderFeeReceipt({
  fees,
  formatPrice,
  variant = "full",
}: Props) {
  if (fees.subtotal <= 0) return null;

  if (variant === "compact") {
    return (
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Məhsullar</span>
          <span className="font-semibold tabular-nums">
            {formatPrice(fees.subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Servis haqqı (12%)</span>
          <span className="font-semibold tabular-nums">
            {formatPrice(fees.serviceFee)}
          </span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-950">
          <span>Yekun</span>
          <span className="text-sky-600 tabular-nums">
            {formatPrice(fees.grandTotal)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-600">
        <span>Məhsullar</span>
        <span className="font-bold tabular-nums text-slate-950">
          {formatPrice(fees.subtotal)}
        </span>
      </div>
      <div className="flex justify-between text-sm text-slate-600">
        <span>
          Servis haqqı <span className="text-slate-400">(12%)</span>
        </span>
        <span className="font-bold tabular-nums text-slate-950">
          {formatPrice(fees.serviceFee)}
        </span>
      </div>
      <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-black text-slate-950">
        <span>Yekun ödəniş</span>
        <span className="text-sky-600 tabular-nums">
          {formatPrice(fees.grandTotal)}
        </span>
      </div>
    </div>
  );
}
