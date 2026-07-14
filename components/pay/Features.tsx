import {
  Nfc,
  ShoppingBag,
  Split,
  Smartphone,
  Zap,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Nfc,
    title: "NFC + QR giriş",
    text: "Masadakı NFC kart və ya QR kod bir toxunuşla rəqəmsal menyunu açır. Tətbiq yükləməyə ehtiyac yoxdur.",
  },
  {
    icon: ShoppingBag,
    title: "Rəqəmsal menyu & səbət",
    text: "Müştəri menyudan seçir, səbətə yığır, miqdarı dəyişir və sifarişi özü təsdiqləyir — ofisiant gözləmədən.",
  },
  {
    icon: Split,
    title: "Yediklərinlə ödə (split)",
    text: "Tam məbləği ödəyə və ya yalnız yediyi məhsulları seçərək öz payını ödəyə bilər. Dostlar eyni axınla davam edir.",
  },
  {
    icon: Smartphone,
    title: "Apple Pay & Google Pay",
    text: "Kart məlumatı daxil etməyə ehtiyac yoxdur. Biometrik təsdiqlə bir toxunuş — təhlükəsiz və sürətli.",
  },
  {
    icon: Zap,
    title: "Sürətli masa dövriyyəsi",
    text: "Sifariş və ödəniş gözləməsi qısalır. Müştəri özü prosesi idarə edir — masa daha tez boşalır.",
  },
  {
    icon: ShieldCheck,
    title: "Təhlükəsiz ödəniş",
    text: "Kart məlumatları Zia-Pay-də saxlanılmır. Apple Pay və Google Pay sənaye standartı şifrələmə ilə işləyir.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-white px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="section-label">Özəlliklər</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Müasir restoran təcrübəsinin sahib olmalı olduğu hər şey — bir
              mobil axında.
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="card-hover group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-sky-300 transition-transform duration-200 group-hover:scale-[1.03]">
                <Icon size={24} />
              </div>
              <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950">
                {title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
