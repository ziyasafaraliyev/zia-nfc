"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

export default function Chatbot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleTidioReady = () => {
      setReady(true);
      // Hide the default Tidio widget trigger so we can use our custom styled one
      if (window.tidioChat) {
        window.tidioChat.hide();
      }
    };

    document.addEventListener("tidioChat-ready", handleTidioReady);

    return () => {
      document.removeEventListener("tidioChat-ready", handleTidioReady);
    };
  }, []);

  const handleOpenChat = () => {
    if (window.tidioChat) {
      window.tidioChat.open();
    } else {
      console.warn("Tidio is not loaded yet.");
    }
  };

  return (
    <>
      <Script
        src="//code.tidio.co/czthpvfnredauldg6xwb3irtbvdz8u8y.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Fallback if event already fired before mount
          if (window.tidioChat) {
            window.tidioChat.hide();
            setReady(true);
          }
        }}
      />

      {/* Custom Trigger Button */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 rounded-full bg-[#29AEEE] px-4 py-3 text-xs font-bold text-white shadow-[0_8px_30px_rgba(41,174,238,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#1a9ad4] hover:shadow-[0_12px_40px_rgba(41,174,238,0.5)] active:scale-[0.97] group border border-white/10"
        style={{ fontFamily: "'Outfit', sans-serif" }}
        title="ZIANFC chatbot"
      >
        {/* Round Logo */}
        <div className="relative size-6 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white p-0.5 transition-transform duration-300 group-hover:rotate-12">
          <img
            src="/logo.png"
            alt="Zia NFC"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        
        {/* Label */}
        <span className="tracking-wide">ZIANFC chatbot</span>

        {/* Pulse indicator */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </button>

      {/* Inject custom CSS to force hide the default Tidio button in case of latency */}
      <style dangerouslySetInnerHTML={{ __html: `
        #tidio-chat-iframe,
        .tidio-chat-iframe,
        #tidio-chat {
          display: block !important;
        }
      `}} />
    </>
  );
}

// Global declaration for TypeScript
declare global {
  interface Window {
    tidioChat?: {
      hide: () => void;
      show: () => void;
      open: () => void;
      close: () => void;
    };
  }
}
