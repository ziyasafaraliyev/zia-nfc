import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  ChevronRight,
  Instagram,
  Layers3,
  MessageCircle,
  Music2,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LandingHeroMockup from "@/components/landing-hero-mockup";
import LandingNavbar from "@/components/landing-navbar";
import NfcCardShowcase from "@/components/nfc-card-showcase";
import { ProfileShowcase } from "@/components/landing-phone-profile";

const features = [
  {
    icon: MessageCircle,
    title: "Sürətli əlaqə",
    text: "Bir mobil profildən WhatsApp, zənglər, e-poçt və sosial şəbəkələri asanlıqla açın.",
  },
  {
    icon: Camera,
    title: "İlk növbədə portfolio",
    text: "Müştəriləri dağınıq linklərə yönləndirmədən xidmətlərinizi və işlərinizi nümayiş etdirin.",
  },
  {
    icon: UserPlus,
    title: "Kontaktı yadda saxla",
    text: "Yüklənə bilən vCard sürətli görüşü daimi telefon kontaktına çevirir.",
  },
  {
    icon: RefreshCw,
    title: "Canlı yenilənmələr",
    text: "Fiziki NFC kartı eyni qalmaqla linkləri, şəkilləri, qiymətləri və bioqrafiyanı dəyişin.",
  },
  {
    icon: QrCode,
    title: "QR ehtiyat nüsxəsi",
    text: "Hər bir kart köhnə telefonlar və kamera vasitəsilə skan etmək üçün təmiz QR nüsxəsini ehtiva edir.",
  },
  {
    icon: ShieldCheck,
    title: "Brend təhlükəsizliyi",
    text: "Profillər admin panelindən komandalar üçün aktivləşdirilə, söndürülə, redaktə edilə və paylaşıla bilər.",
  },
];

const steps = [
  ["Kartı dizayn edin", "Brendinizə uyğun premium NFC kart dizaynını seçin."],
  [
    "Profili aktiv edin",
    "Əlaqə vasitələrini, sosial linkləri, qalereyanı, QR və vCard ixracını tənzimləyirik.",
  ],
  [
    "Paylaşmaq üçün toxundurun",
    "Müştərilər kartı toxundurur və ya QR-ı skan edərək sürətli mobil profilinizə daxil olurlar.",
  ],
  [
    "İstənilən vaxt yeniləyin",
    "Təklifiniz, kontentiniz və ya komandanız dəyişdikdə rəqəmsal profili yeniləyin.",
  ],
];

const plans = [
  {
    name: "Standart",
    price: "59 AZN",
    note: "Fərdi peşəkarlar üçün",
    items: [
      "1 rəqəmsal profil",
      "WhatsApp və sosial linklər",
      "QR ehtiyat nüsxəsi",
      "Standart NFC kartı",
    ],
  },
  {
    name: "Premium",
    price: "99 AZN",
    note: "Ən çox tələb olunan",
    featured: true,
    items: [
      "Portfolio qalereyası",
      "Kontaktı yadda saxla (.vcf)",
      "Premium kart dizaynı",
      "Premium qablaşdırma",
    ],
  },
  {
    name: "Studio",
    price: "Özəl",
    note: "Komandalar və brendlər üçün",
    items: [
      "Çoxsaylı profillər",
      "Brendə uyğun profil sistemi",
      "Toplu kart istehsalı",
      "Prioritet yeniləmələr",
    ],
  },
];

const metrics = [
  ["1 toxunuş", "profil ötürülməsi"],
  ["24/7", "redaktə edilə bilən kimlik"],
  ["0 tətbiq", "açmaq üçün tələb olunur"],
];

const products = [
  {
    title: "NFC Vizit Kart",
    desc: "Premium dizaynlı NFC smart vizit kartı ilə müştərilərinizə təsirli ilk tanışlıq yaradın.",
    image: "/vizit-kart.webp",
  },
  {
    title: "NFC Stiker",
    desc: "Telefon, noutbuk və ya istənilən səthə yapışdırıla bilən kompakt NFC stiker.",
    image: "/stiker.webp",
  },
  {
    title: "NFC Masa Standı",
    desc: "Kafe, restoran və ofislər üçün masaüstü NFC menyu və ya profil standı.",
    image: "/masa-standi.webp",
  },
];

/**
 * Server Component landing — static HTML for SEO/LCP.
 * Interactive/animated islands: LandingHeroMockup, NfcCardShowcase (client).
 */
export default function LandingPage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative min-h-screen border-b border-slate-200/70 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#eef6ff_100%)] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
        <LandingNavbar />

        <div className="mx-auto grid max-w-7xl items-center gap-12 pb-8 pt-14 lg:min-h-[calc(100vh-104px)] lg:grid-cols-[1.02fr_0.98fr] lg:pt-10">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-3.5 py-2 text-sm font-bold text-sky-800">
              <Sparkles size={16} /> Premium NFC kimlik platforması
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.96] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Bir Toxunuşla Sonsuz Əlaqələr
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
              Zia NFC fiziki smart kartı kontaktlar, sosial şəbəkələr və
              portfolionu bir araya gətirən zərif rəqəmsal profilə çevirir. QR
              ehtiyat nüsxəsi ilə hər zaman əlçatan olur.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-4 font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
              >
                Kart sifariş et <ArrowRight size={18} />
              </a>
              <Link
                href="/pay"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-4 font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
              >
                Zia Pay <ArrowRight size={18} />
              </Link>
              <Link
                href="/restoran"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-4 font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
              >
                Zia Menyu <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {metrics.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:bg-white/70"
                >
                  <p className="text-2xl font-black tracking-tight text-slate-950">
                    {value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <LandingHeroMockup />
        </div>
      </section>

      <section className="perf-cv bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.94fr_1.06fr]">
          <ProfileShowcase />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-700">
              Mobil öncəlikli
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Telefonlarda sürətli açılan və rahat istifadə olunan profil
              səhifəsi.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              İlk ekran kim olduğunuzu, nə etdiyinizi və sizinlə necə əlaqə
              saxlayacağınızı aydınlaşdırır. Qalereya, sosial linklər, vCard və
              QR ehtiyat nüsxəsi qarışıqlıq yaratmadan əlçatandır.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Sürətli mobil profil",
                "Təmiz əlaqə düymələri",
                "Vizual portfolio",
                "Admin nəzarəti",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-700 shadow-sm"
                >
                  <Check className="text-sky-500" size={19} /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NfcCardShowcase />

      <section id="nfc-products" className="perf-cv bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-700">
            Məhsullar
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            NFC məhsulları
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Biznesinizi rəqəmsallaşdıracaq premium NFC məhsullarımız ilə tanış
            olun.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.title}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition duration-200 ease-out hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_22px_70px_rgba(15,23,42,0.1)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      <Layers3 size={48} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-black tracking-tight text-slate-950">
                    {product.title}
                  </h3>
                  <p className="mt-3 flex-1 leading-7 text-slate-600">
                    {product.desc}
                  </p>
                  <a
                    href="https://wa.me/994702990252"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(14,165,233,0.2)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
                  >
                    Sifariş et <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-300">
                İş Prinsipi
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
                NFC texnologiyası ilə innovativ həllər.
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {steps.map(([title, text], index) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <div className="mb-8 text-sm font-black text-sky-300">
                    0{index + 1}
                  </div>
                  <h3 className="text-lg font-black tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-700">
            Qiymətlər
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Rəqəmsal kimliyinizi başlatmaq üçün aydın paketlər.
          </h2>
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
                      Populyar
                    </div>
                  ) : null}
                  <h3 className="text-2xl font-black tracking-tight">
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-2 text-sm font-bold ${plan.featured ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {plan.note}
                  </p>
                  <p
                    className={`mt-6 text-4xl font-black tracking-tight ${plan.featured ? "text-sky-300" : "text-slate-950"}`}
                  >
                    {plan.price}
                  </p>
                  <div className="mt-7 space-y-3">
                    {plan.items.map((item) => (
                      <div
                        key={item}
                        className={`flex items-center gap-3 text-sm font-semibold ${plan.featured ? "text-slate-200" : "text-slate-700"}`}
                      >
                        <BadgeCheck
                          size={18}
                          className={
                            plan.featured ? "text-sky-300" : "text-sky-500"
                          }
                        />{" "}
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  {plan.name === "Studio" ? (
                    <a
                      href="https://wa.me/994702990252"
                      className="block w-full rounded-full bg-sky-500 px-4 py-3.5 text-center text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(14,165,233,0.2)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
                    >
                      Bizimlə əlaqə
                    </a>
                  ) : plan.featured ? (
                    <a
                      href="https://wa.me/994702990252"
                      className="block w-full rounded-full bg-sky-300 px-4 py-3.5 text-center text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]"
                    >
                      Sifariş et
                    </a>
                  ) : (
                    <a
                      href="https://wa.me/994702990252"
                      className="block w-full rounded-full bg-slate-950 px-4 py-3.5 text-center text-sm font-black uppercase tracking-[0.14em] text-white shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-800 active:scale-[0.98]"
                    >
                      Sifariş et
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-700">
                Özəlliklər
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Müasir vizit kartın sahib olmalı olduğu hər şey tək bir sürətli
                profildə.
              </h2>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition duration-200 ease-out hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_22px_70px_rgba(15,23,42,0.1)]"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-sky-300 transition-transform duration-200 ease-out group-hover:scale-[1.03]">
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

      <section
        id="faq"
        className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-300">
              FAQ
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              Tez-tez verilən suallar.
            </h2>
          </div>
          <div className="space-y-3">
            {[
              [
                "Kartı dəyişmədən profili yeniləyə bilərəm?",
                "Bəli. NFC kart eyni profil URL-ni açır, profil məzmunu isə istənilən vaxt redaktə edilə bilər.",
              ],
              [
                "Hər profildə QR kod olur?",
                "Bəli. Profil üçün QR ehtiyat nüsxəsi yaradılır ki, NFC işləmədikdə müştərilər skan edə bilsinlər.",
              ],
              [
                "İstifadəçilər əlaqə məlumatlarımı yadda saxlaya bilərmi?",
                "Bəli. Profil vCard dəstəkləyir, beləcə müştərilər əlaqə məlumatlarınızı telefonlarına əlavə edə bilərlər.",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition-colors duration-200 ease-out open:bg-white/[0.07]"
              >
                <summary className="cursor-pointer list-none font-black tracking-tight">
                  <span className="flex items-center justify-between gap-4">
                    {q}
                    <ChevronRight
                      className="shrink-0 transition-transform duration-200 ease-out group-open:rotate-90"
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

      <footer className="bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-base font-black uppercase tracking-[0.24em] text-sky-300">
              <Image
                src="/logo.webp"
                alt="Zia NFC"
                width={36}
                height={36}
                className="size-9 rounded-full object-cover"
              />
              Zia NFC
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Rəqəmsal biznes kartlar, canlı profil yenilənmələri və NFC tək
              toxunuşda əlaqə paylaşımı.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.instagram.com/zianfc.az"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition duration-200 ease-out hover:bg-sky-400"
                aria-label="Instagram"
              >
                <Instagram size={16} /> Instagram
              </a>
              <a
                href="https://www.tiktok.com/@zianfc.az"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition duration-200 ease-out hover:bg-sky-400"
                aria-label="TikTok"
              >
                <Music2 size={16} /> TikTok
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&to=nfczia@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition duration-200 ease-out hover:bg-sky-400"
                aria-label="E-poçt"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                E-poçt
              </a>
              <a
                href="https://wa.me/994702990252"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition duration-200 ease-out hover:bg-sky-400"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>© {year} Zia NFC</span>
              <a href="#" className="transition-colors hover:text-white">
                Məxfilik
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Şərtlər
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
