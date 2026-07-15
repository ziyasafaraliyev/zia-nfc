"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const SCROLL_KEY = "pay-scroll-to";

const links = [
  { label: "Demo", href: "/pay/demo/skan" as const },
  { label: "İş prinsipi", id: "how-it-works" },
  { label: "Xüsusiyyətlər", id: "features" },
  { label: "Qiymət", id: "pricing" },
  { label: "FAQ", id: "faq" },
  { label: "Haqqında", href: "/pay/about" as const },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}

function isPayHome(pathname: string) {
  return pathname === "/pay" || pathname === "/pay/";
}

/** Haqqında və digər alt səhifələrdən /pay-ə gələndə section-a scroll */
function usePaySectionScroll(pathname: string) {
  useEffect(() => {
    if (!isPayHome(pathname)) return;

    let target = "";
    try {
      target = sessionStorage.getItem(SCROLL_KEY) || "";
      if (target) sessionStorage.removeItem(SCROLL_KEY);
    } catch {
      /* ignore */
    }
    if (!target) {
      target = window.location.hash.replace(/^#/, "");
    }
    if (!target) return;

    let attempts = 0;
    let raf = 0;
    let cancelled = false;

    const tryScroll = () => {
      if (cancelled) return;
      if (scrollToId(target)) {
        history.replaceState(null, "", `#${target}`);
        return;
      }
      attempts += 1;
      if (attempts < 40) {
        raf = window.requestAnimationFrame(tryScroll);
      }
    };

    const t = window.setTimeout(tryScroll, 60);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.cancelAnimationFrame(raf);
    };
  }, [pathname]);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  usePaySectionScroll(pathname);

  function goToSection(id: string) {
    setOpen(false);

    if (isPayHome(pathname)) {
      scrollToId(id);
      history.replaceState(null, "", `#${id}`);
      return;
    }

    // Haqqında və s. — hash Next-də itə bilər, sessionStorage ilə ötürürük
    try {
      sessionStorage.setItem(SCROLL_KEY, id);
    } catch {
      /* ignore */
    }
    router.push("/pay");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-full border border-white/70 bg-white/95 px-6 py-2.5 shadow-md md:bg-white/80 md:shadow-[0_18px_60px_rgba(15,23,42,0.12)] md:backdrop-blur-xl">
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
          Zia NFC
        </Link>

        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200/70 bg-slate-950/5 px-2 py-1.5 text-sm font-semibold text-slate-700 md:flex">
          {links.map((l) =>
            "id" in l && l.id ? (
              <button
                key={l.id}
                type="button"
                onClick={() => goToSection(l.id)}
                className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-900 transition duration-200 ease-out hover:bg-white hover:text-slate-950 lg:px-4 lg:text-base lg:tracking-[0.12em]"
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.href}
                href={l.href!}
                className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-900 transition duration-200 ease-out hover:bg-white hover:text-slate-950 lg:px-4 lg:text-base lg:tracking-[0.12em]"
              >
                {l.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/restoran"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-sky-500 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Restoran
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-sky-500 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Admin
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menyu"
          className="flex size-11 items-center justify-center rounded-full text-slate-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-slate-200/70 bg-white p-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) =>
              "id" in l && l.id ? (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => goToSection(l.id)}
                  className="rounded-xl px-3 py-3 text-left text-sm font-bold uppercase tracking-[0.08em] text-slate-800 hover:bg-slate-50"
                >
                  {l.label}
                </button>
              ) : (
                <Link
                  key={l.href}
                  href={l.href!}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-800 hover:bg-slate-50"
                >
                  {l.label}
                </Link>
              )
            )}
            <Link
              href="/restoran"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-sky-500 px-5 py-3 text-center text-sm font-black uppercase tracking-[0.1em] text-white"
            >
              Restoran
            </Link>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="rounded-full bg-sky-500 px-5 py-3 text-center text-sm font-black uppercase tracking-[0.1em] text-white"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
