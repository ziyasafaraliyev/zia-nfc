"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Receipt, ShoppingCart } from "lucide-react";
import { formatAz } from "@/lib/demo-data";
import { useDemoCart } from "@/components/pay/demo/DemoCartContext";

export default function DemoHazirPage() {
  const router = useRouter();
  const { payAmount, payMode, cartCount, resetDemo, paidLines } = useDemoCart();

  if (cartCount === 0 || payAmount <= 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <ShoppingCart className="text-slate-300" size={40} />
        <h1 className="text-xl font-black text-slate-950">Ödəniş yoxdur</h1>
        <p className="text-sm text-slate-500">
          Demo axınını skandan başlayıb məhsul seç.
        </p>
        <Link
          href="/pay/demo/skan"
          className="rounded-full bg-sky-500 px-6 py-3 text-sm font-black text-white"
        >
          Demonu başlat
        </Link>
      </div>
    );
  }

  function handleRestart() {
    resetDemo();
    router.push("/pay/demo/skan");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-950 to-slate-900 p-8 text-center text-white shadow-[0_24px_80px_rgba(15,23,42,0.3)]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 shadow-[0_12px_30px_rgba(14,165,233,0.4)]">
          <Check size={32} strokeWidth={3} />
        </div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-sky-400">
          Addım 5 · Hazır
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight">
          {formatAz(payAmount)} ödənildi
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Apple Pay ilə təsdiqləndi.
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
                {payMode === "split" &&
                line.paidQuantity < line.quantity
                  ? ` (səbətdən ${line.quantity})`
                  : ""}
              </span>
              <span className="font-bold text-slate-950">
                {formatAz(line.paidTotal)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm font-black text-slate-950">
          <span>Cəmi</span>
          <span className="text-sky-600">{formatAz(payAmount)}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-black text-slate-950">Nə baş verdi?</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="flex gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-sky-500" />
            NFC/QR ilə menyu açıldı
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
          onClick={handleRestart}
          className="flex items-center justify-center rounded-full border border-slate-200 bg-white py-3.5 text-sm font-black text-slate-900 transition hover:bg-slate-50"
        >
          Demonu yenidən başlat
        </button>
        <Link
          href="/pay"
          className="flex items-center justify-center rounded-full bg-sky-500 py-3.5 text-sm font-black text-white transition hover:bg-sky-400"
        >
          Zia Pay-ə qayıt
        </Link>
      </div>
    </div>
  );
}
