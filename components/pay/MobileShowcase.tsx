import { Check, CreditCard } from "lucide-react";
import PhoneFrame from "@/components/pay/PhoneFrame";
import PhoneMenuScreen from "@/components/pay/PhoneMenuScreen";

const points = [
  "Sürətli mobil menyu",
  "Təmiz səbət axını",
  "Apple / Google Pay",
  "Yediklərinlə ödə (split)",
];

export default function MobileShowcase() {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Real phone frame — eyni komponent Hero/Demo ilə */}
        <div className="relative mx-auto w-full max-w-[320px]">
          <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-sky-200/50 via-transparent to-sky-100/40 blur-2xl" />
          <div className="relative z-10 flex justify-center">
            <PhoneFrame size="md">
              <PhoneMenuScreen />
            </PhoneFrame>
          </div>
          <div className="absolute -right-2 bottom-16 z-20 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-lg sm:block">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-xl bg-sky-100 text-sky-600">
                <CreditCard size={14} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-950">Ödəniş hazır</p>
                <p className="text-[10px] font-semibold text-slate-500">29,00 ₼</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="section-label">Mobil öncəlikli</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            Telefonlarda sürətli açılan menyu və ödəniş axını.
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            İlk ekran restoranın menyusunu, səbəti və ödəniş seçimlərini qarışıqlıq
            olmadan göstərir. NFC/QR ehtiyatı, split ödəniş və biometrik təsdiq —
            hamısı bir axında.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {points.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-700 shadow-sm"
              >
                <Check className="shrink-0 text-sky-500" size={19} />
                <span className="text-sm sm:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
