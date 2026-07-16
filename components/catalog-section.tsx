"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Link2,
} from "lucide-react";
import type { CatalogItem } from "@/lib/types";

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function normalizeCatalog(items: CatalogItem[] | null | undefined): CatalogItem[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items
    .map((item) => {
      const url = normalizeUrl(item?.url || "");
      if (!url) return null;
      return {
        id: item.id || crypto.randomUUID(),
        name: (item.name || "").trim() || "Kataloq",
        url,
      };
    })
    .filter((item): item is CatalogItem => item !== null);
}

export default function CatalogSection({
  catalog,
}: {
  catalog: CatalogItem[] | null | undefined;
}) {
  const items = normalizeCatalog(catalog);
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="mt-2.5 space-y-3 lux-card-enter-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="lux-save-contact group flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 transition-transform duration-200 hover:scale-[1.02]"
      >
        <span className="flex items-center gap-3">
          <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
            <Link2 size={18} />
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-sm font-bold text-gray-800">Kataloq</span>
            <span className="mt-0.5 text-[10px] font-semibold text-gray-400">
              {items.length} link
            </span>
          </span>
        </span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400 transition-colors group-hover:text-[#29AEEE]" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 transition-colors group-hover:text-[#29AEEE]" />
        )}
      </button>

      {open ? (
        <div className="space-y-2.5">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lux-save-contact group flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 hover:scale-[1.01]"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <Link2
                  size={16}
                  className="shrink-0 text-[#29AEEE] transition-colors group-hover:text-[#1a9ad4]"
                />
                <span className="truncate text-sm font-bold text-gray-800">
                  {item.name}
                </span>
              </span>
              <ExternalLink
                size={15}
                className="shrink-0 text-gray-400 transition-colors group-hover:text-[#29AEEE]"
              />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
