"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Camera,
  Check,
  ChevronRight,
  Copy,
  Globe,
  Instagram,
  Layers3,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Zap
} from "lucide-react";
import Link from "next/link";
import NfcCardShowcase from "@/components/nfc-card-showcase";

const navItems = [
  ["Təcrübə", "#experience"],
  ["Özəlliklər", "#features"],
  ["Kartlar", "#cards"],
  ["Qiymətlər", "#pricing"],
  ["FAQ", "#faq"]
];

const features = [
  {
    icon: MessageCircle,
    title: "Sürətli əlaqə",
    text: "Bir mobil profildən WhatsApp, zənglər, e-poçt və sosial şəbəkələri asanlıqla açın."
  },
  {
    icon: Camera,
    title: "İlk növbədə portfolio",
    text: "Müştəriləri dağınıq linklərə yönləndirmədən xidmətlərinizi və işlərinizi nümayiş etdirin."
  },
  {
    icon: UserPlus,
    title: "Kontaktı yadda saxla",
    text: "Yüklənə bilən vCard sürətli görüşü daimi telefon kontaktına çevirir."
  },
  {
    icon: RefreshCw,
    title: "Canlı yenilənmələr",
    text: "Fiziki NFC kartı eyni qalmaqla linkləri, şəkilləri, qiymətləri və bioqrafiyanı dəyişin."
  },
  {
    icon: QrCode,
    title: "QR ehtiyat nüsxəsi",
    text: "Hər bir kart köhnə telefonlar və kamera vasitəsilə skan etmək üçün təmiz QR nüsxəsini ehtiva edir."
  },
  {
    icon: ShieldCheck,
    title: "Brend təhlükəsizliyi",
    text: "Profillər admin panelindən komandalar üçün aktivləşdirilə, söndürülə, redaktə edilə və paylaşıla bilər."
  }
];

const steps = [
  ["Kartı dizayn edin", "Brendinizə uyğun premium NFC kart dizaynını seçin."],
  ["Profili aktiv edin", "Əlaqə vasitələrini, sosial linkləri, qalereyanı, QR və vCard ixracını tənzimləyirik."],
  ["Paylaşmaq üçün toxundurun", "Müştərilər kartı toxundurur və ya QR-ı skan edərək sürətli mobil profilinizə daxil olurlar."],
  ["İstənilən vaxt yeniləyin", "Təklifiniz, kontentiniz və ya komandanız dəyişdikdə rəqəmsal profili yeniləyin."]
];

const plans = [
  {
    name: "Essential",
    price: "49 AZN",
    note: "Fərdi peşəkarlar üçün",
    items: ["1 rəqəmsal profil", "WhatsApp və sosial linklər", "QR ehtiyat nüsxəsi", "Standart NFC kartı"]
  },
  {
    name: "Premium",
    price: "89 AZN",
    note: "Ən çox tələb olunan",
    featured: true,
    items: ["Portfolio qalereyası", "Kontaktı yadda saxla (.vcf)", "Premium kart dizaynı", "Prioritet quraşdırma"]
  },
  {
    name: "Studio",
    price: "Özəl",
    note: "Komandalar və brendlər üçün",
    items: ["Çoxsaylı profillər", "Brendə uyğun profil sistemi", "Toplu kart istehsalı", "Prioritet yeniləmələr"]
  }
];

const metrics = [
  ["1 toxunuş", "profil ötürülməsi"],
  ["24/7", "redaktə edilə bilən kimlik"],
  ["0 tətbiq", "açmaq üçün tələb olunur"]
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative min-h-screen border-b border-slate-200/70 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#eef6ff_100%)] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
        <nav className="mx-auto flex max-w-5xl items-center justify-center gap-6 rounded-full border border-white/70 px-4 py-2 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <Link href="/" className="group flex items-center gap-3 rounded-full bg-slate-950 px-4 py-2 text-base font-black tracking-tight text-white shadow-lg shadow-slate-200/30 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-800">
            Zia NFC
          </Link>
          <div className="hidden items-center gap-4 rounded-full border border-slate-200/70 bg-slate-950/5 px-3 py-1.5 text-base font-semibold text-slate-700 md:flex">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="rounded-full px-5 py-2 text-base font-bold uppercase tracking-[0.14em] text-slate-900 transition duration-200 ease-out hover:bg-white hover:text-slate-950">
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 pb-8 pt-14 lg:min-h-[calc(100vh-104px)] lg:grid-cols-[1.02fr_0.98fr] lg:pt-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.58, ease: [0.23, 1, 0.32, 1] }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-cyan-50 px-3.5 py-2 text-sm font-bold text-cyan-800">
              <Sparkles size={16} /> Premium NFC kimlik platforması
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.96] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Bir Toxunuşla Sonsuz Əlaqələr
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
              Zia NFC fiziki smart kartı kontaktlar, sosial şəbəkələr və portfolionu bir araya gətirən zərif rəqəmsal profilə çevirir. QR ehtiyat nüsxəsi ilə hər zaman əlçatan olur.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-4 font-extrabold text-slate-950 shadow-[0_18px_45px_rgba(6,182,212,0.28)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-cyan-400 active:scale-[0.98]"
                >
                  Kart sifariş et <ArrowRight size={18} />
                </a>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {metrics.map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
                  <p className="text-2xl font-black tracking-tight text-slate-950">{value}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <HeroMockup />
        </div>
      </section>

      <section id="experience" className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Təcrübə</p>
              <h2 className="mt-4 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">Premium nəticə ilə sadə bir ritual.</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {steps.map(([title, text], index) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <div className="mb-8 text-sm font-black text-cyan-300">0{index + 1}</div>
                  <h3 className="text-lg font-black tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">Özəlliklər</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Müasir vizit kartın sahib olmalı olduğu hər şey tək bir sürətli profildə.
              </h2>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.42, delay: index * 0.035, ease: [0.23, 1, 0.32, 1] }}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition duration-200 ease-out hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_22px_70px_rgba(15,23,42,0.1)]"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-cyan-300 transition-transform duration-200 ease-out group-hover:scale-[1.03]">
                  <Icon size={24} />
                </div>
                <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.94fr_1.06fr]">
          <ProfileShowcase />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">Mobil öncəlikli</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Müştərinizin həqiqətən açdığı ekran üçün hazırlanmışdır.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              İlk ekran kim olduğunuzu, nə etdiyinizi və sizinlə necə əlaqə saxlayacağınızı aydınlaşdırır. Qalereya, sosial linklər, vCard və QR ehtiyat nüsxəsi qarışıqlıq yaratmadan əlçatandır.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Sürətli mobil profil", "Təmiz əlaqə düymələri", "Vizual portfolio", "Admin nəzarəti"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-700 shadow-sm">
                  <Check className="text-emerald-500" size={19} /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NfcCardShowcase />

      <section id="pricing" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">Qiymətlər</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Rəqəmsal kimliyinizi başlatmaq üçün aydın paketlər.</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-7 shadow-[0_16px_50px_rgba(15,23,42,0.07)] ${
                  plan.featured ? "border-cyan-300 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-950"
                }`}
              >
                {plan.featured ? (
                  <div className="absolute right-5 top-5 rounded-full bg-cyan-300 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-950">
                    Populyar
                  </div>
                ) : null}
                <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                <p className={`mt-2 text-sm font-bold ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>{plan.note}</p>
                <p className={`mt-6 text-4xl font-black tracking-tight ${plan.featured ? "text-cyan-300" : "text-slate-950"}`}>{plan.price}</p>
                <div className="mt-7 space-y-3">
                  {plan.items.map((item) => (
                    <div key={item} className={`flex items-center gap-3 text-sm font-semibold ${plan.featured ? "text-slate-200" : "text-slate-700"}`}>
                      <BadgeCheck size={18} className={plan.featured ? "text-cyan-300" : "text-emerald-500"} /> {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">FAQ</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">Tez-tez verilən suallar.</h2>
          </div>
          <div className="space-y-3">
            {[
              ["Kartı dəyişmədən profili yeniləyə bilərəm?", "Bəli. NFC kart eyni profil URL-ni açır, profil məzmunu isə istənilən vaxt redaktə edilə bilər."],
              ["Hər profildə QR kod olur?", "Bəli. Profil üçün QR ehtiyat nüsxəsi yaradılır ki, NFC işləmədikdə müştərilər skan edə bilsinlər."],
              ["İstifadəçilər əlaqə məlumatlarımı yadda saxlaya bilərmi?", "Bəli. Profil vCard dəstəkləyir, beləcə müştərilər əlaqə məlumatlarınızı telefonlarına əlavə edə bilərlər."]
            ].map(([q, a]) => (
              <details key={q} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition-colors duration-200 ease-out open:bg-white/[0.07]">
                <summary className="cursor-pointer list-none font-black tracking-tight">
                  <span className="flex items-center justify-between gap-4">
                    {q}
                    <ChevronRight className="shrink-0 transition-transform duration-200 ease-out group-open:rotate-90" size={18} />
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
            <div className="flex items-center gap-3 text-base font-black uppercase tracking-[0.24em] text-cyan-300">
              <span className="grid size-9 place-items-center rounded-full bg-white text-slate-950">Z</span>
              Zia NFC
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Rəqəmsal biznes kartlar, canlı profil yenilənmələri və NFC tək toxunuşda əlaqə paylaşımı.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <a
              href="https://wa.me/994702990252"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition duration-200 ease-out hover:bg-cyan-400"
              aria-label="WhatsApp"
            >
              WhatsApp ilə əlaqə <MessageCircle size={16} />
            </a>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>© {new Date().getFullYear()} Zia NFC</span>
              <a href="#" className="transition-colors hover:text-white">Məxfilik</a>
              <a href="#" className="transition-colors hover:text-white">Şərtlər</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(18px) scale(0.98)" }}
      animate={{ opacity: 1, transform: "translateY(0) scale(1)" }}
      transition={{ duration: 0.66, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
      className="relative mx-auto h-[650px] w-full max-w-[590px]"
    >
      <div className="absolute left-2 top-8 hidden rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm backdrop-blur md:flex">
        <Zap className="mr-2 text-cyan-500" size={16} /> Kart toxunduruldu
      </div>
      <motion.div
        animate={{ transform: ["translateY(0) rotate(-7deg)", "translateY(-10px) rotate(-5deg)", "translateY(0) rotate(-7deg)"] }}
        transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
        className="absolute left-0 top-28 h-60 w-[390px] rounded-[1.65rem] border border-white/10 bg-slate-950 p-7 text-white shadow-[0_35px_100px_rgba(15,23,42,0.25)]"
      >
        <div className="absolute inset-0 rounded-[1.65rem] bg-[linear-gradient(135deg,rgba(34,211,238,0.24),transparent_38%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_38%,transparent_56%)]" />
        <div className="relative flex items-start justify-between">
          <div className="grid size-12 place-items-center rounded-full bg-cyan-300 text-lg font-black text-slate-950">Z</div>
          <Copy className="text-white/55" />
        </div>
        <div className="relative mt-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200/80">NFC Kimlik Kartı</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">Ziya Safaraliyev</h3>
        </div>
      </motion.div>

      <motion.div
        animate={{ opacity: [0.18, 0.6, 0.18], transform: ["scale(0.94)", "scale(1.08)", "scale(0.94)"] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        className="absolute left-[48%] top-[34%] h-28 w-28 rounded-full border border-cyan-300/70"
      />

      <div className="absolute bottom-0 right-2 h-[575px] w-[292px] rounded-[2.4rem] border-[8px] border-slate-950 bg-slate-950 shadow-[0_40px_110px_rgba(15,23,42,0.28)]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.85rem] bg-white flex flex-col">
          {/* Notch */}
          <div className="absolute left-1/2 top-2.5 z-20 h-4.5 w-20 -translate-x-1/2 rounded-full bg-slate-950" />
          <PhoneProfile compact />
        </div>
      </div>

      <div className="absolute bottom-16 left-2 hidden w-56 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_70px_rgba(15,23,42,0.13)] md:block">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-950">Profil yeniləndi</p>
            <p className="text-xs font-semibold text-slate-500">Kart aktiv qalır</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -right-3 top-12 hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.1)] sm:block">
        <QrCode className="text-slate-950" size={70} strokeWidth={1.5} />
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_90px_rgba(15,23,42,0.1)]">
        <PhoneProfile />
      </div>
    </div>
  );
}

function PhoneProfile({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${compact ? "" : "p-1"} rounded-[1.5rem] bg-white`}>
      <div className={`rounded-[1.35rem] bg-[linear-gradient(135deg,#0f172a,#0e7490)] px-5 ${compact ? "pb-12 pt-4" : "pb-20 pt-6"} text-white`}>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Canlı</div>
          <Layers3 size={compact ? 16 : 20} className="text-white/70" />
        </div>
        <div className={`flex items-end ${compact ? "mt-6 gap-3" : "mt-12 gap-4"}`}>
          <div className={`grid ${compact ? "size-14 text-2xl rounded-2xl" : "size-20 text-3xl rounded-3xl"} place-items-center bg-cyan-300 font-black text-slate-950 shadow-lg`}>
            Z
          </div>
          <div>
            <p className={`${compact ? "text-xs" : "text-sm"} font-bold text-cyan-100`}>Premium bərbər</p>
            <h3 className={`${compact ? "text-lg" : "text-2xl"} font-black tracking-tight`}>Ziya Safaraliyev</h3>
          </div>
        </div>
      </div>
      <div className={`${compact ? "-mt-8 p-4" : "-mt-12 p-5"} rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.12)]`}>
        <p className={`${compact ? "text-xs leading-5" : "text-sm leading-6"} text-slate-600`}>Bakıda dəqiq kəsimlər, saqqal dizaynı və fərdi qulluq.</p>
        <div className={`grid grid-cols-2 ${compact ? "mt-4 gap-1.5" : "mt-5 gap-2"}`}>
          <button className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-950 ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} font-black text-white transition duration-150 ease-out active:scale-[0.98]`}>
            <Phone size={compact ? 12 : 16} /> Zəng et
          </button>
          <button className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} font-black text-white transition duration-150 ease-out active:scale-[0.98]`}>
            <MessageCircle size={compact ? 12 : 16} /> Çat
          </button>
        </div>
        <div className={`grid grid-cols-3 ${compact ? "mt-3 gap-1.5" : "mt-4 gap-2"}`}>
          {[Globe, Instagram, UserPlus].map((Icon, index) => (
            <div key={index} className={`grid ${compact ? "h-11 rounded-xl" : "h-16 rounded-2xl"} place-items-center bg-slate-100 text-slate-700`}>
              <Icon size={compact ? 16 : 22} />
            </div>
          ))}
        </div>

  
      </div>
    </div>
  );
}
