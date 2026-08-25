"use client";

import { useState, useRef } from "react";
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
  Mail,
  Menu as MenuIcon,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  Star,
  Users,
  UtensilsCrossed,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { LanguageProvider, useLang } from "@/components/language-context";
import HeroNfcWidget from "@/components/hero-nfc-widget";

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
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);
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
      <section 
        ref={heroRef}
        onMouseMove={(e) => {
          if (!heroRef.current) return;
          const rect = heroRef.current.getBoundingClientRect();
          setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
        onMouseEnter={() => setIsHoveringHero(true)}
        onMouseLeave={() => setIsHoveringHero(false)}
        className="relative overflow-hidden border-b border-slate-200/70 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#eef6ff_100%)] px-4 py-16 sm:py-24 lg:min-h-[calc(100vh-5rem)] lg:flex lg:items-center sm:px-6 lg:px-8"
      >
        {/* Accent top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
        
        {/* Antigravity Interactive Spotlight Beam (Desktop only) */}
        <div 
          className="pointer-events-none absolute inset-0 hidden md:block transition-opacity duration-700 ease-out"
          style={{
            opacity: isHoveringHero ? 1 : 0,
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(41, 174, 238, 0.16), rgba(56, 189, 248, 0.06) 45%, transparent 75%)`,
          }}
        />

        {/* Antigravity Interactive Dot Matrix Light Grid (Desktop only) */}
        <div 
          className="pointer-events-none absolute inset-0 hidden md:block transition-opacity duration-500"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(14, 165, 233, 0.3) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            opacity: isHoveringHero ? 0.75 : 0,
            maskImage: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, black 15%, transparent 85%)`,
            WebkitMaskImage: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, black 15%, transparent 85%)`,
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Headline, Description & CTAs */}
            <div className="lg:col-span-7">
              <h1 className="text-balance text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-black leading-[1.04] tracking-tight text-slate-950">
                {t("Biznesiniz və Şəxsi Brendiniz üçün", "Digital NFC Platform for")}{" "}
                <span className="text-sky-500">
                  {t("Ağıllı Rəqəmsal Platforma", "Your Business & Brand")}
                </span>
              </h1>

              <p className="mt-6 sm:mt-8 max-w-2xl text-pretty text-lg sm:text-xl lg:text-2xl leading-relaxed text-slate-600 font-medium">
                {t(
                  "NFC və QR kod texnologiyası ilə fiziki dünyanı rəqəmsal imkanlara çevirin. Vizitkartlardan restoran menyularına, ani ödənişlərdən avtomobil təmas kartına qədər 4 əsas xidmət — hamısı tək toxunuşla.",
                  "Connect physical products to digital experiences via NFC & QR technology. From business cards to restaurant menus, instant payments to car stickers — 4 essential services with a single tap."
                )}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4">
                <Link
                  href="/vizitkart"
                  className="inline-flex items-center gap-2.5 rounded-full bg-sky-500 px-7 py-4 text-sm sm:text-base font-black uppercase tracking-wider text-white shadow-[0_12px_28px_rgba(41,174,238,0.38)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98]"
                >
                  {t("Vizitkartını Yarat", "Create Business Card")}
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/95 px-6 py-4 text-sm sm:text-base font-bold text-slate-800 shadow-sm backdrop-blur transition duration-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  {t("Xidmətlərlə Tanış Ol", "Explore Services")}
                </a>
              </div>
            </div>

            {/* Right Column: Interactive 3D Animated Hero NFC Hub */}
            <div className="flex items-center justify-center lg:col-span-5">
              <HeroNfcWidget />
            </div>
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
              {t("Zia NFC Platformasının 4 Əsas Həlli", "4 Core Solutions of Zia NFC Platform")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              {t(
                "İhtiyacınıza uyğun xidməti seçin və 1 toxunuşla istifadəyə başlayın.",
                "Choose the right digital NFC service for your business and launch in seconds."
              )}
            </p>
          </div>

          {/* 4 Main Service Quick Nav Cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group relative flex flex-col items-start rounded-3xl border border-slate-200/90 bg-white p-5 text-left shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition duration-200 hover:border-sky-300 hover:shadow-md active:scale-[0.98]"
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
                {t("Əlaqə & Sosial Şəbəkələr", "Contact & Social Media")}
              </p>
              <a
                href="https://wa.me/994702990252"
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-xs font-bold text-sky-400 hover:underline"
              >
                +994 70 299 02 52 (WhatsApp)
              </a>
              <a
                href="mailto:nfczia@gmail.com"
                className="mt-1 block text-xs font-bold text-sky-400 hover:underline"
              >
                nfczia@gmail.com (Gmail)
              </a>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://wa.me/994702990252"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-emerald-600 hover:text-white"
                >
                  <MessageCircle size={16} />
                </a>
                <a
                  href="mailto:nfczia@gmail.com"
                  aria-label="Gmail"
                  className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-sky-600 hover:text-white"
                >
                  <Mail size={16} />
                </a>
                <a
                  href="https://www.facebook.com/p/Zia-Nfc-61591544908069/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-blue-600 hover:text-white"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/zianfc.az"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-pink-600 hover:text-white"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@zianfc.az"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-sky-500 hover:text-white"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43V12a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2.04-.43v-3z"/>
                  </svg>
                </a>
                <a
                  href="https://www.threads.net/@zianfc.az"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Threads"
                  className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.001 2c-5.523 0-10 4.477-10 10s4.477 10 10 10c4.103 0 7.64-2.477 9.176-6.007a1 1 0 1 0-1.842-.777C17.973 18.064 15.19 20 12.001 20c-4.418 0-8-3.582-8-8s3.582-8 8-8c4.321 0 7.848 3.42 7.994 7.712-.047 3.32-2.181 5.378-4.805 5.378-1.574 0-2.858-.87-2.915-2.222.812-.455 1.761-1.127 2.296-2.036.621-1.055.679-2.293.167-3.396-.704-1.517-2.222-2.316-4.062-2.138-2.274.22-3.957 2.052-3.834 4.179.117 2.023 1.758 3.523 3.966 3.523.864 0 1.716-.232 2.47-.674.343.834 1.134 1.366 2.117 1.366 3.738 0 6.602-2.809 6.666-7.292C21.884 6.287 17.472 2 12.001 2zm-1.077 7.771c.974-.094 1.83.332 2.215 1.162.273.589.239 1.258-.094 1.824-.37.629-1.066 1.116-1.748 1.455-.991-.184-1.743-.918-1.796-1.834-.055-.947.669-1.737 1.423-1.807z"/>
                  </svg>
                </a>
              </div>
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
