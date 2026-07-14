"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PhoneFrame, { PhoneStatusBar } from "@/components/pay/PhoneFrame";
import { demoSteps, formatAz, restaurant } from "@/lib/demo-data";

const previewItems = [
  { name: "Lülə kabab", price: 16, added: true },
  { name: "Şah plov", price: 14, added: true },
  { name: "Yarpaq dolması", price: 12, added: false },
  { name: "Qutab", price: 6, added: true },
];

const previewTotal = previewItems
  .filter((i) => i.added)
  .reduce((sum, i) => sum + i.price, 0);
const previewCount = previewItems.filter((i) => i.added).length;

export default function Demo() {
  return (
    <section id="demo" className="bg-white px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="section-label mb-4">Interaktiv demo</p>
          <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Müştəri masada nə edir?
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Hər addım ayrı səhifədir. «Növbəti» basanda real demo səhifəsi açılır —
            skan, menyü, səbət, ödəniş və nəticə.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Step links — each opens a real page */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {demoSteps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <Link
                  href={s.href}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-slate-950"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-[11px] font-black text-sky-400">
                    {i + 1}
                  </span>
                  {s.label}
                </Link>
                {i < demoSteps.length - 1 && (
                  <ArrowRight
                    size={14}
                    className="hidden text-slate-300 sm:block"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Phone preview */}
            <div className="flex justify-center">
              <PhoneFrame size="md">
                <div className="flex h-full flex-col bg-slate-50">
                  <PhoneStatusBar />
                  <div className="flex min-h-0 flex-1 flex-col px-3.5 pb-6 pt-1">
                    <p className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      {restaurant.table} · {restaurant.name}
                    </p>
                    <p className="mb-2.5 text-center text-[14px] font-black text-slate-950">
                      Zia-Pay Menyü
                    </p>
                    <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden">
                      {previewItems.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white px-2.5 py-2 shadow-sm"
                        >
                          <span className="min-w-0 truncate text-[12px] font-medium text-slate-700">
                            {item.name}
                          </span>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <span className="text-[12px] font-bold text-slate-950">
                              {formatAz(item.price)}
                            </span>
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                                item.added
                                  ? "bg-sky-500 text-white"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {item.added ? "✓" : "+"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2.5 shrink-0 space-y-1.5">
                      <div className="rounded-2xl bg-slate-950 px-3 py-2 text-white">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">
                            Səbət · {previewCount} məhsul
                          </span>
                          <span className="font-black text-sky-400">
                            {formatAz(previewTotal)}
                          </span>
                        </div>
                      </div>
                      <Link
                        href="/pay/demo/skan"
                        className="block w-full rounded-full bg-sky-500 py-2.5 text-center text-[12px] font-black text-white"
                      >
                        Demonu aç
                      </Link>
                    </div>
                  </div>
                </div>
              </PhoneFrame>
            </div>

            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 pulse-soft" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-700">
                  5 real səhifə
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Tam müştəri axını — ayrı səhifələrdə
              </h3>
              <ul className="space-y-3">
                {demoSteps.map((s, i) => (
                  <li key={s.id}>
                    <Link
                      href={s.href}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-sky-400">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-slate-950">{s.label}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{s.text}</p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="mt-1 shrink-0 text-slate-300"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/pay/demo/skan"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition hover:-translate-y-0.5 hover:bg-sky-400 sm:w-auto"
              >
                Demonu indi başlat
                <ArrowRight size={18} />
              </Link>

              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                {["Skan", "Menyü", "Səbət", "Ödə", "Hazır"].map((l) => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1"
                  >
                    <Check size={12} className="text-sky-500" /> {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
