"use client";

import {
  ArrowRight,
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
import PricingSection from "@/components/pricing-section";
import { LanguageProvider, useLang } from "@/components/language-context";

// ---------------------------------------------------------------------------
// Translation helpers — all content lives here, keyed by lang
// ---------------------------------------------------------------------------

const FEATURES_AZ = [
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
    text: "Məlumatlarınız eyni qalmaqla linkləri, şəkilləri, qiymətləri və bioqrafiyanı istənilən an onlayn dəyişin.",
  },
  {
    icon: QrCode,
    title: "NFC və QR Dəstəyi",
    text: "Hər bir rəqəmsal profil təmiz QR kodu və ani paylaşım keçidi ehtiva edir.",
  },
  {
    icon: ShieldCheck,
    title: "Brend təhlükəsizliyi",
    text: "Profillər admin panelindən komandalar üçün aktivləşdirilə, söndürülə, redaktə edilə və paylaşıla bilər.",
  },
];

const FEATURES_EN = [
  {
    icon: MessageCircle,
    title: "Instant Contact",
    text: "Open WhatsApp, calls, email and social networks with a single tap from one mobile profile.",
  },
  {
    icon: Camera,
    title: "Portfolio First",
    text: "Showcase your services and work without sending clients to scattered links.",
  },
  {
    icon: UserPlus,
    title: "Save Contact",
    text: "A downloadable vCard turns a quick meeting into a permanent phone contact.",
  },
  {
    icon: RefreshCw,
    title: "Live Updates",
    text: "Change links, photos, prices and bio online at any time — your data stays the same.",
  },
  {
    icon: QrCode,
    title: "NFC & QR Support",
    text: "Every digital profile includes a clean QR code and instant sharing link.",
  },
  {
    icon: ShieldCheck,
    title: "Brand Security",
    text: "Profiles can be activated, deactivated, edited and shared for teams from the admin panel.",
  },
];

const STEPS_AZ = [
  ["Profili yaradın", "Brendinizə uyğun rəqəmsal profil mövzusunu seçin."],
  ["Məlumatları daxil edin", "Əlaqə vasitələrini, sosial linkləri, qalereyanı, QR və vCard ixracını tənzimləyin."],
  ["Sürətli paylaşın", "Müştərilər keçid və ya QR skan edərək instant mobil profilinizə daxil olurlar."],
  ["İstənilən vaxt yeniləyin", "Təklifiniz, kontentiniz və ya komandanız dəyişdikdə rəqəmsal profili istənilən an yeniləyin."],
] as const;

const STEPS_EN = [
  ["Create a Profile", "Choose the digital profile theme that fits your brand."],
  ["Enter Your Info", "Set up contact details, social links, gallery, QR and vCard export."],
  ["Share Instantly", "Clients access your instant mobile profile via link or QR scan."],
  ["Update Anytime", "Edit your digital profile whenever your offer, content or team changes."],
] as const;

const METRICS_AZ = [
  ["1 keçid", "profil ötürülməsi"],
  ["24/7", "redaktə edilə bilən kimlik"],
  ["0 tətbiq", "açmaq üçün tələb olunur"],
] as const;

const METRICS_EN = [
  ["1 tap", "profile sharing"],
  ["24/7", "editable identity"],
  ["0 apps", "required to open"],
] as const;

const SERVICES_AZ = [
  {
    title: "Rəqəmsal Profil Hostinqi",
    desc: "Fərdi peşəkarlar üçün mobil rəqəmsal profil, vCard ixracı və sosial platforma inteqrasiyası.",
    image: "/vizit-kart.webp",
  },
  {
    title: "Portfolio & Analitika SaaS",
    desc: "İnteraktiv portfolio qalereyası, brend mövzuları və real-vaxt ziyarətçi statistikası.",
    image: "/stiker.webp",
  },
  {
    title: "Restoran Menyu & Komanda Platforması",
    desc: "Kafe, restoran və komandalar üçün cloud menyu, çoxsaylı profil idarəçiliyi və QR sistemi.",
    image: "/masa-standi.webp",
  },
];

const SERVICES_EN = [
  {
    title: "Digital Profile Hosting",
    desc: "Mobile digital profile, vCard export and social platform integration for individual professionals.",
    image: "/vizit-kart.webp",
  },
  {
    title: "Portfolio & Analytics SaaS",
    desc: "Interactive portfolio gallery, brand themes and real-time visitor statistics.",
    image: "/stiker.webp",
  },
  {
    title: "Restaurant Menu & Team Platform",
    desc: "Cloud menu, multi-profile management and QR system for cafes, restaurants and teams.",
    image: "/masa-standi.webp",
  },
];

/**
 * Landing page wrapped in LanguageProvider so the AZ/EN switcher
 * (in LandingNavbar) can reactively translate all content.
 */
export default function LandingPage() {
  return (
    <LanguageProvider>
      <LandingPageInner />
    </LanguageProvider>
  );
}

function LandingPageInner() {
  const { lang, t } = useLang();
  const year = new Date().getFullYear();

  const features = lang === "en" ? FEATURES_EN : FEATURES_AZ;
  const steps    = lang === "en" ? STEPS_EN    : STEPS_AZ;
  const metrics  = lang === "en" ? METRICS_EN  : METRICS_AZ;
  const digitalServices = lang === "en" ? SERVICES_EN : SERVICES_AZ;

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative min-h-screen border-b border-slate-200/70 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#eef6ff_100%)] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
        <LandingNavbar />

        <div className="mx-auto grid max-w-7xl items-center gap-12 pb-8 pt-14 lg:min-h-[calc(100vh-104px)] lg:grid-cols-[1.02fr_0.98fr] lg:pt-10">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-3.5 py-2 text-sm font-bold text-sky-800">
              <Sparkles size={16} /> {t("Rəqəmsal Profil & SaaS Platforması", "Digital Profile & SaaS Platform")}
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.96] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              {t("Rəqəmsal Vizit Və Profil Platforması", "Digital Business Card & Profile Platform")}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
              {t(
                "Zia NFC brendinizi, kontaktlarınızı və portfolionuzu bir araya gətirən müasir rəqəmsal profil platformasıdır. Avtomatik vCard və dinamik QR kod inteqrasiyası ilə 24/7 əlçatandır.",
                "Zia NFC is the modern digital profile platform that brings together your brand, contacts and portfolio. Available 24/7 with automatic vCard and dynamic QR code integration."
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-4 font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
              >
                {t("Abunə ol", "Subscribe")} <ArrowRight size={18} />
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
                {t("Zia Menyu", "Zia Menu")} <ArrowRight size={18} />
              </Link>
              <Link
                href="/car"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-4 font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
              >
                Zia Car <ArrowRight size={18} />
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

      <section id="digital-profile" className="perf-cv bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.94fr_1.06fr]">
          <ProfileShowcase />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-700">
              {t("Mobil öncəlikli", "Mobile First")}
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {t(
                "Telefonlarda sürətli açılan və rahat istifadə olunan rəqəmsal profil.",
                "A digital profile that loads fast and feels great on phones."
              )}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {t(
                "İlk ekran kim olduğunuzu, nə etdiyinizi və sizinlə necə əlaqə saxlayacağınızı aydınlaşdırır. Qalereya, sosial linklər, vCard və QR ehtiyat nüsxəsi qarışıqlıq yaratmadan əlçatandır.",
                "The first screen clarifies who you are, what you do and how to reach you. Gallery, social links, vCard and QR backup are accessible without any confusion."
              )}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {(lang === "en"
                ? ["Fast mobile profile", "Clean contact buttons", "Visual portfolio", "Admin control"]
                : ["Sürətli mobil profil", "Təmiz əlaqə düymələri", "Vizual portfolio", "Admin nəzarəti"]
              ).map((item) => (
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

      <section id="digital-services" className="perf-cv bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-700">
            {t("Xidmətlər", "Services")}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            {t("Rəqəmsal SaaS Xidmətlərimiz", "Our Digital SaaS Services")}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {t(
              "Biznesinizi və şəxsi brendinizi rəqəmsallaşdıracaq cloud platformamız ilə tanış olun.",
              "Get to know our cloud platform that will digitize your business and personal brand."
            )}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {digitalServices.map((product) => (
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
                    href="#pricing"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(14,165,233,0.2)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
                  >
                    {t("Başla", "Get Started")} <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <NfcCardShowcase />

      <section
        id="how-it-works"
        className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-300">
                {t("İş Prinsipi", "How It Works")}
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
                {t("Rəqəmsal profil platforması necə işləyir?", "How does the digital profile platform work?")}
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

      <section id="features" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-700">
                {t("Özəlliklər", "Features")}
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {t(
                  "Müasir rəqəmsal kimliyin sahib olmalı olduğu hər şey tək bir sürətli profildə.",
                  "Everything a modern digital identity needs, in one fast profile."
                )}
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
              {t("Tez-tez verilən suallar.", "Frequently Asked Questions.")}
            </h2>
          </div>
          <div className="space-y-3">
            {(lang === "en"
              ? [
                  ["Can I update the profile later?", "Yes. Your digital profile can be edited and updated at any time from the control panel."],
                  ["Does every profile have a QR code?", "Yes. A dynamic QR code with a full link and backup is provided for each profile."],
                  ["Can users save my contact info?", "Yes. The profile supports vCard, so clients can add your contact details to their phone in one click."],
                ]
              : [
                  ["Profili sonradan yeniləyə bilərəm?", "Bəli. Rəqəmsal profiliniz istənilən vaxt idarəetmə panelindən redaktə edilə və yenilənə bilər."],
                  ["Hər profildə QR kod olur?", "Bəli. Profil üçün dinamik QR koda bütöv keçid və ehtiyat nüsxəsi təmin edilir."],
                  ["İstifadəçilər əlaqə məlumatlarımı yadda saxlaya bilərmi?", "Bəli. Profil vCard dəstəkləyir, beləcə müştərilər əlaqə məlumatlarınızı telefonlarına bir kliklə əlavə edə bilərlər."],
                ]
            ).map(([q, a]) => (
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
              {t(
                "Rəqəmsal profil hostinq platforması, canlı profil yenilənmələri və ani əlaqə paylaşımı.",
                "Digital profile hosting platform, live profile updates and instant contact sharing."
              )}
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
                {t("Məxfilik", "Privacy")}
              </a>
              <a href="#" className="transition-colors hover:text-white">
                {t("Şərtlər", "Terms")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

