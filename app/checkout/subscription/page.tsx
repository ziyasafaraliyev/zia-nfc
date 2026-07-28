"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  CreditCard,
  Zap,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Calendar,
} from "lucide-react";

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const rawPlan = searchParams.get("plan");
  const plan: "standard" | "premium" = rawPlan === "premium" ? "premium" : "standard";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, type: "monthly" }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout sessiyası yaradıla bilmədi.");
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Xəta baş verdi.";
      setError(message);
      setLoading(false);
    }
  };

  const isPremium = plan === "premium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/20"
    >
      {/* Step Badge */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            ✓
          </span>
          <span className="text-xs font-medium text-slate-400">Addım 1: Kart Alındı</span>
        </div>
        <div className="w-8 h-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/30">
            2
          </span>
          <span className="text-xs font-semibold text-cyan-400">Addım 2: Aylıq Abunəlik</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10">
          <Calendar className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Aylıq Profil Abunəliyi 🔥
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
          Vizit kartınızın ödənişi təsdiqləndi! Kartınızın aktiv qalması və rəqəmsal profiliniz üçün aylıq abunəliyinizi aktivləşdirin.
        </p>
      </div>

      {/* Selected Plan Details Box */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isPremium ? "bg-amber-500/10 text-amber-400" : "bg-cyan-500/10 text-cyan-400"}`}>
              {isPremium ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isPremium ? "Premium Paket Abunəliyi" : "Standart Paket Abunəliyi"}
              </h3>
              <p className="text-xs text-slate-400">Aylıq profil hostinqi və analitika</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Aktivləşdirməyə Hazır
          </span>
        </div>

        <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800/80">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Rəqəmsal Profil Hostinqi (7/24 Aktiv)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Canlı Analitika & Ziyarətçi Sayğacı</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>İstənilən vaxt ləğv etmək imkanı</span>
          </li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs text-center">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Aylıq Abunəliyi Aktivləşdir</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>

        <Link
          href="/checkout/success"
          className="block w-full py-3 text-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          Aylıq abunəliyi sonra aktivləşdir (Forma keçin)
        </Link>
      </div>

      {/* Footer info */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>Təhlükəsiz Polar.sh Ödəniş Sistemi</span>
      </div>
    </motion.div>
  );
}

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-[#05070E] text-white flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden font-sans">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] rounded-full" />

      <main className="relative z-10 max-w-xl mx-auto w-full px-4 py-12 my-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          }
        >
          <SubscriptionContent />
        </Suspense>
      </main>

      <footer className="relative z-10 max-w-5xl mx-auto w-full px-6 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Zia NFC. Bütün hüquqlar qorunur.
      </footer>
    </div>
  );
}
