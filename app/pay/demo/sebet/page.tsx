"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { formatAz } from "@/lib/demo-data";
import { useDemoCart } from "@/components/pay/demo/DemoCartContext";

export default function DemoSebetPage() {
  const { cartLines, cartTotal, cartCount, add, remove } = useDemoCart();

  if (cartLines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <ShoppingCart className="text-slate-300" size={40} />
        <h1 className="text-xl font-black text-slate-950">Səbət boşdur</h1>
        <p className="text-sm text-slate-500">Menyudan məhsul əlavə et.</p>
        <Link
          href="/pay/demo/menyu"
          className="rounded-full bg-sky-500 px-6 py-3 text-sm font-black text-white"
        >
          Menyuya qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-600">
          Addım 3 · Səbət
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Sifarişi təsdiqlə
        </h1>
        <p className="text-sm text-slate-500">{cartCount} məhsul seçilib</p>
      </div>

      <div className="space-y-3">
        {cartLines.map((line) => (
          <div
            key={line.id}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="font-black text-slate-950">{line.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {formatAz(line.price)}
                {line.quantity > 1 ? ` × ${line.quantity}` : ""}
              </p>
              <p className="mt-1 text-sm font-bold text-sky-600">
                {formatAz(line.lineTotal)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-1">
              <button
                type="button"
                onClick={() => remove(line.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <Minus size={14} />
              </button>
              <span className="w-5 text-center text-sm font-black">
                {line.quantity}
              </span>
              <button
                type="button"
                onClick={() => add(line.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4">
        <div className="flex justify-between text-base font-black text-slate-950">
          <span>Cəmi</span>
          <span>{formatAz(cartTotal)}</span>
        </div>
      </div>

      <Link
        href="/pay/demo/ode"
        className="flex w-full items-center justify-center rounded-full bg-sky-500 py-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.3)] transition hover:bg-sky-400"
      >
        Səbəti təsdiqlə · Ödənişə keç →
      </Link>
      <p className="text-center text-xs text-slate-400">
        Sonra Apple Pay / Google Pay və ya split ödəniş
      </p>
    </div>
  );
}
