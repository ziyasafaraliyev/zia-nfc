"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

interface ReferralButtonProps {
  profileName: string;
  referralUrl: string;
}

export default function ReferralButton({
  profileName,
  referralUrl,
}: ReferralButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const shareData = {
      title: profileName,
      text: `${profileName} — referral link`,
      url: referralUrl,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // User cancelled share or share failed — fall through to copy
    }

    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Last resort: open link
      window.open(referralUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
    >
      <span className="flex items-center gap-3">
        <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
          {copied ? (
            <Check size={16} className="text-emerald-500" />
          ) : (
            <Link2 size={16} className="text-[#29AEEE]" />
          )}
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-sm font-bold text-gray-800">
            {copied ? "Link kopyalandı" : "Referral linki"}
          </span>
          <span className="mt-0.5 text-[10px] font-semibold text-gray-400">
            {copied ? "Paylaşmağa hazırsan" : "Linki kopyala və paylaş"}
          </span>
        </span>
      </span>
      <Share2
        size={15}
        className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
