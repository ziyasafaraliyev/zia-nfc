"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Navigation,
  Phone,
  QrCode,
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
  carName: "BMW M5 Competition",
  plate: "99-AA-001",
  driverName: "Kənan Məmmədov",
  phone1: "+994 50 123 45 67",
  phone2: "+994 70 987 65 43",
  whatsapp: "994501234567",
  instagram: "https://instagram.com/zianfc.az",
  tiktok: "https://tiktok.com/@zianfc.az",
  telegram: "https://t.me/zianfc",
  waze: "https://waze.com/ul",
  coverUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
};

export default function ZiaCarPage() {
  const [demo, setDemo] = useState<DemoState>(INITIAL_DEMO);
  const [showEditControls, setShowEditControls] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition hover:border-sky-400 hover:text-white"
              title="Əsas səhifəyə qayıt"
            >
              <ArrowLeft size={18} />
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.webp"
                alt="Zia NFC"
                width={36}
                height={36}
                className="size-9 rounded-full object-cover ring-2 ring-sky-400/40"
              />
              <span className="text-lg font-black tracking-tight text-white">
                Zia <span className="text-sky-400">Car</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/994702990252?text=Salam,%20Zia%20Car%20avto%20stikeri%20sifarish%20etmek%20isteyirem"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] transition hover:bg-sky-400 active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <MessageCircle size={16} /> Sifariş et
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/30 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-extrabold text-sky-300">
            <Car size={16} /> Zia Car — Sadə Avto NFC Vizitka
          </div>

          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Avtomobiliniz üçün <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">Sadə və Təhlükəsiz</span> Rəqəmsal Profil
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-400 sm:text-lg">
            Kağız üzərində nömrə yazmağa son! Ön şüşədəki NFC stiker və ya QR kod vasitəsilə 1 saniyədə zəng edin, WhatsApp-da yazın və sosial şəbəkələrinizə keçid edin.
          </p>
        </div>
      </section>

      {/* Demo Section — Mobile Phone Preview */}
      <section className="relative px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Sadə Avto Profil Nümunəsi
              </h2>
              <p className="text-xs font-semibold text-slate-400 sm:text-sm">
                Müştəri profilinin bütün vacib detallarını ehtiva edən minimalist avto kartı.
              </p>
            </div>
            <button
              onClick={() => setShowEditControls(!showEditControls)}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-300 transition hover:bg-sky-500/20"
            >
              <Zap size={14} /> {showEditControls ? "Redaktəni bağla" : "Test üçün məlumatları dəyiş"}
            </button>
          </div>

          {/* Interactive Edit Drawer */}
          {showEditControls && (
            <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
              <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-sky-400">
                Canlı Test Redaktəsi (Nümunə üçün)
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Avto / Model</label>
                  <input
                    type="text"
                    value={demo.carName}
                    onChange={(e) => setDemo({ ...demo, carName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Dövlət Nömrəsi</label>
                  <input
                    type="text"
                    value={demo.plate}
                    onChange={(e) => setDemo({ ...demo, plate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Sürücü Adı</label>
                  <input
                    type="text"
                    value={demo.driverName}
                    onChange={(e) => setDemo({ ...demo, driverName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Nömrə 1 (Sürücü)</label>
                  <input
                    type="text"
                    value={demo.phone1}
                    onChange={(e) => setDemo({ ...demo, phone1: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Nömrə 2 (Təcili)</label>
                  <input
                    type="text"
                    value={demo.phone2}
                    onChange={(e) => setDemo({ ...demo, phone2: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">WhatsApp Nömrəsi</label>
                  <input
                    type="text"
                    value={demo.whatsapp}
                    onChange={(e) => setDemo({ ...demo, whatsapp: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Simple Car Profile Phone Container */}
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-center">
            {/* Features Description Column */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-sky-400">
                  <div className="grid size-10 place-items-center rounded-2xl bg-sky-500/10 border border-sky-400/20">
                    <Car size={20} />
                  </div>
                  <h3 className="text-lg font-black">Profil Şəkli & Cover Dəstəyi</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Avtomobilinizin şəkli (Cover) və ya öz profil şəkliniz üst tərəfdə aydın nümayiş olunur.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-emerald-400">
                  <div className="grid size-10 place-items-center rounded-2xl bg-emerald-500/10 border border-emerald-400/20">
                    <Phone size={20} />
                  </div>
                  <h3 className="text-lg font-black">İki Əlaqə Nömrəsi & WhatsApp</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Parkinq zamanı maneə yarandıqda sürücüyə zəng etmək və ya birbaş WhatsApp-dan mesaj yazmaq düymələri.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-purple-400">
                  <div className="grid size-10 place-items-center rounded-2xl bg-purple-500/10 border border-purple-400/20">
                    <Instagram size={20} />
                  </div>
                  <h3 className="text-lg font-black">Sosial Şəbəkələr & Lokasiya</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Instagram, TikTok, Telegram və Waze naviqasiya keçidləri ilə tam təchiz olunmuş sadə profil.
                </p>
              </div>
            </div>

            {/* Mobile Phone Mockup — Rendering the Simple Car Profile */}
            <div className="mx-auto w-full max-w-[390px]">
              <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-slate-800 bg-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
                {/* Top Phone Speaker Notch */}
                <div className="absolute top-0 inset-x-0 z-30 flex justify-center pt-2">
                  <div className="h-4 w-28 rounded-full bg-slate-950" />
                </div>

                {/* Simulated Mobile Car Profile Card View */}
                <div className="min-h-[620px] bg-slate-950 text-slate-100 font-sans pb-8">
                  {/* Cover Image */}
                  <div className="relative h-44 w-full bg-slate-800">
                    <img
                      src={demo.coverUrl}
                      alt={demo.carName}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
                    <div className="absolute top-7 left-4 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                      <Car size={12} className="text-sky-400" /> Zia Car
                    </div>
                  </div>

                  {/* Profile Info Header */}
                  <div className="px-5 relative z-10 -mt-10">
                    <div className="flex items-end justify-between">
                      <div className="relative size-20 overflow-hidden rounded-2xl border-4 border-slate-950 bg-slate-900 shadow-xl">
                        <img
                          src={demo.avatarUrl}
                          alt={demo.driverName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-right backdrop-blur-md">
                        <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400">
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Parkinqdədir
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h2 className="text-xl font-black tracking-tight text-white">
                        {demo.driverName}
                      </h2>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-lg bg-sky-500/20 border border-sky-400/30 px-2.5 py-0.5 text-xs font-black text-sky-300 uppercase tracking-widest">
                          {demo.plate}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {demo.carName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Contact Action Buttons */}
                  <div className="px-5 mt-5 space-y-2.5">
                    {/* Call Button 1 */}
                    <a
                      href={`tel:${demo.phone1}`}
                      className="flex h-12 w-full items-center justify-between rounded-2xl bg-sky-500 px-4 font-bold text-white shadow-lg shadow-sky-500/20 transition active:scale-95"
                    >
                      <span className="flex items-center gap-2.5 text-sm">
                        <Phone size={18} /> Zəng et (Sürücü)
                      </span>
                      <span className="text-xs opacity-80">{demo.phone1}</span>
                    </a>

                    {/* Call Button 2 */}
                    {demo.phone2 && (
                      <a
                        href={`tel:${demo.phone2}`}
                        className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 font-bold text-slate-200 transition hover:bg-white/10 active:scale-95"
                      >
                        <span className="flex items-center gap-2.5 text-sm">
                          <Phone size={18} className="text-sky-400" /> Təcili Əlaqə
                        </span>
                        <span className="text-xs text-slate-400">{demo.phone2}</span>
                      </a>
                    )}

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${demo.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-12 w-full items-center justify-between rounded-2xl bg-emerald-600 px-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition active:scale-95"
                    >
                      <span className="flex items-center gap-2.5 text-sm">
                        <MessageCircle size={18} /> WhatsApp ilə yaz
                      </span>
                      <ExternalLink size={15} className="opacity-70" />
                    </a>

                    {/* Save Contact vCard */}
                    <button
                      type="button"
                      onClick={() => alert("Profil kontakt faylı (.vcf) endirilir.")}
                      className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-900 px-4 font-bold text-slate-300 transition hover:bg-slate-800 active:scale-95"
                    >
                      <span className="flex items-center gap-2.5 text-sm">
                        <UserPlus size={18} className="text-sky-400" /> Kontaktı Yadda Saxla
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">vCard</span>
                    </button>
                  </div>

                  {/* Social Buttons Grid */}
                  <div className="px-5 mt-5">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2.5">
                      Sosial Şəbəkələr & Lokasiya
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <a
                        href={demo.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10 p-3 text-pink-400 transition hover:bg-pink-500/20"
                        title="Instagram"
                      >
                        <Instagram size={20} />
                        <span className="mt-1 text-[9px] font-bold">Instagram</span>
                      </a>

                      <a
                        href={demo.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300 transition hover:bg-cyan-500/20"
                        title="TikTok"
                      >
                        <Music2 size={20} />
                        <span className="mt-1 text-[9px] font-bold">TikTok</span>
                      </a>

                      <a
                        href={demo.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3 text-sky-400 transition hover:bg-sky-500/20"
                        title="Telegram"
                      >
                        <Zap size={20} />
                        <span className="mt-1 text-[9px] font-bold">Telegram</span>
                      </a>

                      <a
                        href={demo.waze}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400 transition hover:bg-blue-500/20"
                        title="Waze"
                      >
                        <Navigation size={20} />
                        <span className="mt-1 text-[9px] font-bold">Waze</span>
                      </a>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 mt-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      Powered by <span className="text-sky-400 font-black">Zia Car</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order CTA Section */}
      <section className="border-t border-white/10 bg-slate-900/60 px-4 py-16 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Avtomobiliniz üçün Zia Car Şüşə Stikeri Əldə Edin
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Professional su keçirməz NFC şüşə stikeri və ya NFC avto kartı sifariş edin. Məlumatlarınızı istənilən an idarəetmə panelindən yeniləyə bilərsiniz.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/994702990252?text=Salam,%20Zia%20Car%20avto%20stikeri%20sifarish%20etmek%20isteyirem"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-base font-extrabold text-white shadow-[0_0_30px_rgba(14,165,233,0.4)] transition hover:bg-sky-400 active:scale-95"
            >
              WhatsApp ilə Sifariş et <ArrowRight size={18} />
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-extrabold text-slate-300 transition hover:bg-white/10 active:scale-95"
            >
              Əsas Səhifə
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Zia NFC & Zia Car. Bütün hüquqlar qorunur.</p>
      </footer>
    </main>
  );
}
