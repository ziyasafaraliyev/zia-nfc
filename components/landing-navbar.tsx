"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLang } from "@/components/language-context";

const NAV_ITEMS_AZ = [
  ["Rəqəmsal Profil", "#digital-profile"],
  ["Xidmətlər", "#digital-services"],
  ["İş Prinsipi", "#how-it-works"],
  ["Qiymətlər", "#pricing"],
  ["Özəlliklər", "#features"],
  ["FAQ", "#faq"],
] as const;

const NAV_ITEMS_EN = [
  ["Digital Profile", "#digital-profile"],
  ["Services", "#digital-services"],
  ["How It Works", "#how-it-works"],
  ["Pricing", "#pricing"],
  ["Features", "#features"],
  ["FAQ", "#faq"],
] as const;

const adminBtnClass =
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-sky-500 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98] sm:px-4 sm:py-2 sm:text-xs";

/** Pill-style AZ | EN language switcher */
function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="flex shrink-0 items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-[11px] font-black uppercase tracking-wider shadow-sm"
    >
      <button
        type="button"
        aria-pressed={lang === "az"}
        onClick={() => setLang("az")}
        className={`px-2.5 py-1 transition-all duration-200 ease-out ${
          lang === "az"
            ? "bg-sky-500 text-white shadow-inner"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        AZ
      </button>
      <span className="h-3.5 w-px bg-slate-300" aria-hidden="true" />
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 transition-all duration-200 ease-out ${
          lang === "en"
            ? "bg-sky-500 text-white shadow-inner"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        EN
      </button>
    </div>
  );
}

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();

  const navItems = lang === "en" ? NAV_ITEMS_EN : NAV_ITEMS_AZ;

  return (
    <div className="relative z-50">
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
          <span className="text-base font-black sm:text-lg">Zia NFC</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-0.5 rounded-full border border-slate-200/70 bg-slate-950/5 p-1 text-xs font-semibold text-slate-700 md:flex">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-tight text-slate-900 transition duration-200 ease-out hover:bg-white hover:text-slate-950 lg:px-3 lg:tracking-normal"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop right: lang switcher + admin */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Language switcher — always visible on desktop, hidden on mobile (shown in drawer) */}
          <div className="hidden md:block">
            <LangSwitcher />
          </div>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            aria-label={open ? "Menyunu bağla" : "Menyu"}
            aria-expanded={open}
            className="flex size-9 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/admin" className={adminBtnClass}>
            Admin
          </Link>
        </div>
      </nav>

      {/* Mobile dropdown — nav items + lang switcher */}
      {open ? (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-slate-200/70 bg-white p-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-50"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Language switcher inside mobile menu */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Language
            </span>
            <LangSwitcher />
          </div>
        </div>
      ) : null}
    </div>
  );
}
