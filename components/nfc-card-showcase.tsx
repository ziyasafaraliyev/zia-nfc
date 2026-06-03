"use client";

import { motion } from "framer-motion";
import { Nfc, QrCode, Sparkles } from "lucide-react";

type CardVariant = "white" | "black" | "silver";

const cards: {
  variant: CardVariant;
  name: string;
  note: string;
  frontClass: string;
  backClass: string;
  frontAccent: string;
  logoClass: string;
  labelClass: string;
  titleClass: string;
  backTextClass: string;
  backMutedClass: string;
}[] = [
  {
    variant: "white",
    name: "Ağ NFC kart",
    note: "Klassik, parlaq və peşəkar",
    frontClass: "bg-[linear-gradient(145deg,#ffffff_0%,#f1f5f9_55%,#e2e8f0_100%)] border border-slate-200/90 text-slate-950",
    backClass: "bg-[linear-gradient(145deg,#f8fafc_0%,#e2e8f0_100%)] border border-slate-200/90 text-slate-800",
    frontAccent: "text-cyan-700",
    logoClass: "bg-slate-950 text-cyan-300",
    labelClass: "text-slate-500",
    titleClass: "text-slate-950",
    backTextClass: "text-slate-700",
    backMutedClass: "text-slate-500"
  },
  {
    variant: "black",
    name: "Qara NFC kart",
    note: "Premium kontrast və güclü brend",
    frontClass: "bg-[linear-gradient(135deg,#020617_0%,#0f172a_48%,#164e63_100%)] border border-white/10 text-white",
    backClass: "bg-[linear-gradient(135deg,#0f172a_0%,#020617_100%)] border border-white/10 text-white",
    frontAccent: "text-cyan-300",
    logoClass: "bg-cyan-300 text-slate-950",
    labelClass: "text-cyan-200/80",
    titleClass: "text-white",
    backTextClass: "text-slate-200",
    backMutedClass: "text-slate-400"
  },
  {
    variant: "silver",
    name: "Gümüş NFC kart",
    note: "Metalik parlaq premium finish",
    frontClass:
      "bg-[linear-gradient(135deg,#94a3b8_0%,#cbd5e1_28%,#f8fafc_52%,#94a3b8_78%,#64748b_100%)] border border-white/60 text-slate-900",
    backClass:
      "bg-[linear-gradient(135deg,#64748b_0%,#94a3b8_35%,#e2e8f0_58%,#64748b_100%)] border border-white/50 text-slate-900",
    frontAccent: "text-slate-700",
    logoClass: "bg-slate-900 text-slate-100 shadow-inner",
    labelClass: "text-slate-600",
    titleClass: "text-slate-900",
    backTextClass: "text-slate-800",
    backMutedClass: "text-slate-600"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 }
};

export default function NfcCardShowcase() {
  return (
    <section id="cards" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">Kart kolleksiyası</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Fiziki kartınızı seçin — üzərinə gəldikdə arxasını görün.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Ağ, qara və gümüş finish seçimləri. Kartın üzərinə gəldikdə 3D fırlanma ilə arxa tərəfdə NFC və QR detalları görünür.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <div key={card.variant} className="flex flex-col items-center px-2 py-2">
              <FlipCard card={card} />
              <motion.h3
                className="mt-6 text-xl font-black tracking-tight text-slate-950"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: index * 0.08 + 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                {card.name}
              </motion.h3>
              <motion.p
                className="mt-2 text-center text-sm font-semibold text-slate-500"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: index * 0.08 + 0.14, ease: [0.23, 1, 0.32, 1] }}
              >
                {card.note}
              </motion.p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">Üzərinə gəlin</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ card }: { card: (typeof cards)[number] }) {
  return (
    <div className="nfc-card-flip w-full max-w-[320px] cursor-pointer outline-none focus-within:ring-4 focus-within:ring-cyan-200/80 rounded-[1.35rem]" tabIndex={0}>
      <div className="relative w-full select-none" style={{ aspectRatio: "1.586 / 1" }}>
        <div className="nfc-flip-inner relative h-full w-full">
          <div
            className={`absolute inset-0 overflow-hidden rounded-[1.35rem] p-6 shadow-[0_28px_80px_rgba(15,23,42,0.18)] ${card.frontClass}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(1px)"
            }}
          >
            <CardShine variant={card.variant} />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className={`grid size-11 place-items-center rounded-full text-lg font-black shadow-sm ${card.logoClass}`}>Z</div>
                <Sparkles className={`${card.frontAccent} opacity-80`} size={20} />
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${card.labelClass}`}>Sizin Logo</p>
                <p className={`mt-1 text-lg font-black tracking-tight ${card.titleClass}`}>Rəqəmsal kimlik</p>
              </div>
            </div>
          </div>

          <div
            className={`absolute inset-0 overflow-hidden rounded-[1.35rem] p-6 shadow-[0_28px_80px_rgba(15,23,42,0.18)] ${card.backClass}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)"
            }}
          >
            <CardShine variant={card.variant} subtle />
            <div className="relative flex h-full flex-col items-center justify-between text-center">
              <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${card.backMutedClass}`}>Arxa tərəf</p>
              <div className="grid place-items-center gap-3">
                <div
                  className={`grid size-14 place-items-center rounded-2xl ${
                    card.variant === "black" ? "bg-white/10 text-cyan-300" : "bg-slate-950/8 text-slate-700"
                  }`}
                >
                  <Nfc size={28} strokeWidth={1.75} />
                </div>
                <div className={`rounded-xl p-2 ${card.variant === "black" ? "bg-white/10" : "bg-white/70 shadow-sm"}`}>
                  <QrCode size={36} strokeWidth={1.5} className={card.backTextClass} />
                </div>
              </div>
              <div>
                <p className={`text-xs font-black uppercase tracking-[0.18em] ${card.backMutedClass}`}>Touch · Share · Connect</p>
                <p className={`mt-1 text-sm font-bold ${card.backTextClass}`}>NFC + QR ehtiyat</p>
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
      <div
        className={`pointer-events-none absolute inset-0 ${
          subtle ? "opacity-40" : "opacity-100"
        } bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.55)_42%,transparent_58%)]`}
      />
    );
  }

  if (variant === "black") {
    return (
      <div
        className={`pointer-events-none absolute inset-0 ${
          subtle ? "opacity-50" : "opacity-100"
        } bg-[linear-gradient(135deg,rgba(34,211,238,0.2),transparent_42%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.07)_40%,transparent_58%)]`}
      />
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${
        subtle ? "opacity-30" : "opacity-70"
      } bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.9)_40%,transparent_56%)]`}
    />
  );
}
