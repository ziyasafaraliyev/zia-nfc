"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useLang } from "@/components/language-context";

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
  const { t } = useLang();

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
        alert(t("Xəta: ", "Error: ", "Fehler: ", "Erreur : ") + (data.error || t("Bilinməyən xəta", "Unknown error", "Unbekannter Fehler", "Erreur inconnue")));
      }
    } catch {
      alert(t("Şəbəkə xətası baş verdi", "Network error occurred", "Netzwerkfehler aufgetreten", "Une erreur réseau est survenue"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="lux-save-contact group flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="lux-save-icon grid size-9 place-items-center rounded-xl shrink-0">
          <svg
            width="18"
            height="18"
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
        <span className="flex min-w-0 flex-col items-start leading-tight">
          <span className="text-sm font-bold text-gray-800">
            {loading
              ? t("Yüklənir...", "Loading...", "Wird geladen...", "Chargement...")
              : t("Google Wallet-ə əlavə et", "Add to Google Wallet", "Zu Google Wallet hinzufügen", "Ajouter à Google Wallet")}
          </span>
          <span className="mt-0.5 max-w-full truncate text-[10px] font-semibold text-gray-400">
            {t("Kontaktı telefonuna saxla", "Save contact to phone", "Kontakt auf dem Telefon speichern", "Enregistrer le contact sur le téléphone")}
          </span>
        </span>
      </span>
      <ExternalLink
        size={15}
        className="shrink-0 text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </button>
  );
}

