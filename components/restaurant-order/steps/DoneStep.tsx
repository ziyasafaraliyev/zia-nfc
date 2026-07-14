"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Receipt, ShoppingCart } from "lucide-react";
import { useRestaurantCart } from "@/components/restaurant-order/RestaurantCartContext";
import OrderFeeReceipt from "@/components/restaurant-order/OrderFeeReceipt";
import {
  getRestaurantMenuPath,
  getRestaurantPath,
} from "@/lib/urls";

export default function DoneStep() {
  const router = useRouter();
  const {
    restaurant,
    payAmount,
    payMode,
    cartCount,
    resetCart,
    paidLines,
    formatPrice,
    fees,
    payGrandTotal,
    hydrated,
  } = useRestaurantCart();

  if (!hydrated) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-400 shadow-sm">
        Yüklənir…
      </div>
    );
  }

  if (cartCount === 0 || payAmount <= 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <ShoppingCart className="text-slate-300" size={40} />
        <h1 className="text-xl font-black text-slate-950">Ödəniş yoxdur</h1>
        <p className="text-sm text-slate-500">
          Menyudan məhsul seçib səbəti təsdiqləyin.
        </p>
        <Link
          href={getRestaurantMenuPath(restaurant.slug)}
          className="rounded-full bg-sky-500 px-6 py-3 text-sm font-black text-white"
        >
          Menyuya keç
        </Link>
      </div>
    );
  }

  function handleNewOrder() {
    resetCart();
    router.push(getRestaurantMenuPath(restaurant.slug));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-950 to-slate-900 p-8 text-center text-white shadow-[0_24px_80px_rgba(15,23,42,0.3)]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 shadow-[0_12px_30px_rgba(14,165,233,0.4)]">
          <Check size={32} strokeWidth={3} />
        </div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-sky-400">
          Addım 4 · Hazır
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight">
          {formatPrice(payGrandTotal)} ödənildi
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {restaurant.name} · Apple Pay ilə təsdiqləndi.
          {payMode === "split"
            ? " Qalan məhsullar digər qonaqlar üçün açıqdır."
            : " Hesab bağlandı."}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-slate-300">
          <Receipt size={14} /> Rəqəmsal qəbz hazırdır
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-black text-slate-950">Qəbz</p>
        <ul className="mt-3 space-y-2">
          {paidLines.map((line) => (
            <li
              key={line.id}
              className="flex items-center justify-between text-sm text-slate-600"
            >
              <span>
                {line.name}
                {line.paidQuantity > 1 ? ` ×${line.paidQuantity}` : ""}
                {payMode === "split" && line.paidQuantity < line.quantity
                  ? ` (səbətdən ${line.quantity})`
                  : ""}
              </span>
              <span className="font-bold text-slate-950">
                {formatPrice(line.paidTotal)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-slate-100 pt-3">
          <OrderFeeReceipt
            fees={fees}
            formatPrice={formatPrice}
            variant="full"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-black text-slate-950">Nə baş verdi?</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="flex gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-sky-500" />
            Menyu açıldı və məhsullar seçildi
          </li>
          <li className="flex gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-sky-500" />
            Səbət təsdiqləndi
          </li>
          <li className="flex gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-sky-500" />
            {payMode === "full" ? "Tam ödəniş" : "Split ödəniş"} tamamlandı
          </li>
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleNewOrder}
          className="flex items-center justify-center rounded-full border border-slate-200 bg-white py-3.5 text-sm font-black text-slate-900 transition hover:bg-slate-50"
        >
          Yeni sifariş
        </button>
        <Link
          href={getRestaurantPath(restaurant.slug)}
          className="flex items-center justify-center rounded-full bg-sky-500 py-3.5 text-sm font-black text-white transition hover:bg-sky-400"
        >
          Profilə qayıt
        </Link>
      </div>
    </div>
  );
}
