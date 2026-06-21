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
  Sparkles,
  ExternalLink,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-react";
import { notFound } from "next/navigation";
import QrCodeModal from "@/components/qr-code-modal";
import PortfolioSection from "@/components/portfolio-section";
import ReservationButton from "@/components/reservation-button";


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
  // QR-ı DataURL kimi yükləmək bəzi hallarda “başqa linkdə ayrıca şəkil” kimi açılma davranışı yarada bilər.
  // Bunun yerinə QR-ı image route-dan PNG kimi serv edirik.
  const qrUrl = `/u/${profile.slug}/qr`;

  const whatsapp = profile.whatsapp?.replace(/[^\d]/g, "");

  const coverStyle = profile.cover_style ?? "auto";
  const coverPosition = profile.cover_position ?? "center";
  const coverH =
    coverStyle === "banner"
      ? "h-52"
      : coverStyle === "square"
        ? "h-[30rem]"
        : "h-[24rem]";
  const objPos =
    coverPosition === "top"
      ? "object-top"
      : coverPosition === "bottom"
        ? "object-bottom"
        : "object-center";

  const sameAs = [
    profile.instagram,
    profile.tiktok,
    profile.website,
    profile.facebook,
    profile.x,
    profile.linkedin,
    profile.youtube,
    profile.whatsapp ? (profile.whatsapp.startsWith("http") ? profile.whatsapp : `https://wa.me/${profile.whatsapp.replace(/[^\d]/g, "")}`) : null,
  ].filter(Boolean) as string[];
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

  const hasSocials =
    profile.instagram ||
    profile.tiktok ||
    profile.website ||
    profile.facebook ||
    profile.x ||
    profile.linkedin ||
    profile.youtube;

  const themeClass =
    profile.theme && profile.theme !== "light" ? `${profile.theme}-theme` : "";

  return (
    <main className={`lux-shell relative min-h-screen overflow-x-hidden ${themeClass}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026"),
        }}
      />

      {/* ── DEEP AMBIENT ATMOSPHERE ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Primary orb */}
        <div className="lux-orb-1 absolute -top-32 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full" />
        {/* Secondary orb */}
        <div className="lux-orb-2 absolute right-[-15%] top-[20%] h-[28rem] w-[28rem] rounded-full" />
        {/* Tertiary orb */}
        <div className="lux-orb-3 absolute bottom-[-8%] left-[-12%] h-[32rem] w-[32rem] rounded-full" />
        {/* Grid overlay */}
        <div className="lux-grid absolute inset-0" />
        {/* Noise texture */}
        <div className="lux-noise absolute inset-0 opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[440px] px-4 py-6 pb-16">

        {/* ── COVER + IDENTITY CARD ── */}
        <section className="lux-card lux-card-enter overflow-hidden rounded-b-[2.25rem] rounded-t-none">
          {/* Cover image zone */}
          <div
            className={`${profile.background_url ? "bg-[#1e1b4b]" : "lux-hero"} relative ${coverH} overflow-hidden`}
          >
            {profile.background_url ? (
              <>
                <img
                  src={profile.background_url}
                  alt=""
                  role="presentation"
                  className={`absolute inset-0 h-full w-full object-cover ${objPos} opacity-70`}
                />
                {/* Gradient overlay on cover image */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
              </>
            ) : null}

            {/* Animated shimmer overlay */}
            <div className="lux-cover-shimmer absolute inset-0" />

            {/* Top bar */}
            <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
              <div className="lux-badge flex items-center gap-1.5 rounded-full px-2 py-1.5 pr-3">
                <img src="/logo.png" alt="Zia NFC" className="size-[18px] rounded-full object-cover" />
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/90">
                  Zia NFC
                </span>
              </div>
            </div>
          </div>

          {/* Identity strip */}
          <div className={`lux-identity px-5 pb-6 ${profile.avatar_url ? "pt-0" : "pt-5"}`}>
            <div className="flex items-end gap-4">
              {/* Avatar */}
              {profile.avatar_url ? (
                <div className="-mt-16 shrink-0 relative z-10">
                  <div className="lux-avatar-ring p-[3px] rounded-[1.7rem]">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="size-[7rem] rounded-[1.55rem] object-cover"
                    />
                  </div>
                </div>
              ) : null}

              {/* Name + title */}
              <div className="pb-1 min-w-0">
                {profile.profession ? (
                  <p className="lux-overline truncate">
                    {profile.profession}
                  </p>
                ) : null}
                <h1 className="lux-name mt-1 leading-[1.1]">
                  {profile.name}
                </h1>
              </div>
            </div>

            {/* Bio */}
            {profile.bio ? (
              <p className="lux-bio mt-4">
                {profile.bio}
              </p>
            ) : null}

          </div>
        </section>

        {/* ── PRIMARY ACTION BUTTONS ── */}
        {whatsapp || profile.phone ? (
          <div className="mt-3 grid gap-2.5" style={{ gridTemplateColumns: whatsapp && profile.phone ? "1fr 1fr" : "1fr" }}>
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}`}
                className="lux-btn-whatsapp group lux-card-enter-2 transition-transform duration-200 hover:scale-[1.02]"
              >
                <MessageCircle
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
                />
                <span>WhatsApp</span>
              </a>
            ) : null}
            {profile.phone ? (
              <a
                href={`tel:${profile.phone}`}
                className="lux-btn-call group lux-card-enter-3 transition-transform duration-200 hover:scale-[1.02]"
              >
                <Phone
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span>Zəng et</span>
              </a>
            ) : null}
          </div>
        ) : null}



        {/* ── SOCIAL LINKS ── */}
        {hasSocials ? (
          <div className="mt-3 grid grid-cols-3 gap-2 lux-card-enter-5">
            {profile.instagram ? (
              <SocialChip
                href={profile.instagram}
                icon={<Instagram size={18} />}
                label="Instagram"
                variant="instagram"
              />
            ) : null}
            {profile.tiktok ? (
              <SocialChip
                href={profile.tiktok}
                icon={<Music2 size={18} />}
                label="TikTok"
                variant="tiktok"
              />
            ) : null}
            {profile.website ? (
              <SocialChip
                href={profile.website}
                icon={<Globe size={18} />}
                label="Website"
                variant="website"
              />
            ) : null}
            {profile.facebook ? (
              <SocialChip
                href={profile.facebook}
                icon={<Facebook size={18} />}
                label="Facebook"
                variant="facebook"
              />
            ) : null}
            {profile.x ? (
              <SocialChip
                href={profile.x}
                icon={<Twitter size={18} />}
                label="X"
                variant="x"
              />
            ) : null}
            {profile.linkedin ? (
              <SocialChip
                href={profile.linkedin}
                icon={<Linkedin size={18} />}
                label="LinkedIn"
                variant="linkedin"
              />
            ) : null}
            {profile.youtube ? (
              <SocialChip
                href={profile.youtube}
                icon={<Youtube size={18} />}
                label="YouTube"
                variant="youtube"
              />
            ) : null}
          </div>
        ) : null}

        {/* ── SAVE CONTACT ── */}
        <a
          href={getProfileVcardPath(profile.slug)}
          className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="flex items-center gap-3">
            <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
              <UserPlus size={16} />
            </span>
            <span className="text-sm font-bold text-gray-800">Kontaktı yadda saxla</span>
          </span>
          <ExternalLink
            size={15}
            className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>

        {/* ── RESERVATION BUTTON ── */}
        {profile.reservation_enabled && profile.whatsapp ? (
          <ReservationButton
            profileName={profile.name}
            whatsappNumber={profile.whatsapp}
          />
        ) : null}

        {/* ── MAPS LOCATION BUTTON ── */}
        {profile.location && profile.location_url ? (
          <a
            href={profile.location_url}
            target="_blank"
            rel="noreferrer"
            className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
          >
            <span className="flex items-center gap-3">
              <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
                <MapPin size={16} className="text-[#29AEEE]" />
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-gray-800">Lokasiya</span>
                <span className="text-[10px] font-semibold text-gray-400 mt-0.5">{profile.location}</span>
              </span>
            </span>
            <ExternalLink
              size={15}
              className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        ) : null}

        {/* ── PORTFOLIO ── */}
        {profile.gallery.length > 0 ? (
          <PortfolioSection gallery={profile.gallery} profileName={profile.name} />
        ) : null}

        {/* ── CV YÜKLƏ ── */}
        {profile.cv_url ? (
          <a
            href={profile.cv_url}
            target="_blank"
            rel="noreferrer"
            className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
          >
            <span className="flex items-center gap-3">
              <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" /></svg>
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-gray-800">CV (Resüme)</span>
                <span className="text-[10px] font-semibold text-gray-400 mt-0.5">PDF formatında endir / bax</span>
              </span>
            </span>
            <ExternalLink
              size={15}
              className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        ) : null}

        {/* ── QR CODE CARD ── */}
        <QrCodeModal qrUrl={qrUrl} profileName={profile.name} />

        {/* ── FOOTER ── */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="lux-footer-divider" />
          <div className="mt-2 flex items-center gap-1.5">
            <img src="/logo.png" alt="Zia NFC" className="size-4 rounded-full object-cover opacity-60" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              Powered by <span className="lux-brand-text">Zia NFC</span>
            </p>
          </div>
        </div>
      </div>

    </main>
  );
}

function SocialChip({
  href,
  icon,
  label,
  variant,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  variant:
  | "instagram"
  | "tiktok"
  | "website"
  | "facebook"
  | "x"
  | "linkedin"
  | "youtube"
  | "whatsapp";
}) {
  const variantClass = {
    instagram: "lux-social-instagram",
    tiktok: "lux-social-tiktok",
    website: "lux-social-website",
    facebook: "lux-social-facebook",
    x: "lux-social-x",
    linkedin: "lux-social-linkedin",
    youtube: "lux-social-youtube",
    whatsapp: "lux-social-whatsapp",
  }[variant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`lux-social-chip ${variantClass} group flex min-h-[3.75rem] flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.95]`}
    >
      <span className="lux-social-icon transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <span className="text-[10px] font-bold tracking-wide text-gray-500">{label}</span>
    </a>
  );
}
