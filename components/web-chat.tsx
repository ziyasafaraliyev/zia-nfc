"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

/**
 * Lightweight launcher — chat JS only loads after first open click.
 * Keeps home page JS smaller (optimization #2).
 */
const WebChatApp = dynamic(() => import("./web-chat-app"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <div className="flex items-center gap-2.5 rounded-full bg-sky-500/90 px-5 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)]">
        <span className="size-7 animate-pulse rounded-full bg-white/30" />
        <span>Yüklənir…</span>
      </div>
    </div>
  ),
});

export default function WebChat() {
  const [mounted, setMounted] = useState(false);

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] font-sans">
        <button
          type="button"
          onClick={() => setMounted(true)}
          className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-sky-500 px-5 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.97]"
        >
          <div className="relative size-7 shrink-0 overflow-hidden rounded-full border border-white/30 bg-white p-0.5 transition-transform duration-300 group-hover:rotate-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.webp"
              alt="Zia NFC"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <span>ZIANFC ChatBot</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
        </button>
      </div>
    );
  }

  return <WebChatApp initialOpen />;
}
