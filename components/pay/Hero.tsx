"use client";

import { ArrowRight, Sparkles, Zap, CreditCard } from "lucide-react";
import PhoneFrame from "@/components/pay/PhoneFrame";
import PhoneMenuScreen from "@/components/pay/PhoneMenuScreen";

const metrics = [
  { value: "1 toxunuş", label: "menyu açılır" },
  { value: "0 app", label: "yükləmə yox" },
  { value: "Split", label: "yediklərinlə ödə" },
];

export default function Hero() {
  return (
    <section className="hero-gradient relative overflow-x-clip border-b border-slate-200/70 px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:px-8 lg:pb-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(41,174,238,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-16">
        <div className="animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-3.5 py-2 text-sm font-bold text-sky-800">
            <Sparkles size={16} className="text-sky-500" />
            Premium NFC · QR · Menyü · Ödəniş
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-black leading-[0.98] tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
            Toxun. Seç.{" "}
            <span className="text-sky-500">Ödə & Get.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-slate-600 sm:text-lg md:text-xl">
            Müştəri masadakı{" "}
            <span className="font-extrabold text-slate-900">NFC</span> və ya{" "}
            <span className="font-extrabold text-slate-900">QR</span>-ı oxudur —
            dərhal rəqəmsal menyu açılır. İstədiyini səbətə yığır, təsdiqləyir və{" "}
            <span className="font-extrabold text-sky-600">Apple Pay</span> /{" "}
            <span className="font-extrabold text-sky-600">Google Pay</span> ilə
            tam ödəyir və ya yalnız yediklərini seçərək bölür.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("demo");
                if (!el) return;
                const top = el.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-4 font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
            >
              Necə işlədiyini gör
              <ArrowRight size={18} />
            </a>
            <a
              href="/pay/demo/skan"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 font-extrabold text-slate-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Canlı demo
            </a>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
            {metrics.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm backdrop-blur sm:p-4"
              >
                <p className="text-base font-black tracking-tight text-slate-950 sm:text-xl md:text-2xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-slate-500 sm:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockup — zia-nfc stilində sabit ölçülü frame */}
        <div className="animate-fade-up delay-200 relative mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:mx-0 lg:ml-auto lg:max-w-[420px]">
          {/* Floating badge — top left */}
          <div className="absolute left-0 top-6 z-20 hidden items-center rounded-full border border-slate-200 bg-white/90 px-3.5 py-2 text-sm font-bold text-slate-600 shadow-sm backdrop-blur sm:flex">
            <Zap className="mr-2 shrink-0 text-sky-500" size={15} />
            NFC / QR oxundu
          </div>

          {/* Phone */}
          <div className="float-anim relative z-10 flex justify-center pt-4 sm:justify-end sm:pt-8 sm:pr-2">
            <PhoneFrame>
              <PhoneMenuScreen />
            </PhoneFrame>
          </div>

          {/* Floating badge — bottom left */}
          <div className="absolute bottom-10 left-0 z-20 hidden w-[200px] rounded-3xl border border-slate-200 bg-white p-3.5 shadow-[0_20px_70px_rgba(15,23,42,0.13)] sm:block">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-sky-100 text-sky-700">
                <CreditCard size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-950">1 toxunuşla ödə</p>
                <p className="text-xs font-semibold text-slate-500">
                  Apple · Google Pay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
