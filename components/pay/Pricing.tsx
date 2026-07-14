import { BadgeCheck } from "lucide-react";

const plans = [
  {
    name: "Başlanğıc",
    price: "0 ₼",
    note: "Ağır abunə yox · sürətli start",
    items: [
      "NFC / QR masa quraşdırması",
      "Rəqəmsal menyu",
      "Səbət və təsdiq",
      "Apple Pay / Google Pay",
    ],
  },
  {
    name: "İşləyən restoran",
    price: "1%",
    note: "Yalnız istifadə zamanı — xidmət haqqı",
    featured: true,
    items: [
      "Tam menyu + səbət axını",
      "Yediklərinlə ödə (split)",
      "Restoran paneli",
      "Ödəniş statusu real vaxtda",
    ],
  },
  {
    name: "Şəbəkə",
    price: "Özəl",
    note: "Çoxsaylı filial və brendlər üçün",
    items: [
      "Çox filial idarəetməsi",
      "Brendə uyğun menyu sistemi",
      "Toplu NFC / QR",
      "Prioritet dəstək",
    ],
  },
];

const integrationSteps = [
  {
    title: "Menyu & brend",
    desc: "Restoran menyusu, qiymətlər və brend görünüşü yüklənir.",
  },
  {
    title: "NFC / QR masa",
    desc: "Hər masa üçün NFC kart və ya stiker + QR ehtiyatı yerləşdirilir.",
  },
  {
    title: "Səbət & ödəniş",
    desc: "Müştəri seçir, təsdiqləyir, Apple / Google Pay ilə ödəyir.",
  },
  {
    title: "Restoran paneli",
    desc: "Sifariş və ödəniş statusu heyət paneline düşür.",
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-slate-50 px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <p className="section-label">Qiymətlər</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Aydın model. Sürətli start.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Zia-Pay restorana rəqəmsal menyu, səbət və müasir ödəniş gətirir —
          NFC/QR ilə bir toxunuşda.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-3xl border p-7 shadow-[0_16px_50px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1.5 hover:scale-[1.02] ${
                plan.featured
                  ? "border-sky-300 bg-slate-950 text-white hover:shadow-[0_24px_80px_rgba(14,165,233,0.15)]"
                  : "border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
              }`}
            >
              <div>
                {plan.featured ? (
                  <div className="absolute right-5 top-5 rounded-full bg-sky-300 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-950">
                    Populyar
                  </div>
                ) : null}
                <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                <p
                  className={`mt-2 text-sm font-bold ${
                    plan.featured ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {plan.note}
                </p>
                <p
                  className={`mt-6 text-4xl font-black tracking-tight ${
                    plan.featured ? "text-sky-300" : "text-slate-950"
                  }`}
                >
                  {plan.price}
                </p>
                <div className="mt-7 space-y-3">
                  {plan.items.map((item) => (
                    <div
                      key={item}
                      className={`flex items-center gap-3 text-sm font-semibold ${
                        plan.featured ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      <BadgeCheck
                        size={18}
                        className={
                          plan.featured ? "text-sky-300" : "text-sky-500"
                        }
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <a
                  href="mailto:office@zia-pay.az"
                  className={`block w-full rounded-full py-3.5 text-center text-sm font-black uppercase tracking-[0.14em] transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                    plan.featured
                      ? "bg-sky-300 text-slate-950 shadow-md hover:bg-white"
                      : plan.name === "Şəbəkə"
                        ? "bg-sky-500 text-white shadow-[0_12px_30px_rgba(14,165,233,0.2)] hover:bg-sky-400"
                        : "bg-slate-950 text-white shadow-md hover:bg-slate-800"
                  }`}
                >
                  {plan.name === "Şəbəkə" ? "Bizimlə əlaqə" : "Başla"}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-slate-950 p-8 md:p-12">
          <h3 className="mb-8 text-center text-xl font-black text-white md:text-2xl">
            Restoran necə qoşulur?
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {integrationSteps.map((s, i) => (
              <div key={s.title}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-sm font-black text-white">
                  {i + 1}
                </div>
                <h4 className="mb-2 font-bold text-white">{s.title}</h4>
                <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
