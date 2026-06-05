import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl, getProfileVcardPath } from "@/lib/urls";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  QrCode,
  UserPlus,
} from "lucide-react";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile || !profile.enabled) {
    return {
      title: "Profil tapılmadı | Zia NFC",
      robots: { index: false, follow: false },
    };
  }
  const profileUrl = getProfileUrl(profile.slug);
  const title = `${profile.name}${profile.profession ? ` — ${profile.profession}` : ""}`;
  const description =
    profile.bio || `${profile.name} rəqəmsal profil, portfolio və əlaqə.`;
  const image = profile.avatar_url || profile.background_url || undefined;
  return {
    title,
    description,
    alternates: { canonical: profileUrl },
    openGraph: {
      title,
      description,
      url: profileUrl,
      siteName: "Zia NFC",
      type: "profile",
      images: image ? [{ url: image, alt: profile.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile || !profile.enabled) notFound();

  const profileUrl = getProfileUrl(profile.slug);
  const qr = await QRCode.toDataURL(profileUrl, {
    margin: 1,
    width: 200,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
  const whatsapp = profile.whatsapp?.replace(/[^\d]/g, "");

  const coverStyle = profile.cover_style ?? "auto";
  const coverPosition = profile.cover_position ?? "center";
  const coverH =
    coverStyle === "banner"
      ? "h-52"
      : coverStyle === "square"
        ? "h-[28rem]"
        : "h-[22rem]";
  const objPos =
    coverPosition === "top"
      ? "object-top"
      : coverPosition === "bottom"
        ? "object-bottom"
        : "object-center";

  const sameAs = [profile.instagram, profile.tiktok, profile.website].filter(
    Boolean,
  ) as string[];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.profession ?? undefined,
    description: profile.bio ?? undefined,
    url: profileUrl,
    image: profile.avatar_url ?? undefined,
    telephone: profile.phone ?? profile.whatsapp ?? undefined,
    address: profile.location ?? undefined,
    sameAs,
  };

  const hasSocials = profile.instagram || profile.tiktok || profile.website;

  return (
    <main className="ceo-shell relative min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[96px]" />
        <div className="absolute right-[-20%] top-[30%] h-80 w-80 rounded-full bg-violet-500/10 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-emerald-500/10 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[420px] px-4 py-5 pb-32">
        {/* ── COVER + IDENTITY ───────────────────────────── */}
        <section className="ceo-card overflow-hidden rounded-[2rem]">
          {/* cover */}
          <div
            className={`${profile.background_url ? "bg-slate-950" : "ceo-hero"} relative ${coverH} overflow-hidden`}
          >
            {profile.background_url ? (
              <img
                src={profile.background_url}
                alt=""
                role="presentation"
                className={`absolute inset-0 h-full w-full object-cover ${objPos}`}
              />
            ) : null}
            <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
              <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
                Zia NFC
              </span>
              <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                Verified ✦
              </span>
            </div>
          </div>

          {/* identity strip */}
          <div className="ceo-identity px-5 pb-5 pt-0">
            <div className="flex items-end gap-4">
              <div className="-mt-14 shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="size-[6.5rem] rounded-[1.6rem] border-4 border-white object-cover shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
                  />
                ) : (
                  <div className="grid size-[6.5rem] place-items-center rounded-[1.6rem] border-4 border-white bg-gradient-to-br from-cyan-400 to-cyan-600 text-4xl font-black text-white shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="pb-1">
                {profile.profession ? (
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {profile.profession}
                  </p>
                ) : null}
                <h1 className="mt-0.5 text-[1.65rem] font-black leading-tight tracking-[-0.04em] text-slate-950">
                  {profile.name}
                </h1>
              </div>
            </div>

            {profile.bio ? (
              <p className="mt-4 text-sm font-medium leading-[1.75] text-slate-500">
                {profile.bio}
              </p>
            ) : null}

            {profile.location ? (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                <MapPin size={13} className="text-slate-400" />{" "}
                {profile.location}
              </div>
            ) : null}
          </div>
        </section>

        {/* ── PRIMARY ACTIONS ────────────────────────────── */}
        {whatsapp || profile.phone ? (
          <div className="mt-3 grid gap-2.5 grid-cols-2">
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}`}
                className="cta-primary group flex min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-sm font-black text-white shadow-[0_12px_36px_rgba(37,211,102,0.32)] transition duration-150 active:scale-[0.96]"
              >
                <MessageCircle
                  size={18}
                  className="transition-transform duration-200 group-hover:scale-110"
                />{" "}
                WhatsApp
              </a>
            ) : null}
            {profile.phone ? (
              <a
                href={`tel:${profile.phone}`}
                className="cta-primary group flex min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-black text-white shadow-[0_12px_36px_rgba(15,23,42,0.22)] transition duration-150 active:scale-[0.96]"
              >
                <Phone
                  size={18}
                  className="transition-transform duration-200 group-hover:scale-110"
                />{" "}
                Zəng et
              </a>
            ) : null}
          </div>
        ) : null}

        {/* ── SAVE CONTACT ───────────────────────────────── */}
        <a
          href={getProfileVcardPath(profile.slug)}
          className="mt-2.5 flex min-h-[3.25rem] w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 shadow-sm transition duration-150 active:scale-[0.98]"
        >
          <span className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-600">
              <UserPlus size={16} />
            </span>
            Kontaktı yadda saxla
          </span>
          <ArrowUpRight size={16} className="text-slate-400" />
        </a>

        {/* ── SOCIAL LINKS ───────────────────────────────── */}
        {hasSocials ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {profile.instagram ? (
              <SocialChip
                href={profile.instagram}
                icon={<Instagram size={17} />}
                label="Instagram"
              />
            ) : null}
            {profile.tiktok ? (
              <SocialChip
                href={profile.tiktok}
                icon={<Music2 size={17} />}
                label="TikTok"
              />
            ) : null}
            {profile.website ? (
              <SocialChip
                href={profile.website}
                icon={<Globe size={17} />}
                label="Website"
              />
            ) : null}
          </div>
        ) : null}

        {/* ── PORTFOLIO ──────────────────────────────────── */}
        {profile.gallery.length > 0 ? (
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Selected work
                </p>
                <h2 className="mt-0.5 text-xl font-black tracking-[-0.03em] text-slate-950">
                  Portfolio
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                {profile.gallery.length} iş
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {profile.gallery.map((image, index) => (
                <a
                  key={image}
                  href={image}
                  target="_blank"
                  rel="noreferrer"
                  className={`${index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"} group relative overflow-hidden rounded-[1.4rem] bg-slate-100 ring-1 ring-slate-200/60 transition duration-200 active:scale-[0.98]`}
                >
                  <img
                    src={image}
                    alt={`${profile.name} — iş ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-200 group-hover:opacity-100" />
                  <div className="absolute bottom-3 right-3 flex size-8 translate-y-1 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={15} />
                  </div>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── QR ─────────────────────────────────────────── */}
        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <img
            src={qr}
            alt={`${profile.name} QR`}
            className="size-[4.5rem] rounded-xl bg-white ring-1 ring-slate-200"
          />
          <div>
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-950">
              <QrCode size={15} className="text-slate-500" /> QR kod
            </div>
            <p className="mt-1 text-xs font-medium leading-5 text-slate-400">
              NFC işləmədikdə kamera ilə skan edin.
            </p>
          </div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────── */}
        <p className="mt-5 text-center text-[11px] font-bold text-white/30">
          Powered by <span className="text-white/50">Zia NFC</span>
        </p>
      </div>

      {/* ── STICKY CTA ─────────────────────────────────── */}
      {whatsapp || profile.phone ? (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-safe-bottom">
          <div className="mx-auto max-w-[420px] pb-4 pt-2">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-2 shadow-[0_8px_48px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <div
                className={`grid gap-2 ${whatsapp && profile.phone ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {whatsapp ? (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-sm font-black text-white transition duration-150 active:scale-[0.96]"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </a>
                ) : null}
                {profile.phone ? (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-slate-950 transition duration-150 active:scale-[0.96]"
                  >
                    <Phone size={18} /> Zəng et
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function SocialChip({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-2 text-slate-700 shadow-sm transition duration-150 active:scale-[0.96]"
    >
      <span className="text-slate-500">{icon}</span>
      <span className="text-[10px] font-bold">{label}</span>
    </a>
  );
}
