"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Car,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Globe,
  Layers,
  Menu as MenuIcon,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { LanguageProvider, useLang } from "@/components/language-context";

export default function MainPlatformPage() {
  return (
    <LanguageProvider>
      <MainPlatformInner />
    </LanguageProvider>
  );
}

function MainPlatformInner() {
  const { lang, setLang, t } = useLang();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const year = new Date().getFullYear();

  const services = [
    {
      id: "vizitkart",
      name: "Zia Vizitkart",
      badge: t("Rəqəmsal Profil", "Digital Profile"),
      title: t("Ağıllı NFC Vizit Kartları & Şəxsi Profil", "Smart NFC Business Cards & Digital Profile"),
      desc: t(
        "Fərdlər və şirkətlər üçün premium NFC vizit kart. Bir toxunuşla əlaqələrinizi, sosial şəbəkələrinizi, portfolionuzu və vCard məlumatlarınızı dərhal telefon ekranında göstərin.",
        "Premium NFC business cards for individuals and companies. Share your contacts, social networks, portfolio, and vCard instantly on screen with a single tap."
      ),
      icon: CreditCard,
      color: "bg-sky-500 text-white",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      href: "/vizitkart",
      adminHref: "/admin",
      adminText: "Admin",
      features: [
        t("1-Toxunuşla vCard Kontakt İxracı", "1-Tap vCard Contact Export"),
        t("Qalereya & Vizual Portfolio", "Gallery & Visual Portfolio"),
        t("24/7 Admin Panelindən Canlı Redaktə", "24/7 Live Editing via Admin Panel"),
        t("Arxa Tərəfdə Lazer QR Kod Dəstəyi", "Laser QR Code Support on Back"),
      ],
      image: "/2f3919bd-3f33-4efe-bb1b-b8757f487d33.png",
    },
    {
      id: "menu",
      name: "Zia Menu",
      badge: t("Restoran Menyusu", "Restaurant Menu"),
      title: t("Restoran & Kafe üçün Rəqəmsal QR/NFC Menyu", "Digital QR/NFC Menu for Restaurants & Cafes"),
      desc: t(
        "Kağız menyu xərclərinə son verin. Müştəriləriniz masadakı QR kod və ya NFC stikerə toxunaraq menyunu 1 saniyədə açır, kateqoriyalara baxır və sifariş verir.",
        "End paper menu expenses. Customers tap or scan the table QR/NFC sticker to view categories, photos, and prices in 1 second."
      ),
      icon: UtensilsCrossed,
      color: "bg-sky-500 text-white",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      href: "/menu",
      adminHref: "/restoran",
      adminText: "Restoran Admin",
      features: [
        t("Kateqoriyalı Menyu & Məhsul Fotoları", "Categorized Menu & Product Photos"),
        t("Qiymətlərin Anında Yenilənməsi", "Instant Price & Item Updates"),
        t("Tətbiqsiz Sürətli Brauzer Açılışı", "Fast No-App Browser Opening"),
        t("Müştəri Reyting & Rəy Sistemi", "Customer Rating & Review System"),
      ],
      image: "/masa-standi.webp",
    },
    {
      id: "pay",
      name: "Zia Pay",
      badge: t("NFC Ödəniş", "NFC Payment"),
      title: t("Sürətli NFC Ödəniş & Bəxşiş (Tip) Sistemi", "Fast NFC Payment & Digital Tip System"),
      desc: t(
        "Restoranlar, kafeler və xidmət sektoru üçün super sürətli NFC ödəniş və rəqəmsal bəxşiş platforması. Kassada növbə gözləmədən ödəniş edin.",
        "Super fast NFC payment and digital tipping platform for restaurants, cafes, and services. Settle bills without standing in line."
      ),
      icon: Wallet,
      color: "bg-sky-500 text-white",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      href: "/pay",
      adminHref: "/pay/demo/skan",
      adminText: t("Sınaq Demosu", "Test Demo"),
      features: [
        t("1-Toxunuşla Sürətli NFC / QR Ödəniş", "1-Tap Fast NFC / QR Payment"),
        t("Ofisiant Bəxşiş (Tip) İnteqrasiyası", "Waiter Tip & Service Integration"),
        t("Rəqəmsal Qəbz & Sifariş İzləmə", "Digital Receipt & Order Tracking"),
        t("Təhlükəsiz Bank İnteqrasiyası", "Secure Payment Gateway Integration"),
      ],
      image: "/stiker.webp",
    },
    {
      id: "car",
      name: "Zia Car",
      badge: t("Avto NFC Stiker", "Auto NFC Sticker"),
      title: t("Avtomobil üçün NFC & QR Ağıllı Stiker", "Windshield NFC & QR Smart Auto Card"),
      desc: t(
        "Ön şüşədəki NFC stiker və ya QR kod vasitəsilə parkinq zamanı nömrənizə 1 saniyədə zəng edilsin, WhatsApp-da yazılsın və ya ünvan paylaşılsın.",
        "Windshield NFC sticker or QR code allows callers to reach your phone number via WhatsApp or call in 1 second during parking."
      ),
      icon: Car,
      color: "bg-sky-500 text-white",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      href: "/car",
      adminHref: "/car/admin",
      adminText: "Car Admin",
      features: [
        t("Bir Toxunuşla Zəng və WhatsApp Çatı", "1-Tap Direct Call & WhatsApp Chat"),
        t("İki Əlaqə Nömrəsi Dəstəyi", "Two Phone Numbers Support"),
        t("Waze Naviqasiya & Sosial Linklər", "Waze Navigation & Social Links"),
        t("Hava Şəraitinə Dözümlü Avto Stiker", "Weatherproof Premium Car Sticker"),
      ],
      image: "/ziya.webp",
    },
  ];

  const highlights = [
    {
      icon: Smartphone,
      title: t("0 Tətbiq Tələbi", "0 Apps Required"),
      desc: t("İOS və Android cihazlarında heç bir tətbiq yükləmədən birbaşa brauzerdə açılır.", "Opens directly in the browser on iOS and Android without installing any app."),
    },
    {
      icon: Zap,
      title: t("1 Toxunuş Sürəti", "1 Tap Speed"),
      desc: t("NFC çipini yaxınlaşdırın və ya QR kodu skan edin — məlumatlar 1 saniyədə hazırdır.", "Tap the NFC chip or scan the QR code — information is ready in 1 second."),
    },
    {
      icon: ShieldCheck,
      title: t("24/7 Canlı İdarəetmə", "24/7 Live Management"),
      desc: t("Admin panelindən linklərinizi, menyunuzu və ya əlaqə məlumatlarınızı istənilən an yeniləyin.", "Update your links, menu, or contact details anytime from the admin panel."),
    },
    {
      icon: Layers,
      title: t("4 Xidmət — 1 Ekosistem", "4 Services — 1 Ecosystem"),
      desc: t("Vizitkart, menyu, ödəniş və avto təmas kartı vahid Zia NFC platformasında.", "Business card, menu, payment, and auto contact card in one unified Zia NFC platform."),
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-950 selection:bg-sky-500 selection:text-white">
      {/* Header / Floating Pill Navbar matching LandingNavbar */}
      <div className="sticky top-4 z-50 px-3 sm:px-6 lg:px-8">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 rounded-full border border-white/70 bg-white/95 px-3 py-2 shadow-md sm:px-5 md:bg-white/70 md:shadow-[0_18px_60px_rgba(15,23,42,0.12)] md:backdrop-blur-xl">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2 text-lg font-black tracking-tight text-slate-950 transition duration-200 ease-out hover:-translate-y-0.5 sm:text-xl"
          >
            <Image
              src="/logo.webp"
              alt="Zia NFC"
              width={40}
              height={40}
              priority
              className="size-9 rounded-full object-cover sm:size-10"
            />
            <span className="text-base font-black sm:text-lg">
              Zia <span className="text-sky-500">NFC</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-0.5 rounded-full border border-slate-200/70 bg-slate-950/5 p-1 text-xs font-semibold text-slate-700 md:flex">
            <Link
              href="/vizitkart"
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-tight text-slate-900 transition duration-200 ease-out hover:bg-white hover:text-sky-600"
            >
              Zia Vizitkart
            </Link>
            <Link
              href="/menu"
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-tight text-slate-900 transition duration-200 ease-out hover:bg-white hover:text-sky-600"
            >
              Zia Menu
            </Link>
            <Link
              href="/pay"
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-tight text-slate-900 transition duration-200 ease-out hover:bg-white hover:text-sky-600"
            >
              Zia Pay
            </Link>
            <Link
              href="/car"
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-tight text-slate-900 transition duration-200 ease-out hover:bg-white hover:text-sky-600"
            >
              Zia Car
            </Link>
          </div>

          {/* Right Header Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Lang switcher */}
            <div className="hidden md:block">
              <div className="flex shrink-0 items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-[11px] font-black uppercase tracking-wider shadow-sm">
                <button
                  type="button"
                  onClick={() => setLang("az")}
                  className={`px-2.5 py-1 transition-all duration-200 ease-out ${
                    lang === "az" ? "bg-sky-500 text-white shadow-inner" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  AZ
                </button>
                <span className="h-3.5 w-px bg-slate-300" />
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1 transition-all duration-200 ease-out ${
                    lang === "en" ? "bg-sky-500 text-white shadow-inner" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Menyunu bağla" : "Menyu"}
              className="flex size-9 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-100 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>

            <Link
              href="/admin"
              className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-sky-500 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98] sm:px-4 sm:py-2 sm:text-xs"
            >
              Admin
            </Link>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-slate-200/70 bg-white p-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-1">
              <Link
                href="/vizitkart"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-50"
              >
                Zia Vizitkart
              </Link>
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-50"
              >
                Zia Menu
              </Link>
              <Link
                href="/pay"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-50"
              >
                Zia Pay
              </Link>
              <Link
                href="/car"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-50"
              >
                Zia Car
              </Link>
            </div>

            {/* Language switcher inside mobile menu */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Language
              </span>
              <div className="flex shrink-0 items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-[11px] font-black uppercase tracking-wider shadow-sm">
                <button
                  type="button"
                  onClick={() => setLang("az")}
                  className={`px-2.5 py-1 transition-all ${
                    lang === "az" ? "bg-sky-500 text-white shadow-inner" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  AZ
                </button>
                <span className="h-3.5 w-px bg-slate-300" />
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1 transition-all ${
                    lang === "en" ? "bg-sky-500 text-white shadow-inner" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#eef6ff_100%)] px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        {/* Accent top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl text-center">
          {/* Platform Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50 px-4 py-2 text-xs font-extrabold text-sky-800 shadow-sm sm:text-sm">
            <Sparkles size={16} className="text-sky-500" />
            <span>
              {t("Zia NFC — Bütün Rəqəmsal NFC & QR Xidmətləri Bir Yerdə", "Zia NFC — All Digital NFC & QR Services In One Place")}
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            {t("Biznesiniz və Şəxsi Brendiniz üçün", "Digital NFC Platform for")}{" "}
            <span className="text-sky-500">
              {t("Ağıllı Rəqəmsal Platforma", "Your Business & Brand")}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-8 text-slate-600 sm:text-xl">
            {t(
              "NFC və QR kod texnologiyası ilə fiziki dünyanı rəqəmsal imkanlara çevirin. Vizitkartlardan restoran menyularına, ani ödənişlərdən avtomobil təmas kartına qədər 4 əsas xidmət — hamısı tək toxunuşla.",
              "Connect physical products to digital experiences via NFC & QR technology. From business cards to restaurant menus, instant payments to car stickers — 4 essential services with a single tap."
            )}
          </p>

          {/* 4 Main Service Quick Nav Buttons */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group relative flex flex-col items-start rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition duration-200 hover:border-sky-300 hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className={`grid size-12 place-items-center rounded-2xl ${item.color} shadow-md`}>
                      <IconComp size={24} />
                    </div>
                    <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors duration-200 group-hover:bg-sky-500 group-hover:text-white">
                      <ArrowRight size={16} />
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-black text-slate-950">{item.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{item.badge}</p>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-sky-600 group-hover:underline">
                    {t("Səhifəyə keçid", "Explore Page")} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main 4 Services Detailed Showcase */}
      <section id="services" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-600">
              {t("Xidmətlərimiz", "Our Ecosystem")}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {t("Zia NFC Ekosisteminin 4 Əsas Həlli", "4 Core Solutions of Zia NFC Ecosystem")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              {t(
                "İhtiyacınıza uyğun xidməti seçin və 1 toxunuşla istifadəyə başlayın.",
                "Choose the right digital NFC service for your business and launch in seconds."
              )}
            </p>
          </div>

          <div className="mt-16 space-y-12">
            {services.map((service, idx) => {
              const IconComp = service.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={service.id}
                  className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:border-sky-300 hover:shadow-[0_24px_70px_rgba(14,165,233,0.12)] sm:p-10`}
                >
                  <div className={`grid gap-8 lg:grid-cols-12 lg:items-center`}>
                    {/* Left Info Column */}
                    <div className={`lg:col-span-7 ${isEven ? "" : "lg:order-2"}`}>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${service.badgeColor}`}>
                          <IconComp size={14} /> {service.badge}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          ZIA NFC Platform
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
                        {service.title}
                      </h3>

                      <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                        {service.desc}
                      </p>

                      {/* Feature Bullet Points */}
                      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                        {service.features.map((feat) => (
                          <div key={feat} className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                            <CheckCircle2 size={18} className="shrink-0 text-sky-500" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                          href={service.href}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_14px_35px_rgba(14,165,233,0.28)] transition hover:-translate-y-0.5 hover:bg-sky-400 active:scale-95"
                        >
                          {service.name} {t("Səhifəsinə Keçid", "Page")} <ArrowRight size={16} />
                        </Link>
                        <Link
                          href={service.adminHref}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-extrabold uppercase tracking-wider text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 active:scale-95"
                        >
                          <ShieldCheck size={16} className="text-sky-500" /> {service.adminText}
                        </Link>
                      </div>
                    </div>

                    {/* Right Visual Card */}
                    <div className={`lg:col-span-5 ${isEven ? "" : "lg:order-1"}`}>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-sky-50/50 p-6 flex flex-col justify-between border border-slate-200/60 shadow-inner">
                        <div className="flex items-center justify-between">
                          <div className={`grid size-12 place-items-center rounded-2xl ${service.color} shadow-lg`}>
                            <IconComp size={24} />
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm">
                            {service.name}
                          </span>
                        </div>

                        <div className="mt-8">
                          <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                            {t("NFC & QR İnteqrasiyası", "NFC & QR Integration")}
                          </p>
                          <p className="mt-1 text-lg font-black text-slate-900">
                            {service.name} — {t("Tək Toxunuşla İdarəetmə", "One-Tap Management")}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4">
                          <span className="text-xs font-extrabold text-slate-500">
                            {t("Status: Aktiv & Hazır", "Status: Active & Ready")}
                          </span>
                          <Link
                            href={service.href}
                            className="inline-flex items-center gap-1 text-xs font-black text-sky-600 hover:underline"
                          >
                            {t("Ətraflı Bax", "View Details")} <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Zia NFC Platform */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-600">
              {t("Niyə Zia NFC?", "Why Zia NFC?")}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {t("Biznesinizi Gələcəyə Daşıyan Üstünlüklər", "Advantages That Take Your Business Forward")}
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                >
                  <div className="grid size-12 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                    <IconComp size={24} />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA WhatsApp Banner */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            {t("Biznesinizi Rəqəmsal NFC Əsrə Keçirin", "Digitize Your Business with NFC")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {t(
              "Zia Vizitkart, Zia Menu, Zia Pay və ya Zia Car sifariş etmək üçün bizimlə dərhal əlaqə saxlayın.",
              "Contact us directly to order Zia Vizitkart, Zia Menu, Zia Pay, or Zia Car."
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/994702990252?text=Salam,%20Zia%20NFC%20xidmetleri%20haqqinda%20melumat%20almaq%20isteyirem"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.3)] transition hover:-translate-y-0.5 hover:bg-sky-400 active:scale-95"
            >
              <MessageCircle size={20} /> {t("WhatsApp ilə Əlaqə", "Contact via WhatsApp")}
            </a>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-8 py-4 text-base font-extrabold text-white shadow-sm transition hover:border-slate-700 hover:bg-slate-800 active:scale-95"
            >
              <ShieldCheck size={18} className="text-sky-400" /> {t("Admin Paneli", "Admin Panel")}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand Col */}
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/logo.webp"
                  alt="Zia NFC"
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover ring-2 ring-sky-500/20"
                />
                <span className="text-lg font-black text-white">
                  Zia <span className="text-sky-500">NFC</span>
                </span>
              </Link>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {t(
                  "Azərbaycanda premium NFC vizit kartları, rəqəmsal menyular, ödəniş və avto stiker platforması.",
                  "Premium NFC business cards, digital menus, payments and auto stickers platform in Azerbaijan."
                )}
              </p>
            </div>

            {/* Platform Services Links */}
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white">
                {t("Xidmətlər", "Services")}
              </p>
              <ul className="mt-3 space-y-2 text-xs font-semibold">
                <li>
                  <Link href="/vizitkart" className="hover:text-sky-400 transition">
                    Zia Vizitkart
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-sky-400 transition">
                    Zia Menu
                  </Link>
                </li>
                <li>
                  <Link href="/pay" className="hover:text-sky-400 transition">
                    Zia Pay
                  </Link>
                </li>
                <li>
                  <Link href="/car" className="hover:text-sky-400 transition">
                    Zia Car
                  </Link>
                </li>
              </ul>
            </div>

            {/* Admin Links */}
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white">
                {t("Admin Panellər", "Admin Panels")}
              </p>
              <ul className="mt-3 space-y-2 text-xs font-semibold">
                <li>
                  <Link href="/admin" className="hover:text-sky-400 transition">
                    Vizitkart Admin
                  </Link>
                </li>
                <li>
                  <Link href="/restoran" className="hover:text-sky-400 transition">
                    Zia Menu Admin
                  </Link>
                </li>
                <li>
                  <Link href="/car/admin" className="hover:text-sky-400 transition">
                    Zia Car Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Col */}
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white">
                {t("Əlaqə", "Contact")}
              </p>
              <p className="mt-3 text-xs font-semibold text-slate-400">
                Bakı, Azərbaycan
              </p>
              <a
                href="https://wa.me/994702990252"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs font-bold text-sky-400 hover:underline"
              >
                +994 70 299 02 52 (WhatsApp)
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>© {year} Zia NFC. {t("Bütün hüquqlar qorunur.", "All rights reserved.")}</p>
            <p className="mt-2 sm:mt-0">{t("Rəqəmsal NFC & QR Platforması", "Digital NFC & QR Platform")}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
