"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Lang = "az" | "en" | "de" | "fr" | "ru";
export const LANGS: Lang[] = ["az", "en", "de", "fr", "ru"];

const LANG_LABELS: Record<Lang, string> = {
  az: "AZ",
  en: "EN",
  de: "DE",
  fr: "FR",
  ru: "RU",
};

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** String overload */
  t(az: string, en: string, de?: string, fr?: string, ru?: string): string;
  /** ReactNode overload — use when passing JSX */
  t(az: ReactNode, en: ReactNode, de?: ReactNode, fr?: ReactNode, ru?: ReactNode): ReactNode;
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
      if (stored && LANGS.includes(stored)) setLangState(stored);
    } catch {}
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem("zia-lang", l);
    } catch {}
  }

  function t(az: ReactNode, en: ReactNode, de?: ReactNode, fr?: ReactNode, ru?: ReactNode): ReactNode {
    if (lang === "en") return en;
    if (lang === "de") return de ?? en ?? az;
    if (lang === "fr") return fr ?? en ?? az;
    if (lang === "ru") return ru ?? en ?? az;
    return az;
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

/** Pill-style AZ | EN language switcher (landing page — only 2 langs) */
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

/** Full language switcher (AZ, EN, DE, FR, RU) for customer profile pages */
export function ProfileLangSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Dil seçimi"
      className={`flex shrink-0 items-center overflow-hidden rounded-full border border-slate-200/60 bg-black/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider shadow-sm ${className}`}
    >
      {LANGS.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span className="h-3.5 w-px bg-white/20" aria-hidden="true" />}
          <button
            type="button"
            aria-pressed={lang === l}
            onClick={() => setLang(l)}
            className={`px-2.5 py-1.5 transition-all duration-200 ease-out ${
              lang === l
                ? "bg-white/90 text-slate-900 shadow-inner"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {LANG_LABELS[l]}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
