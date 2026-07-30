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
