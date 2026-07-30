"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChefHat,
  ClipboardList,
  ExternalLink,
  Globe,
  Layers,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  UtensilsCrossed,
  Wifi,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: UtensilsCrossed,
    color: "bg-sky-50 text-sky-600",
    hoverBorder: "hover:border-sky-200",
    title: "Rəqəmsal Menyu",
    desc: "Kateqoriyalar, qiymətlər, şəkillər və təsvirlər ilə tam rəqəmsal menyu. Kağız menyuya ehtiyac qalmır.",
  },
  {
    icon: QrCode,
    color: "bg-sky-50 text-sky-600",
    hoverBorder: "hover:border-sky-200",
    title: "QR Kod & NFC Dəstəyi",
    desc: "Hər masaya QR kod və ya NFC stiker yerləşdirin. Müştəri telefonu yaxınlaşdırır — menyu açılır.",
  },
  {
    icon: Layers,
    color: "bg-purple-50 text-purple-600",
    hoverBorder: "hover:border-purple-200",
    title: "Kateqoriya Sistemi",
    desc: "Əsas yeməklər, içkilər, desertlər — hər kateqoriya ayrıca. 30-a qədər kateqoriya, hər birində 80 məhsul.",
  },
  {
    icon: Smartphone,
    color: "bg-emerald-50 text-emerald-600",
    hoverBorder: "hover:border-emerald-200",
    title: "Mobil Uyğunluq",
    desc: "İstənilən telefonda mükəmməl görünür. Tezliklə yüklənir, heç bir app yükləmə tələb olunmur.",
  },
  {
    icon: Globe,
    color: "bg-amber-50 text-amber-600",
    hoverBorder: "hover:border-amber-200",
    title: "Canlı Yeniləmə",
    desc: "Qiymət dəyişikliyi? Yeni yemək? Admin panelindən dəyişin — dərhal menyuda görünsün.",
  },
  {
    icon: Star,
    color: "bg-pink-50 text-pink-600",
    hoverBorder: "hover:border-pink-200",
    title: "Müştəri Reyting Sistemi",
    desc: "Müştərilər restoranınızı qiymətləndirə bilər. Reyting və rəylər birbaşa profildə göstərilir.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Qeydiyyat",
    desc: "Admin panelindən restoranınızı əlavə edin. Ad, logo, cover şəkli, əlaqə məlumatları daxil edin.",
  },
  {
    step: "02",
    title: "Menyu Yaradın",
    desc: "Kateqoriyalar yaradın, yeməkləri əlavə edin — ad, qiymət, təsvir, şəkil. Hər şey vizual redaktorda.",
  },
  {
    step: "03",
    title: "QR / NFC Yerləşdirin",
    desc: "Avtomatik yaradılan QR kodu çap edin və ya NFC stiker sifariş edin. Hər masaya yerləşdirin.",
  },
  {
    step: "04",
    title: "Müştəri İstifadə Etsin",
    desc: "Müştəri telefonu yaxınlaşdırır — menyu açılır. Kateqoriyalara baxır, seçir, sifariş edir.",
  },
];

export default function ZiaMenuPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50 active:scale-95"
              title="Əsas səhifəyə qayıt"
            >
              <ArrowLeft size={18} />
            </Link>
            <Link href="/menu" className="flex items-center gap-2.5">
              <Image
                src="/logo.webp"
                alt="Zia NFC"
                width={36}
                height={36}
                className="size-9 rounded-full object-cover ring-2 ring-sky-500/20"
              />
              <span className="text-lg font-black tracking-tight text-slate-950">
                Zia <span className="text-sky-500">Menu</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/restoran"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700 shadow-sm transition duration-200 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <ShieldCheck size={16} className="text-sky-500" /> Zia Menu Admin
            </Link>
            <a
              href="https://wa.me/994702990252?text=Salam,%20Zia%20Menu%20restoran%20menyusu%20sifarish%20etmek%20isteyirem"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white shadow-[0_12px_30px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <MessageCircle size={16} /> Əlaqə
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#eef6ff_100%)] px-4 pb-16 pt-16 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-4 py-2 text-xs font-extrabold text-sky-800">
            <Sparkles size={16} className="text-sky-500" /> Zia Menu — Rəqəmsal Restoran Menyusu
          </div>

          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Restoranınız üçün{" "}
            <span className="text-sky-500">Rəqəmsal Menyu</span> Həlli
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-600 sm:text-lg">
            Kağız menyuya son verin. NFC və ya QR kod ilə müştəriləriniz
            telefondan menyuya baxsın, kateqoriyaları görsün, qiymətləri
            öyrənsin — hamısı 1 saniyədə.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/994702990252?text=Salam,%20Zia%20Menu%20restoran%20menyusu%20sifarish%20etmek%20isteyirem"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
            >
              Əlaqə saxla <ArrowRight size={18} />
            </a>
            <Link
              href="/restoran"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-extrabold text-slate-800 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <ShieldCheck size={16} className="text-sky-500" /> Admin Paneli
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3">
            {[
              ["∞", "Limitsiz Yemək"],
              ["30+", "Kateqoriya"],
              ["1 san", "Menyu Yüklənmə"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
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
      </section>

      {/* Demo Phone Mockup — Canlı Nümunə (Moved before Features) */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-center">
            {/* Benefits */}
            <div className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                  Canlı Nümunə
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Müştəri Nə Görür?
                </h2>
                <p className="mt-3 text-base text-slate-600">
                  QR kodu oxudan və ya NFC stikerə telefonu yaxınlaşdıran müştəri
                  dərhal menyunuzu görür.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Kateqoriyalar arasında rahat naviqasiya",
                  "Hər yeməyin şəkli, qiyməti və təsviri",
                  "Mobil-uyğun dizayn, tez yüklənmə",
                  "Heç bir app yükləmə tələb olunmur",
                  "Onlayn sifariş imkanı",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
                  >
                    <BadgeCheck
                      size={18}
                      className="shrink-0 text-sky-500"
                    />
                    <span className="text-sm font-bold text-slate-800">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="mx-auto w-full max-w-[380px]">
              <div className="relative overflow-hidden rounded-[2.5rem] border-[8px] border-slate-900 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                {/* Top Phone Speaker Notch */}
                <div className="absolute top-0 inset-x-0 z-30 flex justify-center pt-2">
                  <div className="h-4 w-28 rounded-full bg-slate-950" />
                </div>

                {/* Restaurant Demo */}
                <div className="min-h-[610px] bg-slate-50 text-slate-900 font-sans pb-8">
                  {/* Cover */}
                  <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                    <img
                      src="/ziana-cover.webp"
                      alt="Ziana Cover"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="px-5 relative z-10 -mt-10 flex items-end justify-between">
                    <div>
                      <p className="text-xl font-black text-slate-950">
                        Ziana
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        Bakı · Restoran & Lounge
                      </p>
                    </div>
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
                      <img
                        src="/ziana-logo.webp"
                        alt="Ziana Logo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="px-5 mt-4">
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      {["Yeməklər", "Salatlar", "İçkilər", "Desertlər"].map(
                        (cat, i) => (
                          <span
                            key={cat}
                            className={`rounded-full px-2 py-1.5 text-[10px] font-bold transition truncate ${
                              i === 0
                                ? "bg-sky-500 text-white shadow-sm"
                                : "bg-white border border-slate-200 text-slate-600"
                            }`}
                          >
                            {cat}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="px-5 mt-4 space-y-2.5">
                    {[
                      {
                        name: "Qutab (ət)",
                        price: "4.50 ₼",
                        desc: "Nazik xəmirdə ət ilə",
                      },
                      {
                        name: "Plov",
                        price: "8.00 ₼",
                        desc: "Şəhriyyə ilə klassik plov",
                      },
                      {
                        name: "Dolma",
                        price: "7.00 ₼",
                        desc: "Üzüm yarpağında dolma",
                      },
                      {
                        name: "Lülə Kabab",
                        price: "9.50 ₼",
                        desc: "Odda bişmiş əl lüləsi",
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {item.desc}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-xl bg-sky-50 border border-sky-200 px-3 py-1 text-sm font-black text-sky-700">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-5 mt-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Powered by{" "}
                      <span className="text-slate-900 font-black">
                        Zia NFC
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200/80 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              Xüsusiyyətlər
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Niyə Zia Menu?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
              Kafe və restoranlar üçün hazırlanmış tam rəqəmsal menyu sistemi.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition duration-200 ease-out hover:-translate-y-0.5 ${f.hoverBorder}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-11 place-items-center rounded-2xl ${f.color}`}
                  >
                    <f.icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">
                    {f.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-slate-200/80 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              Necə İşləyir
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              4 Sadə Addım
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-200"
              >
                <span className="text-4xl font-black text-sky-500/20 group-hover:text-sky-500/40 transition">
                  {item.step}
                </span>
                <h3 className="mt-2 text-lg font-black text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200/80 bg-white px-4 py-16 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Restoranınızı Rəqəmsallaşdırın
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Zia Menu ilə kağız menyulara son verin. NFC stiker və QR kod ilə
            müştəriləriniz 1 saniyədə menyunuzu görsün. Admin panelindən
            istədiyiniz vaxt yeniləyin.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/994702990252?text=Salam,%20Zia%20Menu%20restoran%20menyusu%20sifarish%20etmek%20isteyirem"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 active:scale-95"
            >
              WhatsApp ilə Əlaqə <ArrowRight size={18} />
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-extrabold text-slate-800 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              Əsas Səhifə
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-center text-xs font-semibold text-slate-500">
        <p>
          © {new Date().getFullYear()} Zia NFC & Zia Menu. Bütün hüquqlar
          qorunur.
        </p>
      </footer>
    </main>
  );
}
