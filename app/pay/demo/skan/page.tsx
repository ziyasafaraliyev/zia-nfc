"use client";

import Link from "next/link";
import { Nfc, QrCode } from "lucide-react";
import { restaurant } from "@/lib/demo-data";

export default function DemoSkanPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-center text-white shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-sky-400">
          Addım 1 · Skan
        </p>
        <h1 className="mt-1.5 text-xl font-black tracking-tight sm:text-2xl">
          Telefonu karta toxundur
        </h1>
        <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
          və ya QR kodu kamerayla skan et — app yükləməyə ehtiyac yoxdur.
        </p>

        <div className="relative mx-auto mt-4 flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-sky-400/50 sm:mt-5 sm:h-36 sm:w-36">
          <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-sky-400" />
          <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-sky-400" />
          <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-sky-400" />
          <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-sky-400" />
          <div className="scan-line absolute left-2.5 right-2.5 h-0.5 bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
          <div className="flex flex-col items-center gap-1">
            <Nfc size={30} className="text-sky-400" />
            <span className="text-[10px] font-bold text-sky-400/90">NFC</span>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500 sm:text-sm">
          {restaurant.table} · {restaurant.name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <Nfc className="mb-1.5 text-sky-500" size={18} />
          <p className="text-xs font-black text-slate-950 sm:text-sm">NFC kart</p>
          <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
            Telefonu masadakı karta yaxınlaşdır
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <QrCode className="mb-1.5 text-sky-500" size={18} />
          <p className="text-xs font-black text-slate-950 sm:text-sm">QR ehtiyat</p>
          <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
            Kamerayla skan et — eyni menyu açılır
          </p>
        </div>
      </div>

      <Link
        href="/pay/demo/menyu"
        className="flex w-full items-center justify-center rounded-full bg-sky-500 py-3.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(14,165,233,0.28)] transition hover:bg-sky-400"
      >
        Menyunu aç →
      </Link>
    </div>
  );
}
