"use client";

import { useState } from "react";
import { ArrowRight, BadgeCheck, Loader2 } from "lucide-react";
import { useLang } from "@/components/language-context";

const PLANS_AZ = [
  {
    plan: "standard" as const,
    name: "Standart",
    price: "59 AZN",
    monthly: "2.90 AZN/ay",
    note: "Fərdi peşəkarlar üçün",
    cta: "Aktivləşdir",
    popular: "Populyar",
    items: [
      "1 Rəqəmsal Profil və Veb-Sahə",
      "WhatsApp və Sosial Media İnteqrasiyası",
      "Dinamik QR Kod Generatoru",
      "Ağıllı Cihazlar və NFC üçün Tam Uyğunluq",
      "24/7 Avtomatik Giriş",
    ],
    featured: false,
  },
  {
    plan: "premium" as const,
    name: "Premium",
    price: "99 AZN",
    monthly: "4.90 AZN/ay",
    note: "Ən çox tələb olunan",
    cta: "İndi Başla",
    popular: "Populyar",
    items: [
      "Standart plandakı bütün imkanlar",
      "İnteraktiv Portfolio Qalereyası",
      "1-Kliklə Kontakt Yadda Saxlanması (.vcf)",
      "Premium Rəqəmsal Mövzu və Brendinq",
      "Ətraflı Ziyarətçi Analitikası və Prioritet Dəstək",
    ],
    featured: true,
  },
  {
    plan: null,
    name: "Studio",
    price: "Özəl",
    monthly: null,
    note: "Komandalar və brendlər üçün",
    cta: "Bizimlə əlaqə",
    popular: "Populyar",
    items: [
      "Çoxsaylı profillər",
      "Brendə uyğun profil sistemi",
      "Toplu kart istehsalı",
      "Prioritet yeniləmələr",
    ],
    featured: false,
  },
];

const PLANS_EN = [
  {
    plan: "standard" as const,
    name: "Standard",
    price: "59 AZN",
    monthly: "2.90 AZN/mo",
    note: "For individual professionals",
    cta: "Activate",
    popular: "Popular",
    items: [
      "1 Digital Profile & Website",
      "WhatsApp & Social Media Integration",
      "Dynamic QR Code Generator",
      "Full Compatibility with Smart Devices & NFC",
      "24/7 Automatic Access",
    ],
    featured: false,
  },
  {
    plan: "premium" as const,
    name: "Premium",
    price: "99 AZN",
    monthly: "4.90 AZN/mo",
    note: "Most popular plan",
    cta: "Get Started",
    popular: "Popular",
    items: [
      "Everything in Standard",
      "Interactive Portfolio Gallery",
      "1-Click Contact Save (.vcf)",
      "Premium Digital Theme & Branding",
      "Detailed Visitor Analytics & Priority Support",
    ],
    featured: true,
  },
  {
    plan: null,
    name: "Studio",
    price: "Custom",
    monthly: null,
    note: "For teams & brands",
    cta: "Contact Us",
    popular: "Popular",
    items: [
      "Multiple profiles",
      "Brand-tailored profile system",
      "Bulk card production",
      "Priority updates",
    ],
    featured: false,
  },
];

export default function PricingSection() {
  const { lang, t } = useLang();
  const [loading, setLoading] = useState<"standard" | "premium" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = lang === "en" ? PLANS_EN : PLANS_AZ;

  async function handleCheckout(plan: "standard" | "premium") {
    setLoading(plan);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(
          data.error ??
            t(
              "Ödəniş sessiyası yaradıla bilmədi.",
              "Could not create payment session."
            )
        );
        return;
      }

      window.location.href = data.url;
    } catch {
      setError(
        t("Şəbəkə xətası baş verdi. Yenidən cəhd edin.", "A network error occurred. Please try again.")
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <section id="pricing" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-700">
          {t("Qiymətlər", "Pricing")}
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {t(
            "Rəqəmsal kimliyinizi başlatmaq üçün aydın paketlər.",
            "Clear plans to launch your digital identity."
          )}
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
          {t(
            <>Rəqəmsal profil hostinq və SaaS abunəlik xidmətləri. Profiliniz <strong className="text-slate-700">24/7 canlı</strong> saxlanılır və istənilən vaxt yenilənə bilir.</>,
            <>Digital profile hosting and SaaS subscription services. Your profile is kept <strong className="text-slate-700">live 24/7</strong> and can be updated at any time.</>
          )}
        </p>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-3xl border p-7 shadow-[0_16px_50px_rgba(15,23,42,0.07)] transition duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.03] ${
                plan.featured
                  ? "border-sky-300 bg-slate-950 text-white hover:shadow-[0_24px_80px_rgba(14,165,233,0.15)]"
                  : "border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
              }`}
            >
              <div>
                {plan.featured ? (
                  <div className="absolute right-5 top-5 rounded-full bg-sky-300 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-950">
                    {plan.popular}
                  </div>
                ) : null}

                <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                <p className={`mt-2 text-sm font-bold ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.note}
                </p>

                <div className="mt-6">
                  <p className={`text-4xl font-black tracking-tight ${plan.featured ? "text-sky-300" : "text-slate-950"}`}>
                    {plan.price}
                  </p>
                  {plan.monthly && (
                    <p className={`mt-1.5 text-sm font-semibold ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>
                      + {plan.monthly} {t("abunəlik", "subscription")}
                    </p>
                  )}
                </div>

                <div className="mt-7 space-y-3">
                  {plan.items.map((item) => (
                    <div
                      key={item}
                      className={`flex items-center gap-3 text-sm font-semibold ${plan.featured ? "text-slate-200" : "text-slate-700"}`}
                    >
                      <BadgeCheck size={18} className={plan.featured ? "text-sky-300" : "text-sky-500"} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                {plan.plan === null ? (
                  <a
                    href="https://wa.me/994702990252"
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-full bg-sky-500 px-4 py-3.5 text-center text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(14,165,233,0.2)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
                  >
                    {plan.cta}
                  </a>
                ) : plan.featured ? (
                  <button
                    id="btn-checkout-premium"
                    onClick={() => handleCheckout("premium")}
                    disabled={loading !== null}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-300 px-4 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading === "premium" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {t("Yönləndirilir...", "Redirecting...")}
                      </>
                    ) : (
                      <>{plan.cta} <ArrowRight size={15} /></>
                    )}
                  </button>
                ) : (
                  <button
                    id="btn-checkout-standard"
                    onClick={() => handleCheckout("standard")}
                    disabled={loading !== null}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading === "standard" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {t("Yönləndirilir...", "Redirecting...")}
                      </>
                    ) : (
                      <>{plan.cta} <ArrowRight size={15} /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
