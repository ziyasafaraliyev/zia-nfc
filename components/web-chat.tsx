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
      <div className="relative flex size-14 items-center justify-center rounded-full border-2 border-white/80 bg-white p-1 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <span className="size-8 animate-pulse rounded-full bg-sky-500/20" />
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
          aria-label="Zia NFC ChatBot"
          title="Zia NFC ChatBot"
          className="group relative flex size-14 items-center justify-center rounded-full border-2 border-white/80 bg-white p-1 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(41,174,238,0.4)] active:scale-95"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt="Zia NFC"
            className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
          </span>
        </button>
      </div>
    );
  }

  return <WebChatApp initialOpen />;
}
