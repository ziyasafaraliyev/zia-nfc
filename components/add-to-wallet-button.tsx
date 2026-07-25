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
  backgroundUrl?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  whatsapp?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
};

export default function AddToWalletButton({
  slug,
  name,
  profession,
  phone,
  email,
  profileUrl,
  avatarUrl,
  backgroundUrl,
  bio,
  website,
  location,
  whatsapp,
  linkedin,
  instagram,
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
          backgroundUrl: backgroundUrl ?? undefined,
          bio: bio ?? undefined,
          website: website ?? undefined,
          location: location ?? undefined,
          whatsapp: whatsapp ?? undefined,
          linkedin: linkedin ?? undefined,
          instagram: instagram ?? undefined,
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
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="group flex h-14 w-full items-center gap-3 rounded-full border border-slate-200 bg-white px-4 text-left shadow-sm transition duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 7.5C4 6.12 5.12 5 6.5 5h11A2.5 2.5 0 0 1 20 7.5V16a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 16V7.5Z"
              fill="#4285F4"
            />
            <path d="M6.5 5C5.12 5 4 6.12 4 7.5V16C4 17.88 5.12 19 6.5 19H9V5H6.5Z" fill="#0F9D58" />
            <path d="M9 5H18.5C19.33 5 20 5.67 20 6.5V8H9V5Z" fill="#F4B400" />
            <path d="M18.5 8H20C20.83 8 21.5 8.67 21.5 9.5V13.5C21.5 14.33 20.83 15 20 15H18.5V8Z" fill="#DB4437" />
          </svg>
        </span>
        <span className="flex flex-col justify-center leading-tight">
          <span className="text-sm font-semibold text-slate-950">
            {loading ? "Yüklənir..." : "Google Wallet-ə əlavə et"}
          </span>
          <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
            Kontaktı telefonuna saxla
          </span>
        </span>
      </span>
    </button>
  );
}
