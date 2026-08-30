"use client";

import React, { useEffect, useState } from "react";

export default function Chatbot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleTidioReady = () => {
      setReady(true);
      if (window.tidioChatApi) {
        // Hide the default bubble initially
        window.tidioChatApi.hide();
        
        // When the chat is closed, hide the bubble again
        window.tidioChatApi.on("close", () => {
          window.tidioChatApi?.hide();
        });
      }
    };

    if (window.tidioChatApi) {
      handleTidioReady();
    } else {
      // Do not load the Tidio script on page load — only listen for the ready
      // event in case the script is already present (e.g., preloaded elsewhere).
      document.addEventListener("tidioChat-ready", handleTidioReady);
    }

    return () => {
      document.removeEventListener("tidioChat-ready", handleTidioReady);
    };
  }, []);

  const handleOpenChat = () => {
    // If Tidio already loaded, open it immediately
    if (window.tidioChatApi) {
      window.tidioChatApi.show();
      window.tidioChatApi.open();
      return;
    }

    // Otherwise dynamically inject the Tidio script and open when ready
    if ((window as any)._tidioLoading) return; // already injecting
    (window as any)._tidioLoading = true;

    const script = document.createElement("script");
    script.src = "https://code.tidio.co/czthpvfnredauldg6xwb3irtbvdz8u8y.js";
    script.async = true;
    script.onload = () => {
      // Tidio sets up tidioChatApi and may fire tidioChat-ready event
      if (window.tidioChatApi) {
        try {
          window.tidioChatApi.hide();
          window.tidioChatApi.show();
          window.tidioChatApi.open();
        } catch (e) {
          // ignore
        }
      } else {
        // In some cases Tidio may dispatch a custom event — listen briefly
        const onReady = () => {
          window.tidioChatApi?.hide();
          window.tidioChatApi?.show();
          window.tidioChatApi?.open();
          document.removeEventListener("tidioChat-ready", onReady);
        };
        document.addEventListener("tidioChat-ready", onReady);
      }
    };
    document.body.appendChild(script);
  };

  return (
    <>
      {/* Tidio script is injected on-demand when the user opens the chat. */}

      {/* Custom Trigger Button */}
      <button
        onClick={handleOpenChat}
        type="button"
        className="group fixed bottom-6 right-6 z-[9999] flex size-14 items-center justify-center rounded-full border-2 border-white/80 bg-white p-1 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(41,174,238,0.4)] active:scale-95"
        title="ZIANFC chatbot"
        aria-label="ZIANFC chatbot"
      >
        {/* Round Logo */}
        <img
          src="/logo.webp"
          alt="Zia NFC"
          className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Pulse indicator */}
        <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></span>
        </span>
      </button>
    </>
  );
}

// Global declaration for TypeScript
declare global {
  interface Window {
    tidioChatApi?: {
      on: (event: string, callback: () => void) => void;
      open: () => void;
      close: () => void;
      show: () => void;
      hide: () => void;
    };
  }
}