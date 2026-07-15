"use client";

import { useEffect, useState } from "react";

/**
 * True on mobile (< md) or when user prefers reduced motion.
 * Default true (mobile-first) so SSR/hydration does not flash heavy animations.
 * Does not import framer-motion — safe for any client component.
 */
export function useLiteMotion(): boolean {
  const [lite, setLite] = useState(true);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setLite(mobile.matches || reduced.matches);
    sync();
    mobile.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      mobile.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return lite;
}
