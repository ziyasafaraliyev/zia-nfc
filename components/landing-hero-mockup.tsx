"use client";

import { motion } from "framer-motion";
import { BarChart3, Copy, Zap } from "lucide-react";
import { LandingPhoneProfile } from "@/components/landing-phone-profile";

/** Animated hero mockup only — framer-motion island for the homepage hero. */
export default function LandingHeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(18px) scale(0.98)" }}
      animate={{ opacity: 1, transform: "translateY(0) scale(1)" }}
      transition={{ duration: 0.66, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
      className="relative mx-auto h-[650px] w-full max-w-[590px]"
    >
      <div className="absolute left-2 top-8 hidden rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm backdrop-blur md:flex">
        <Zap className="mr-2 text-sky-500" size={16} /> Kart toxunduruldu
      </div>
      <motion.div
        animate={{
          transform: [
            "translateY(0) rotate(-7deg)",
            "translateY(-10px) rotate(-5deg)",
            "translateY(0) rotate(-7deg)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
        className="absolute left-0 top-28 h-60 w-[390px] rounded-[1.65rem] border border-white/10 bg-slate-950 p-7 text-white shadow-[0_35px_100px_rgba(15,23,42,0.25)]"
      >
        <div className="absolute inset-0 rounded-[1.65rem] bg-[linear-gradient(135deg,rgba(56,189,248,0.24),transparent_38%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_38%,transparent_56%)]" />
        <div className="relative flex items-start justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt="Zia NFC Logo"
            className="size-12 rounded-full object-cover bg-white p-0.5 shadow-sm"
          />
          <Copy className="text-white/55" />
        </div>
        <div className="relative mt-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-200/80">
            NFC Kimlik Kartı
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Ziya Safaraliyev
          </h3>
        </div>
      </motion.div>

      <motion.div
        animate={{
          opacity: [0.18, 0.6, 0.18],
          transform: ["scale(0.94)", "scale(1.08)", "scale(0.94)"],
        }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        className="absolute left-[48%] top-[34%] h-28 w-28 rounded-full border border-sky-300/70"
      />

      <div className="absolute bottom-0 right-2 h-[575px] w-[292px] rounded-[2.4rem] border-[8px] border-slate-950 bg-slate-950 shadow-[0_40px_110px_rgba(15,23,42,0.28)]">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.85rem] bg-white">
          <div className="absolute left-1/2 top-2.5 z-20 h-4.5 w-20 -translate-x-1/2 rounded-full bg-slate-950" />
          <LandingPhoneProfile compact />
        </div>
      </div>

      <div className="absolute bottom-16 left-2 hidden w-56 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_70px_rgba(15,23,42,0.13)] md:block">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-sky-100 text-sky-700">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-950">Profil yeniləndi</p>
            <p className="text-xs font-semibold text-slate-500">Kart aktiv qalır</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
