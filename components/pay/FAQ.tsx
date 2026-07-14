import { ChevronRight } from "lucide-react";

const faqs = [
  [
    "App yükləmək lazımdır?",
    "Xeyr. Müştəri NFC və ya QR ilə brauzerdə menyunu açır — heç bir tətbiq tələb olunmur.",
  ],
  [
    "Yediklərimi seçərək ödəyə bilərəm?",
    "Bəli. Tam məbləği ödəyə və ya yalnız yediyiniz məhsulları seçərək öz payınızı ödəyə bilərsiniz. Dostlarınız eyni axınla davam edir.",
  ],
  [
    "Hansı ödəniş üsulları dəstəklənir?",
    "Apple Pay və Google Pay. Kart məlumatları Zia-Pay-də saxlanılmır — biometrik təsdiq cihazınızda qalır.",
  ],
  [
    "Restoran üçün abunə haqqı varmı?",
    "Başlanğıc 0 ₼. Xidmət haqqı yalnız istifadə zamanı — 1%. Ağır abunə yoxdur.",
  ],
  [
    "NFC işləməsə nə olar?",
    "Hər masa üçün QR ehtiyat nüsxəsi var. Köhnə telefonlar da kamerayla skan edib menyuya daxil ola bilər.",
  ],
] as const;

export default function FAQ() {
  return (
    <section
      id="faq"
      className="bg-slate-950 px-4 py-20 text-white sm:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="section-label-light">FAQ</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Tez-tez verilən suallar.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-400">
            Daha çox sualınız varsa:{" "}
            <a
              href="mailto:office@zia-pay.az"
              className="font-bold text-sky-300 hover:text-sky-200"
            >
              office@zia-pay.az
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map(([q, a]) => (
            <details
              key={q}
              className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition-colors duration-200 open:bg-white/[0.07]"
            >
              <summary className="cursor-pointer list-none font-black tracking-tight">
                <span className="flex items-center justify-between gap-4">
                  {q}
                  <ChevronRight
                    className="shrink-0 transition-transform duration-200 group-open:rotate-90"
                    size={18}
                  />
                </span>
              </summary>
              <p className="mt-3 leading-7 text-slate-400">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
