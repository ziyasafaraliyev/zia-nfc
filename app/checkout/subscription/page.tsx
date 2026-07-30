"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Sparkles,
  CreditCard,
  Zap,
  ArrowRight,
  Loader2,
  Calendar,
  ShieldCheck,
  ArrowLeft,
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
        throw new Error(data.error || "Ödəniş sessiyası yaradıla bilmədi.");
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-[0_20px_70px_rgba(15,23,42,0.08)] text-slate-950"
    >
      {/* Progress Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
            ✓
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
            Addım 1: Kart Alındı
          </span>
        </div>
        <div className="h-px w-8 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-sky-500 text-white text-xs font-black shadow-md shadow-sky-500/20">
            2
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-sky-600">
            Addım 2: Aylıq Abunəlik
          </span>
        </div>
      </div>

      {/* Header Info */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 shadow-sm">
          <Calendar className="size-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
          Aylıq Profil Abunəliyi
        </h1>

        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-semibold">
          Təbrik edirik! Vizit kartınızın ödənişi təsdiqləndi. Rəqəmsal profilinizin 24/7 canlı qalması üçün abunəliyinizi aktivləşdirin.
        </p>
      </div>

      {/* Selected Plan Details Card */}
      <div className={`rounded-2xl p-5 mb-6 border transition duration-200 ${
        isPremium
          ? "bg-slate-950 text-white border-slate-800"
          : "bg-slate-50 text-slate-950 border-slate-200"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isPremium ? "bg-sky-300/20 text-sky-300" : "bg-sky-500/10 text-sky-600"}`}>
              {isPremium ? <Sparkles className="size-5" /> : <Zap className="size-5" />}
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight uppercase">
                {isPremium ? "Premium Abunəlik" : "Standart Abunəlik"}
              </h3>
              <p className={`text-xs font-bold ${isPremium ? "text-slate-400" : "text-slate-500"}`}>
                {isPremium ? "6.90 AZN / ay" : "3.90 AZN / ay"}
              </p>
            </div>
          </div>
          <span className={`text-xs font-black uppercase tracking-[0.12em] px-3 py-1 rounded-full ${
            isPremium ? "bg-sky-300 text-slate-950" : "bg-sky-100 text-sky-700"
          }`}>
            Aktivləşir
          </span>
        </div>

        <div className={`mt-4 pt-4 border-t space-y-2.5 text-xs font-semibold ${
          isPremium ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-700"
        }`}>
          <div className="flex items-center gap-2.5">
            <BadgeCheck size={16} className={isPremium ? "text-sky-300" : "text-sky-500"} />
            <span>24/7 Canlı Profil və Veb-Hostinq</span>
          </div>
          <div className="flex items-center gap-2.5">
            <BadgeCheck size={16} className={isPremium ? "text-sky-300" : "text-sky-500"} />
            <span>Canlı Ziyarətçi Analitikası və QR Kodlar</span>
          </div>
          <div className="flex items-center gap-2.5">
            <BadgeCheck size={16} className={isPremium ? "text-sky-300" : "text-sky-500"} />
            <span>İstənilən vaxt idarə etmək imkanı</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(14,165,233,0.25)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Yönləndirilir...
            </>
          ) : (
            <>
              <CreditCard size={18} />
              <span>Aylıq Abunəliyi Aktivləşdir</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <Link
          href="/checkout/success"
          className="block w-full py-2.5 text-center text-xs font-bold uppercase tracking-[0.08em] text-slate-500 hover:text-slate-900 transition duration-200"
        >
          Aylıq abunəliyi sonra aktivləşdir (Forma Keç)
        </Link>
      </div>

      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <ShieldCheck size={16} className="text-sky-500" />
        <span>Polar.sh tərəfindən 256-bit SSL ilə qorunur</span>
      </div>
    </motion.div>
  );
}

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col justify-between selection:bg-sky-500/20 selection:text-sky-950 font-sans">
      {/* Header Navbar */}
      <header className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white/90 px-5 py-3 shadow-md backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-black tracking-tight text-slate-950 transition hover:-translate-y-0.5"
          >
            <Image
              src="/logo.webp"
              alt="Zia NFC"
              width={38}
              height={38}
              className="size-9 rounded-full object-cover"
            />
            <span>Zia NFC</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700 hover:bg-slate-200 transition"
          >
            <ArrowLeft size={14} />
            <span>Ana Səhifə</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-xl px-4 py-8 my-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20 text-slate-500">
              <Loader2 className="size-8 animate-spin text-sky-500" />
            </div>
          }
        >
          <SubscriptionContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-7xl px-6 py-6 text-center text-xs font-semibold text-slate-500">
        © {new Date().getFullYear()} Zia NFC. Bütün hüquqlar qorunur.
      </footer>
    </div>
  );
}
