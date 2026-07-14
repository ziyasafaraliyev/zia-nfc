"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  ["Kartlar", "#cards"],
  ["Məhsullar", "#nfc-products"],
  ["İş Prinsipi", "#how-it-works"],
  ["Qiymətlər", "#pricing"],
  ["Özəlliklər", "#features"],
  ["FAQ", "#faq"],
] as const;

const adminBtnClass =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-sky-500 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-sm";

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-50">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-full border border-white/70 bg-white/70 px-4 py-2.5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-xl font-black tracking-tight text-slate-950 transition duration-200 ease-out hover:-translate-y-0.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt="Zia NFC"
            className="size-11 rounded-full object-cover"
          />
          <span className="hidden sm:inline">Zia NFC</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200/70 bg-slate-950/5 px-2 py-1.5 text-sm font-semibold text-slate-700 md:flex">
          {navItems.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-900 transition duration-200 ease-out hover:bg-white hover:text-slate-950 lg:px-4 lg:text-base lg:tracking-[0.12em]"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Hamburger (mobile) + Admin */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-label={open ? "Menyunu bağla" : "Menyu"}
            aria-expanded={open}
            className="flex size-11 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link href="/admin" className={adminBtnClass}>
            Admin
          </Link>
        </div>
      </nav>

      {/* Mobile dropdown — nav items only (Admin stays on bar) */}
      {open ? (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-slate-200/70 bg-white/95 p-4 shadow-xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-50"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
