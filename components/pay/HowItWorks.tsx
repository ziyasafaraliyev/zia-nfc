import { CreditCard, Nfc, ShoppingCart, UtensilsCrossed } from "lucide-react";

const steps = [
  {
    title: "NFC və ya QR oxu",
    desc: "Masadakı NFC karta toxunur və ya QR skan edir. App lazım deyil — brauzerdə menyu dərhal açılır.",
    icon: Nfc,
  },
  {
    title: "Menyudan seç, səbətə yığ",
    desc: "Rəqəmsal menyu açılır. Müştəri yemək və içkiləri öz tempində seçib səbətə əlavə edir.",
    icon: UtensilsCrossed,
  },
  {
    title: "Səbəti təsdiqlə",
    desc: "Siyahını yoxlayır, miqdarı düzəldir və sifarişi təsdiqləyir — sonra ödənişə keçir.",
    icon: ShoppingCart,
  },
  {
    title: "Tam ödə və ya böl",
    desc: "Apple Pay / Google Pay ilə hamısını ödəyir və ya yalnız yediyi məhsulları seçərək payını ödəyir.",
    icon: CreditCard,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="section-label-light">İş prinsipi</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
              NFC texnologiyası ilə restoran axını.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
              Menyudan ödənişə qədər — bir toxunuş, bir brauzer, sıfır növbə.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 hover:bg-white/[0.07]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="grid size-10 place-items-center rounded-xl bg-sky-500/15 text-sky-300">
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-black text-sky-300">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
