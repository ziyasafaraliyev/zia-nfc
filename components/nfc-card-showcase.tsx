"use client";

import { Nfc, QrCode, Sparkles } from "lucide-react";
import Image from "next/image";
import { useLang } from "@/components/language-context";

type CardVariant = "white" | "black" | "silver";

const CARDS_AZ = [
  { variant: "white" as CardVariant, name: "Ağ NFC kart",    note: "Klassik, parlaq və peşəkar" },
  { variant: "black" as CardVariant, name: "Qara NFC kart",  note: "Premium kontrast və güclü brend" },
  { variant: "silver" as CardVariant, name: "Gümüş NFC kart", note: "Metalik parlaq premium finish" },
];

const CARDS_EN = [
  { variant: "white" as CardVariant, name: "White NFC Card",  note: "Classic, glossy and professional" },
  { variant: "black" as CardVariant, name: "Black NFC Card",  note: "Premium contrast and strong branding" },
  { variant: "silver" as CardVariant, name: "Silver NFC Card", note: "Metallic glossy premium finish" },
];

const cardStyles: Record<CardVariant, {
  frontClass: string; backClass: string; frontAccent: string;
  logoClass: string; labelClass: string; titleClass: string;
  backTextClass: string; backMutedClass: string;
}> = {
  white: {
    frontClass:    "bg-[linear-gradient(145deg,#ffffff_0%,#f1f5f9_55%,#e2e8f0_100%)] border border-slate-200/90 text-slate-950",
    backClass:     "bg-[linear-gradient(145deg,#f8fafc_0%,#e2e8f0_100%)] border border-slate-200/90 text-slate-800",
    frontAccent:   "text-sky-700",
    logoClass:     "bg-slate-950 text-sky-300",
    labelClass:    "text-slate-500",
    titleClass:    "text-slate-950",
    backTextClass: "text-slate-700",
    backMutedClass:"text-slate-500",
  },
  black: {
    frontClass:    "bg-[linear-gradient(135deg,#020617_0%,#0f172a_48%,#075985_100%)] border border-white/10 text-white",
    backClass:     "bg-[linear-gradient(135deg,#0f172a_0%,#020617_100%)] border border-white/10 text-white",
    frontAccent:   "text-sky-300",
    logoClass:     "bg-sky-300 text-slate-950",
    labelClass:    "text-sky-200/80",
    titleClass:    "text-white",
    backTextClass: "text-slate-200",
    backMutedClass:"text-slate-400",
  },
  silver: {
    frontClass:    "bg-[linear-gradient(135deg,#94a3b8_0%,#cbd5e1_28%,#f8fafc_52%,#94a3b8_78%,#64748b_100%)] border border-white/60 text-slate-900",
    backClass:     "bg-[linear-gradient(135deg,#64748b_0%,#94a3b8_35%,#e2e8f0_58%,#64748b_100%)] border border-white/50 text-slate-900",
    frontAccent:   "text-slate-700",
    logoClass:     "bg-slate-900 text-slate-100 shadow-inner",
    labelClass:    "text-slate-600",
    titleClass:    "text-slate-900",
    backTextClass: "text-slate-800",
    backMutedClass:"text-slate-600",
  },
};

export default function NfcCardShowcase() {
  const { lang, t } = useLang();
  const cards = lang === "en" ? CARDS_EN : CARDS_AZ;

  return (
    <section id="cards" className="perf-cv bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-700">
            {t("Kart kolleksiyası", "Card Collection")}
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            {t(
              "Fiziki kartınızı seçin — üzərinə gəldikdə arxasını görün.",
              "Choose your physical card — hover to see the back."
            )}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {t(
              "Ağ, qara və gümüş finish seçimləri. Kartın üzərinə gəldikdə 3D fırlanma ilə arxa tərəfdə NFC və QR detalları görünür.",
              "White, black and silver finish options. Hover over the card to see a 3D flip revealing NFC and QR details on the back."
            )}
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
          {cards.map((card) => (
            <div key={card.variant} className="flex flex-col items-center px-2 py-2">
              <FlipCard card={card} styles={cardStyles[card.variant]} />
              <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950">
                {card.name}
              </h3>
              <p className="mt-2 text-center text-sm font-semibold text-slate-500">
                {card.note}
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-sky-700">
                {t("Üzərinə gəlin", "Hover to flip")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({
  card,
  styles,
}: {
  card: { variant: CardVariant; name: string; note: string };
  styles: (typeof cardStyles)[CardVariant];
}) {
  const { t } = useLang();

  return (
    <div
      className="nfc-card-flip w-full max-w-[320px] cursor-pointer rounded-[1.35rem] outline-none focus-within:ring-4 focus-within:ring-sky-200/80"
      tabIndex={0}
    >
      <div className="relative w-full select-none" style={{ aspectRatio: "1.586 / 1" }}>
        <div className="nfc-flip-inner relative h-full w-full">
          {/* Front */}
          <div
            className={`absolute inset-0 overflow-hidden rounded-[1.35rem] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.12)] md:shadow-[0_28px_80px_rgba(15,23,42,0.18)] ${styles.frontClass}`}
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "translateZ(1px)" }}
          >
            <CardShine variant={card.variant} />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <Image src="/logo.webp" alt="Zia NFC Logo" width={44} height={44} className="size-11 rounded-full object-cover bg-white p-0.5 shadow-sm" />
                <Sparkles className={`${styles.frontAccent} opacity-80`} size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-500">
                  {t("Sizin Logo", "Your Logo")}
                </p>
                <p className={`mt-1 text-lg font-black tracking-tight ${styles.titleClass}`}>
                  {t("Rəqəmsal kimlik", "Digital Identity")}
                </p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 overflow-hidden rounded-[1.35rem] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.12)] md:shadow-[0_28px_80px_rgba(15,23,42,0.18)] ${styles.backClass}`}
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg) translateZ(1px)" }}
          >
            <CardShine variant={card.variant} subtle />
            <div className="relative flex h-full flex-col items-center justify-between text-center">
              <Image src="/logo.webp" alt="Zia NFC Logo" width={32} height={32} className="size-8 rounded-full object-cover bg-white p-0.5 shadow-sm" />
              <div className="grid place-items-center gap-3">
                <div className={`grid size-14 place-items-center rounded-2xl ${card.variant === "black" ? "bg-white/10 text-sky-300" : "bg-slate-950/8 text-slate-700"}`}>
                  <Nfc size={28} strokeWidth={1.75} />
                </div>
                <div className={`rounded-xl p-2 ${card.variant === "black" ? "bg-white/10" : "bg-white/70 shadow-sm"}`}>
                  <QrCode size={36} strokeWidth={1.5} className={styles.backTextClass} />
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-500">
                  Touch · Share · Connect
                </p>
                <p className={`mt-1 text-sm font-bold ${styles.backTextClass}`}>
                  {t("NFC + QR ehtiyat", "NFC + QR backup")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardShine({ variant, subtle = false }: { variant: CardVariant; subtle?: boolean }) {
  if (variant === "silver") {
    return (
      <div className={`pointer-events-none absolute inset-0 ${subtle ? "opacity-40" : "opacity-100"} bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.55)_42%,transparent_58%)]`} />
    );
  }
  if (variant === "black") {
    return (
      <div className={`pointer-events-none absolute inset-0 ${subtle ? "opacity-50" : "opacity-100"} bg-[linear-gradient(135deg,rgba(56,189,248,0.2),transparent_42%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.07)_40%,transparent_58%)]`} />
    );
  }
  return (
    <div className={`pointer-events-none absolute inset-0 ${subtle ? "opacity-30" : "opacity-70"} bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.9)_40%,transparent_56%)]`} />
  );
}
