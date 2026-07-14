"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { formatAz, menuItems, restaurant } from "@/lib/demo-data";
import { useDemoCart } from "@/components/pay/demo/DemoCartContext";

export default function DemoMenyuPage() {
  const { qty, add, remove, cartCount, cartTotal } = useDemoCart();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-600">
          Addım 2 · Menyu
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          {restaurant.name}
        </h1>
        <p className="text-sm text-slate-500">{restaurant.tagline}</p>
      </div>

      <div className="space-y-3">
        {menuItems.map((item) => {
          const count = qty[item.id] || 0;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-black text-slate-950">{item.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                <p className="mt-1.5 text-sm font-bold text-sky-600">
                  {formatAz(item.price)}
                </p>
              </div>

              {count === 0 ? (
                <button
                  type="button"
                  onClick={() => add(item.id)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white transition hover:bg-sky-500 active:scale-95"
                  aria-label={`${item.name} əlavə et`}
                >
                  <Plus size={18} />
                </button>
              ) : (
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-1">
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm active:scale-95"
                    aria-label="Azalt"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-black tabular-nums">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => add(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white active:scale-95"
                    aria-label="Artır"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cart summary */}
      <div className="rounded-2xl bg-slate-950 p-4 text-white shadow-xl">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-slate-400">
            <ShoppingBag size={16} className="text-sky-400" />
            Səbət · {cartCount} məhsul
          </span>
          <span className="font-black text-sky-400">{formatAz(cartTotal)}</span>
        </div>
        {cartCount > 0 ? (
          <Link
            href="/pay/demo/sebet"
            className="flex w-full items-center justify-center rounded-full bg-sky-500 py-3.5 text-sm font-black text-white transition hover:bg-sky-400 active:scale-[0.98]"
          >
            Səbətə bax →
          </Link>
        ) : (
          <p className="rounded-full bg-white/10 py-3.5 text-center text-sm font-bold text-slate-400">
            Məhsul seçmək üçün + bas
          </p>
        )}
      </div>
    </div>
  );
}
