import { Check } from "lucide-react";

const restaurantBenefits = [
  {
    title: "Özünəxidmət sifariş",
    desc: "Müştəri NFC/QR ilə menyunu özü açır və səbətə yığır. Ofisiant yükü azalır, pik saatlarda axın daha rahat olur.",
  },
  {
    title: "Daha sürətli masa dövriyyəsi",
    desc: "Sifariş və ödəniş gözləməsi qısalır. Müştəri özü prosesi idarə edir — masa daha tez boşalır.",
  },
  {
    title: "Müasir ödəniş təcrübəsi",
    desc: "Apple Pay və Google Pay ilə ödəniş, yediklərini seçərək bölmə — restoran brendi peşəkar və rəqəmsal görünür.",
  },
];

const guestBenefits = [
  {
    title: "Menyu dərhal əldə",
    desc: "NFC və ya QR — bir toxunuş. Menyu telefonunda açılır, kağız gözləmək lazım deyil.",
  },
  {
    title: "Öz tempində sifariş",
    desc: "Nə istədiyini seç, səbətə yığ, təsdiqlə. Heç kim tələsmir, heç kim unutmur.",
  },
  {
    title: "Yediklərinlə ödə",
    desc: "Tam səbəti ödəyə və ya yalnız yediyin məhsulları seçib öz payını ödəyə bilərsən.",
  },
  {
    title: "Apple Pay & Google Pay",
    desc: "Kart məlumatı daxil etmirsən. Face ID / barmaq izi ilə bir toxunuş.",
  },
];

export default function ValueProp() {
  return (
    <section id="dəyər" className="bg-slate-50 px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="section-label mb-4">Dəyər təklifi</p>
          <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Restoran və qonaq{" "}
            <span className="text-sky-500">eyni axında qazanır.</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Zia-Pay menyu, səbət, təsdiq və ödənişi bir mobil axında birləşdirir —
            NFC/QR ilə başlayır, Apple/Google Pay ilə bitir.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-[0_22px_70px_rgba(15,23,42,0.2)] md:p-10">
            <div className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sky-300">
              Restoranlar üçün
            </div>
            <h3 className="mb-8 text-2xl font-black tracking-tight sm:text-3xl">
              Daha az yük. Daha rəqəmsal masa.
            </h3>
            <div className="space-y-6">
              {restaurantBenefits.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold">{b.title}</h4>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_16px_50px_rgba(15,23,42,0.06)] md:p-10">
            <div className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sky-700">
              Qonaqlar üçün
            </div>
            <h3 className="mb-8 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Seç, təsdiqlə, ödə.
            </h3>
            <div className="space-y-6">
              {guestBenefits.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold text-slate-950">{b.title}</h4>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
