"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Lang = "az" | "en";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** String overload */
  t(az: string, en: string): string;
  /** ReactNode overload — use when passing JSX */
  t(az: ReactNode, en: ReactNode): ReactNode;
}

const LangContext = createContext<LangContextValue>({
  lang: "az",
  setLang: () => {},
  t: (az: ReactNode) => az,
} as LangContextValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("az");

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("zia-lang") as Lang | null;
      if (stored === "az" || stored === "en") setLangState(stored);
    } catch {}
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem("zia-lang", l);
    } catch {}
  }

  function t(az: ReactNode, en: ReactNode): ReactNode {
    return lang === "en" ? en : az;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: t as LangContextValue["t"] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** Pill-style AZ | EN language switcher */
export function LangSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`flex shrink-0 items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-[11px] font-black uppercase tracking-wider shadow-sm ${className}`}
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
