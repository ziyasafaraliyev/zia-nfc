"use client";

import Link from "next/link";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useRestaurantCart } from "@/components/restaurant-order/RestaurantCartContext";
import OrderFeeReceipt from "@/components/restaurant-order/OrderFeeReceipt";
import {
  getRestaurantDonePath,
  getRestaurantMenuPath,
} from "@/lib/urls";

export default function PayStep() {
  const {
    restaurant,
    cartLines,
    cartTotal,
    splitTotal,
    payAmount,
    payMode,
    setPayMode,
    payQty,
    adjustPayQty,
    togglePayItem,
    cartCount,
    formatPrice,
    fees,
    payGrandTotal,
    hydrated,
  } = useRestaurantCart();

  if (!hydrated) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-400 shadow-sm">
        Ödəniş yüklənir…
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <ShoppingCart className="text-slate-300" size={40} />
        <h1 className="text-xl font-black text-slate-950">Səbət boşdur</h1>
        <p className="text-sm text-slate-500">
          Ödəniş üçün əvvəlcə menyudan məhsul seç.
        </p>
        <Link
          href={getRestaurantMenuPath(restaurant.slug)}
          className="rounded-full bg-sky-500 px-6 py-3 text-sm font-black text-white"
        >
          Menyuya qayıt
        </Link>
      </div>
    );
  }

  const canPay = payAmount > 0 && payGrandTotal > 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-600">
          Addım 3 · Ödə
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Necə ödəyirsən?
        </h1>
        <p className="text-sm text-slate-500">
          Tam məbləğ və ya yalnız yediklərini seç — eyni məhsuldan bir neçə
          ədəddirsə, neçəsini ödəyəcəyini seçə bilərsən.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setPayMode("full")}
        className={`w-full rounded-2xl border-2 p-4 text-left transition ${
          payMode === "full"
            ? "border-sky-500 bg-sky-50 shadow-sm"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-slate-950">
              Tam məbləği ödə · {formatPrice(cartTotal)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Bütün səbət bir nəfər tərəfindən (haqlar yekunda)
            </p>
          </div>
          {payMode === "full" ? (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
              <Check size={14} strokeWidth={3} />
            </span>
          ) : null}
        </div>
      </button>

      <button
        type="button"
        onClick={() => setPayMode("split")}
        className={`w-full rounded-2xl border-2 p-4 text-left transition ${
          payMode === "split"
            ? "border-sky-500 bg-sky-50 shadow-sm"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-slate-950">
              Yediklərimi seçib ödə
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Yalnız öz payını ödə — dostlar eyni axınla davam edir
            </p>
          </div>
          {payMode === "split" ? (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
              <Check size={14} strokeWidth={3} />
            </span>
          ) : null}
        </div>
      </button>

      {payMode === "split" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Yalnız mənim seçdiklərim
          </p>
          <div className="space-y-2">
            {cartLines.map((line) => {
              const selected = payQty[line.id] || 0;
              const on = selected > 0;
              const selectedTotal = line.price * selected;

              return (
                <div
                  key={line.id}
                  className={`rounded-xl border px-3 py-2.5 transition ${
                    on
                      ? "border-sky-200 bg-sky-50"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => togglePayItem(line.id)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                        on
                          ? "bg-sky-500 text-white"
                          : "bg-slate-100 text-transparent"
                      }`}
                      aria-label={on ? "Seçimi sil" : "Hamısını seç"}
                    >
                      <Check size={12} strokeWidth={3} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-700">
                        {line.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatPrice(line.price)}
                        {line.quantity > 1
                          ? ` · səbətdə ${line.quantity} ədəd`
                          : ""}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-950">
                      {formatPrice(selectedTotal)}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-slate-100/80 pt-2.5 pl-8">
                    <p className="text-[11px] font-semibold text-slate-500">
                      Mənim payım
                    </p>
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => adjustPayQty(line.id, -1)}
                        disabled={selected <= 0}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-700 shadow-sm disabled:opacity-40"
                        aria-label="Azalt"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="min-w-[3.5rem] text-center text-xs font-black text-slate-950">
                        {selected}/{line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => adjustPayQty(line.id, 1)}
                        disabled={selected >= line.quantity}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white disabled:opacity-40"
                        aria-label="Artır"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 text-sm font-black text-sky-600">
            Payım: {formatPrice(splitTotal)}
          </div>
          {splitTotal <= 0 ? (
            <p className="mt-2 text-xs font-semibold text-amber-600">
              Ödəmək üçün ən azı bir ədəd seç.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Cek — haqlar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Cek
        </p>
        <OrderFeeReceipt
          fees={fees}
          formatPrice={formatPrice}
          variant="full"
        />
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Ödəniş üsulu
        </p>
        <div className="rounded-2xl border-2 border-sky-500 bg-sky-50 px-4 py-3.5 text-sm font-black text-slate-950">
          Apple Pay · {formatPrice(payGrandTotal)}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-500">
          Google Pay · {formatPrice(payGrandTotal)}
        </div>
      </div>

      {canPay ? (
        <Link
          href={getRestaurantDonePath(restaurant.slug)}
          className="flex w-full items-center justify-center rounded-full bg-sky-500 py-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.3)] transition hover:bg-sky-400 active:scale-[0.98]"
        >
          {formatPrice(payGrandTotal)} ödə →
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center rounded-full bg-slate-200 py-4 text-sm font-black text-slate-500"
        >
          Məbləğ 0 — seçim et
        </button>
      )}
    </div>
  );
}
