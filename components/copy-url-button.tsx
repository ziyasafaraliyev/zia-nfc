"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      title="Copy NFC URL"
      className="grid size-11 place-items-center rounded-full bg-ink text-paper"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
    </button>
  );
}
