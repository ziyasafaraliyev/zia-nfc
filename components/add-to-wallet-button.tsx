"use client";

import { useState } from "react";

type Props = {
  slug: string;
  name: string;
  profession?: string | null;
  phone?: string | null;
  email?: string | null;
  profileUrl: string;
  avatarUrl?: string | null;
};

export default function AddToWalletButton({
  slug,
  name,
  profession,
  phone,
  email,
  profileUrl,
  avatarUrl,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          profession: profession ?? undefined,
          phone: phone ?? undefined,
          email: email ?? undefined,
          profileUrl,
          avatarUrl: avatarUrl ?? undefined,
        }),
      });
      const data = await res.json();
      if (data.walletUrl) {
        const a = document.createElement("a");
        a.href = data.walletUrl;
        a.target = "_blank";
        a.rel = "noopener";
        a.click();
      } else {
        alert("Xəta: " + (data.error || "Bilinməyən xəta"));
      }
    } catch {
      alert("Şəbəkə xətası baş verdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="lux-save-contact group flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50"
    >
      <span className="flex items-center gap-3">
        <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L3 7v10l9 5 9-5V7l-9-5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 12L3 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 12l9-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-sm font-bold text-gray-800">
            {loading ? "Yüklənir..." : "Google Wallet-ə əlavə et"}
          </span>
          <span className="text-[10px] font-semibold text-gray-400 mt-0.5">
            Kontaktı telefonuna saxla
          </span>
        </span>
      </span>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </button>
  );
}
