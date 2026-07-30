"use client";

import type { CarProfile } from "@/lib/types";
import {
  Car,
  ExternalLink,
  Instagram,
  MessageCircle,
  Music2,
  Navigation,
  Phone,
  Share2,
  UserPlus,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  profile: CarProfile;
  profileUrl: string;
};

export default function ProfileCarPageView({ profile, profileUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const whatsapp = profile.whatsapp?.replace(/[^\d]/g, "");

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.driver_name} — ${profile.plate}`,
          text: `Zia Car Rəqəmsal Avto Profil: ${profile.driver_name} (${profile.plate})`,
          url: profileUrl,
        });
      } catch {}
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  const handleDownloadVcard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.driver_name} (${profile.plate})
ORG:Zia Car
TITLE:${profile.car_name} — ${profile.plate}
${profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : ""}
${profile.phone2 ? `TEL;TYPE=WORK:${profile.phone2}` : ""}
${whatsapp ? `TEL;TYPE=WHATSAPP:+${whatsapp}` : ""}
URL:${profileUrl}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.slug}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-12 selection:bg-sky-500 selection:text-white">
      <div className="mx-auto max-w-[440px] px-3 py-4 sm:px-4">
        <div className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
          {/* Cover Photo */}
          <div className="relative h-48 w-full bg-slate-900">
            {profile.cover_url ? (
              <img
                src={profile.cover_url}
                alt={profile.car_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-900 to-sky-950 text-sky-400">
                <Car size={48} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/30" />

            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-sm backdrop-blur-md">
              <Car size={13} className="text-sky-500" /> Zia Car
            </div>
          </div>

          {/* Profile Header (Avatar + Driver Name + Plate) */}
          <div className="px-6 relative z-10 -mt-10">
            <div className="flex items-end justify-between">
              <div className="relative size-20 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.driver_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center bg-sky-50 text-2xl font-black text-sky-600">
                    {profile.driver_name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-right shadow-sm">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Parkinqdədir
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-2xl font-black tracking-tight text-slate-950 leading-tight">
                {profile.driver_name}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-sky-100 border border-sky-200 px-3 py-0.5 text-xs font-black text-sky-800 uppercase tracking-widest">
                  🚘 {profile.plate}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {profile.car_name}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="px-6 mt-6 space-y-3">
            {/* Call 1 */}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="flex h-14 w-full items-center justify-between rounded-2xl bg-sky-500 px-5 font-extrabold text-white shadow-lg shadow-sky-500/25 transition duration-200 hover:bg-sky-400 active:scale-95"
              >
                <span className="flex items-center gap-3 text-sm">
                  <Phone size={19} /> Zəng et (Sürücü)
                </span>
                <span className="text-xs font-bold opacity-90">{profile.phone}</span>
              </a>
            )}



            {/* WhatsApp */}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 w-full items-center justify-between rounded-2xl bg-emerald-600 px-5 font-extrabold text-white shadow-lg shadow-emerald-600/25 transition duration-200 hover:bg-emerald-500 active:scale-95"
              >
                <span className="flex items-center gap-3 text-sm">
                  <MessageCircle size={19} /> WhatsApp ilə yaz
                </span>
                <ExternalLink size={16} className="opacity-80" />
              </a>
            )}

            {/* vCard Save Contact */}
            <button
              type="button"
              onClick={handleDownloadVcard}
              className="flex h-14 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 font-bold text-slate-800 shadow-sm transition hover:border-slate-300 active:scale-95"
            >
              <span className="flex items-center gap-3 text-sm">
                <UserPlus size={19} className="text-sky-500" /> Kontaktı Yadda Saxla
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">vCard</span>
            </button>
          </div>

          {/* Social Networks & Location */}
          {(profile.instagram || profile.tiktok || profile.telegram || profile.waze) && (
            <div className="px-6 mt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Sosial Şəbəkələr & Naviqasiya
              </p>
              <div className="grid grid-cols-4 gap-2">
                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-pink-300 hover:text-pink-600"
                    title="Instagram"
                  >
                    <Instagram size={22} className="text-pink-500" />
                    <span className="mt-1 text-[9px] font-bold">Instagram</span>
                  </a>
                )}

                {profile.tiktok && (
                  <a
                    href={profile.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-slate-400"
                    title="TikTok"
                  >
                    <Music2 size={22} className="text-slate-900" />
                    <span className="mt-1 text-[9px] font-bold">TikTok</span>
                  </a>
                )}

                {profile.telegram && (
                  <a
                    href={profile.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-600"
                    title="Telegram"
                  >
                    <Zap size={22} className="text-sky-500" />
                    <span className="mt-1 text-[9px] font-bold">Telegram</span>
                  </a>
                )}

                {profile.waze && (
                  <a
                    href={profile.waze}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
                    title="Waze"
                  >
                    <Navigation size={22} className="text-blue-500" />
                    <span className="mt-1 text-[9px] font-bold">Waze</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Share Button */}
          <div className="px-6 mt-5">
            <button
              onClick={handleShare}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
            >
              <Share2 size={16} /> {copied ? "Profil keçidi kopyalandı!" : "Profili Paylaş"}
            </button>
          </div>

          {/* Card Footer */}
          <div className="px-6 py-6 mt-4 border-t border-slate-100 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="Zia NFC"
                width={18}
                height={18}
                className="size-4.5 rounded-full object-cover"
              />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                Powered by <span className="text-slate-900 font-black">Zia NFC</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
