"use client";

import { ExternalLink, Link2 } from "lucide-react";

interface ReferralButtonProps {
  profileName: string;
  referralUrl: string;
}

export default function ReferralButton({
  profileName,
  referralUrl,
}: ReferralButtonProps) {
  return (
    <a
      href={referralUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`${profileName} — referral linki. Özün qeydiyyatdan keç, linki kopyala və paylaş`}
      className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="lux-save-icon grid size-9 shrink-0 place-items-center rounded-xl">
          <Link2 size={16} className="text-[#29AEEE]" />
        </span>
        <span className="flex min-w-0 flex-col items-start leading-tight">
          <span className="text-sm font-bold text-gray-800">
            Referral linki
          </span>
          <span className="mt-0.5 max-w-full truncate text-[10px] font-semibold text-gray-400">
            Linki kopyala və paylaş · Özün qeydiyyatdan keç
          </span>
        </span>
      </span>
      <ExternalLink
        size={15}
        className="shrink-0 text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}
