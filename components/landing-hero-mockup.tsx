import { BarChart3, Zap, Wifi } from "lucide-react";
import Image from "next/image";
import { LandingPhoneProfile } from "@/components/landing-phone-profile";

/**
 * Hero mockup — CSS-only animations, no framer-motion.
 * Features: floating NFC card with scan-line, double pulse rings,
 * orbiting dot, animated stat badges.
 */
export default function LandingHeroMockup() {
  return (
    <div className="relative mx-auto h-[650px] w-full max-w-[590px]">

      {/* ── "Kart toxunduruldu" badge ── */}
      <div className="absolute left-2 top-8 hidden rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-bold text-slate-700 shadow-md backdrop-blur-sm md:flex items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-sky-500 text-white">
          <Wifi size={12} />
        </span>
        Kart toxunduruldu
      </div>

      {/* ── NFC Card ── */}
      <div className="absolute left-0 top-28 h-60 w-[390px] -rotate-[7deg] overflow-hidden rounded-[1.65rem] border border-white/10 bg-slate-950 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] md:shadow-[0_35px_100px_rgba(15,23,42,0.25)]">
        <Image
          src="/1bab6639-1224-4e39-9294-a5194ec7e60c.png"
          alt="NFC Card"
          fill
          sizes="390px"
          className="object-cover"
        />
        {/* Light overlay */}
        <div className="absolute inset-0 rounded-[1.65rem] bg-[linear-gradient(135deg,rgba(56,189,248,0.24),transparent_38%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_38%,transparent_56%)]" />

        {/* Center logo */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Image
            src="/logo.webp"
            alt="Zia NFC Logo"
            width={72}
            height={72}
            className="size-[72px] rounded-full object-cover bg-white p-0.5 shadow-lg"
          />
        </div>
      </div>

      {/* ── Phone mockup ── */}
      <div className="absolute bottom-0 right-2 h-[575px] w-[292px] rounded-[2.4rem] border-[8px] border-slate-950 bg-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.2)] md:shadow-[0_40px_110px_rgba(15,23,42,0.28)]">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.85rem] bg-white">
          <div className="absolute left-1/2 top-2.5 z-20 h-4.5 w-20 -translate-x-1/2 rounded-full bg-slate-950" />
          <LandingPhoneProfile compact />
        </div>
      </div>

      {/* ── Bottom-left stat badge ── */}
      <div className="absolute bottom-16 left-2 hidden w-56 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_70px_rgba(15,23,42,0.13)] md:block">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-sky-100 text-sky-600">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-950">Profil yeniləndi</p>
            <p className="text-xs font-semibold text-slate-500">Kart aktiv qalır</p>
          </div>
        </div>
      </div>

      {/* ── Top-right small NFC chip badge ── */}
      <div className="absolute right-[15%] top-12 hidden items-center gap-1.5 rounded-2xl border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700 shadow-sm md:flex">
        <Zap size={13} className="text-sky-500" />
        NFC Ready
      </div>
    </div>
  );
}
