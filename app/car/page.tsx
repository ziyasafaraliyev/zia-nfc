"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LangSwitcher, useLang } from "@/components/language-context";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  ExternalLink,
  Instagram,
  MessageCircle,
  Music2,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Zap,
} from "lucide-react";

type DemoState = {
  carName: string;
  plate: string;
  driverName: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  telegram: string;
  waze: string;
  coverUrl: string;
  avatarUrl: string;
};

const INITIAL_DEMO: DemoState = {
  carName: "Mercedes-Benz S-Class",
  plate: "99-AA-001",
  driverName: "Ziya Səfərəliyev",
  phone1: "+994 50 123 45 67",
  phone2: "",
  whatsapp: "994501234567",
  instagram: "https://instagram.com/zianfc.az",
  tiktok: "https://tiktok.com/@zianfc.az",
  telegram: "https://t.me/zianfc",
  waze: "https://waze.com/ul",
  coverUrl: "/s-class.png",
  avatarUrl: "/ziya.webp",
};

export default function ZiaCarPage() {
  const [demo, setDemo] = useState<DemoState>(INITIAL_DEMO);
  const [showEditControls, setShowEditControls] = useState(false);
  const { lang, t } = useLang();

  return (
    <main className="min-h-screen bg-white text-slate-950 selection:bg-sky-500 selection:text-white">
      {/* Light Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50 active:scale-95"
              title={t("Əsas səhifəyə qayıt", "Back to main page")}
            >
              <ArrowLeft size={18} />
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.webp"
                alt="Zia NFC"
                width={36}
                height={36}
                className="size-9 rounded-full object-cover ring-2 ring-sky-500/20"
              />
              <span className="text-lg font-black tracking-tight text-slate-950">
                Zia <span className="text-sky-500">Car</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <LangSwitcher />
            <Link
              href="/car/admin"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700 shadow-sm transition duration-200 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <ShieldCheck size={16} className="text-sky-500" /> Zia Car Admin
            </Link>
            <a
              href="https://wa.me/994702990252?text=Salam,%20Zia%20Car%20avto%20stikeri%20sifarish%20etmek%20isteyirem"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-3.5 py-2 text-xs font-black uppercase tracking-[0.1em] text-white shadow-[0_12px_30px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <MessageCircle size={16} /> {t("Sifariş et", "Order Now")}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section — Light Gradient matching Landing */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#eef6ff_100%)] px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-4 py-2 text-xs font-extrabold text-sky-800">
            <Sparkles size={16} className="text-sky-500" /> {t("Zia Car — Sadə Avto NFC Vizitka", "Zia Car — Simple Auto NFC Card")}
          </div>

          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            {t("Avtomobiliniz üçün", "Simple & Safe Digital Profile")} <span className="text-sky-500">{t("Sadə və Təhlükəsiz", "for Your Car")}</span> {t("Rəqəmsal Profil", "")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-600 sm:text-lg">
            {t(
              "Kağız üzərində nömrə yazmağa son! Ön şüşədəki NFC stiker və ya QR kod vasitəsilə 1 saniyədə zəng edin, WhatsApp-da yazın və sosial şəbəkələrinizə keçid edin.",
              "No more writing numbers on paper! Call, text on WhatsApp, or visit social networks in 1 second via the windshield NFC sticker or QR code."
            )}
          </p>
        </div>
      </section>

      {/* Demo Section — Light Background */}
      <section className="relative bg-slate-50 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                {t("Canlı Nümunə", "Live Demo")}
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {t("Sadə Avto Profil Görünüşü", "Simple Auto Profile View")}
              </h2>
            </div>
            <button
              onClick={() => setShowEditControls(!showEditControls)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-600 active:scale-95"
            >
              <Zap size={14} className="text-sky-500" /> {showEditControls ? t("Redaktəni bağla", "Close Edit") : t("Test üçün məlumatları dəyiş", "Edit details for demo")}
            </button>
          </div>

          {/* Interactive Edit Drawer */}
          {showEditControls && (
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-sky-600">
                {t("Canlı Test Redaktəsi (Nümunə üçün)", "Live Demo Editor")}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("Avto / Model", "Car / Model")}</label>
                  <input
                    type="text"
                    value={demo.carName}
                    onChange={(e) => setDemo({ ...demo, carName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("Dövlət Nömrəsi", "License Plate")}</label>
                  <input
                    type="text"
                    value={demo.plate}
                    onChange={(e) => setDemo({ ...demo, plate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("Sürücü Adı", "Driver Name")}</label>
                  <input
                    type="text"
                    value={demo.driverName}
                    onChange={(e) => setDemo({ ...demo, driverName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("Əlaqə Nömrəsi", "Phone Number")}</label>
                  <input
                    type="text"
                    value={demo.phone1}
                    onChange={(e) => setDemo({ ...demo, phone1: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("WhatsApp Nömrəsi", "WhatsApp Number")}</label>
                  <input
                    type="text"
                    value={demo.whatsapp}
                    onChange={(e) => setDemo({ ...demo, whatsapp: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Features + Mobile Preview Layout */}
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-center">
            {/* Features Description Column — Light cards matching site theme */}
            <div className="space-y-5">
              <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-sky-200">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                    <Car size={22} />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{t("Profil Şəkli & Cover Dəstəyi", "Profile Picture & Cover Support")}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {t(
                    "Avtomobilinizin şəkli (Cover) və sürücü/müştəri fotosu profilin yuxarı hissəsində təmiz göstərilir.",
                    "Your vehicle's cover photo and driver photo are clearly presented at the top of your profile."
                  )}
                </p>
              </div>

              <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-sky-200">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Phone size={22} />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{t("İki Əlaqə Nömrəsi & WhatsApp", "Two Contact Numbers & WhatsApp")}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {t(
                    "Parkinq zamanı maneə yarandıqda bir toxunuşla birbaşa zəng açılır və ya WhatsApp çatı başlanır.",
                    "If blocking parking, call directly or open WhatsApp chat with a single tap."
                  )}
                </p>
              </div>

              <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-sky-200">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-purple-50 text-purple-600">
                    <Instagram size={22} />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{t("Sosial Şəbəkələr & Lokasiya", "Social Networks & Location")}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {t(
                    "Instagram, TikTok, Telegram və Waze naviqasiya düymələri tam inteqrasiya edilib.",
                    "Instagram, TikTok, Telegram, and Waze navigation buttons are fully integrated."
                  )}
                </p>
              </div>
            </div>

            {/* Simulated Mobile Phone Card View — Clean Light Profile */}
            <div className="mx-auto w-full max-w-[380px]">
              <div className="relative overflow-hidden rounded-[2.5rem] border-[8px] border-slate-900 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                {/* Top Phone Speaker Notch */}
                <div className="absolute top-0 inset-x-0 z-30 flex justify-center pt-2">
                  <div className="h-4 w-28 rounded-full bg-slate-950" />
                </div>

                {/* Light Mobile Profile View */}
                <div className="min-h-[610px] bg-slate-50 text-slate-900 font-sans pb-8">
                  {/* Cover Image */}
                  <div className="relative h-44 w-full bg-slate-200">
                    <img
                      src={demo.coverUrl}
                      alt={demo.carName}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/30" />
                    <div className="absolute top-8 left-4 z-20 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-1 text-[10px] font-extrabold text-slate-900 shadow-sm backdrop-blur-md">
                      <Car size={12} className="text-sky-500" /> Zia Car
                    </div>
                  </div>

                  {/* Profile Info Header */}
                  <div className="px-5 relative z-10 -mt-10">
                    <div className="flex items-end justify-between">
                      <div className="relative size-20 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
                        <img
                          src={demo.avatarUrl}
                          alt={demo.driverName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <h2 className="text-xl font-black tracking-tight text-slate-950">
                        {demo.driverName}
                      </h2>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-xl bg-sky-100 border border-sky-200 px-3 py-1 text-sm font-black text-sky-900 uppercase tracking-widest">
                          {demo.plate}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {demo.carName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Contact Buttons */}
                  <div className="px-5 mt-5 space-y-2.5">
                    {/* Call Button 1 */}
                    <a
                      href={`tel:${demo.phone1}`}
                      className="flex h-12 w-full items-center justify-between rounded-2xl bg-sky-500 px-4 font-extrabold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-400 active:scale-95"
                    >
                      <span className="flex items-center gap-2.5 text-sm">
                        <Phone size={18} /> {t("Zəng et (Sürücü)", "Call (Driver)")}
                      </span>
                      <span className="text-xs font-bold opacity-90">{demo.phone1}</span>
                    </a>

                    {/* Call Button 2 */}
                    {demo.phone2 && (
                      <a
                        href={`tel:${demo.phone2}`}
                        className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 font-bold text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-600 active:scale-95"
                      >
                        <span className="flex items-center gap-2.5 text-sm">
                          <Phone size={18} className="text-sky-500" /> {t("Təcili Əlaqə", "Emergency Contact")}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{demo.phone2}</span>
                      </a>
                    )}

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${demo.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-12 w-full items-center justify-between rounded-2xl bg-emerald-500 px-4 font-extrabold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95"
                    >
                      <span className="flex items-center gap-2.5 text-sm">
                        <MessageCircle size={18} /> {t("WhatsApp ilə yaz", "Text on WhatsApp")}
                      </span>
                      <ExternalLink size={15} className="opacity-80" />
                    </a>

                    {/* Save Contact vCard */}
                    <button
                      type="button"
                      onClick={() => alert(t("Profil kontakt faylı (.vcf) endirilir.", "Downloading contact file (.vcf)."))}
                      className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 font-bold text-slate-800 shadow-sm transition hover:border-slate-300 active:scale-95"
                    >
                      <span className="flex items-center gap-2.5 text-sm">
                        <UserPlus size={18} className="text-sky-500" /> {t("Kontaktı Yadda Saxla", "Save Contact")}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">vCard</span>
                    </button>
                  </div>

                  {/* Social Buttons Grid */}
                  <div className="px-5 mt-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
                      {t("Sosial Şəbəkələr & Lokasiya", "Social & Location")}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <a
                        href={demo.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-pink-300 hover:text-pink-600"
                        title="Instagram"
                      >
                        <Instagram size={20} className="text-pink-500" />
                        <span className="mt-1 text-[9px] font-bold">Instagram</span>
                      </a>

                      <a
                        href={demo.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-slate-400"
                        title="TikTok"
                      >
                        <Music2 size={20} className="text-slate-900" />
                        <span className="mt-1 text-[9px] font-bold">TikTok</span>
                      </a>

                      <a
                        href={demo.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-600"
                        title="Telegram"
                      >
                        <Zap size={20} className="text-sky-500" />
                        <span className="mt-1 text-[9px] font-bold">Telegram</span>
                      </a>

                      <a
                        href={demo.waze}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
                        title="Waze"
                      >
                        <Navigation size={20} className="text-blue-500" />
                        <span className="mt-1 text-[9px] font-bold">Waze</span>
                      </a>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 mt-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Powered by <span className="text-slate-900 font-black">Zia NFC</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order CTA Section — Clean Light Card */}
      <section className="border-t border-slate-200/80 bg-white px-4 py-16 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {t("Avtomobiliniz üçün Zia Car Şüşə Stikeri Əldə Edin", "Get Zia Car Windshield Sticker for Your Vehicle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {t(
              "Professional su keçirməz NFC şüşə stikeri və ya NFC avto kartı sifariş edin. Məlumatlarınızı istənilən an idarəetmə panelindən yeniləyə bilərsiniz.",
              "Order a professional waterproof NFC windshield sticker or NFC auto card. Update your details anytime from the management dashboard."
            )}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/994702990252?text=Salam,%20Zia%20Car%20avto%20stikeri%20sifarish%20etmek%20isteyirem"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 active:scale-95"
            >
              {t("WhatsApp ilə Sifariş et", "Order via WhatsApp")} <ArrowRight size={18} />
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-extrabold text-slate-800 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              {t("Əsas Səhifə", "Home Page")}
            </Link>
          </div>
        </div>
      </section>

      {/* Light Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-center text-xs font-semibold text-slate-500">
        <p>© {new Date().getFullYear()} Zia NFC & Zia Car. {t("Bütün hüquqlar qorunur.", "All rights reserved.")}</p>
      </footer>
    </main>
  );
}
