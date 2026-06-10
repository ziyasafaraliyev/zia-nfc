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
    width: 220,
    color: { dark: "#e2e8f0", light: "#00000000" },
  });
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
    <main className="lux-shell relative min-h-screen overflow-x-hidden">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

      <div className="relative z-10 mx-auto max-w-[440px] px-4 py-6 pb-36">

        {/* ── COVER + IDENTITY CARD ── */}
        <section className="lux-card lux-card-enter overflow-hidden rounded-[2.25rem]">
          {/* Cover image zone */}
          <div
            className={`${profile.background_url ? "bg-[#060a12]" : "lux-hero"} relative ${coverH} overflow-hidden`}
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
              <div className="lux-badge flex items-center gap-1.5 rounded-full px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 lux-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/90">
                  Zia NFC
                </span>
              </div>
              <div className="lux-badge-verified flex items-center gap-1.5 rounded-full px-3 py-1.5">
                <Sparkles size={9} className="text-amber-300" />
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-amber-200/90">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Identity strip */}
          <div className="lux-identity px-5 pb-6 pt-0">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="-mt-16 shrink-0">
                {profile.avatar_url ? (
                  <div className="lux-avatar-ring p-[3px] rounded-[1.7rem]">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="size-[7rem] rounded-[1.55rem] object-cover"
                    />
                  </div>
                ) : (
                  <div className="lux-avatar-ring p-[3px] rounded-[1.7rem]">
                    <div className="grid size-[7rem] place-items-center rounded-[1.55rem] lux-avatar-fallback text-4xl font-black text-white">
                      {profile.name.charAt(0)}
                    </div>
                  </div>
                )}
              </div>

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

            {/* Location */}
            {profile.location ? (
              <div className="mt-3.5 inline-flex items-center gap-1.5 lux-location-chip rounded-full px-3 py-1.5">
                <MapPin size={11} className="text-cyan-400/80 shrink-0" />
                <span className="text-[11px] font-semibold tracking-wide text-slate-300/80 truncate">
                  {profile.location}
                </span>
              </div>
            ) : null}
          </div>
        </section>

        {/* ── PRIMARY ACTION BUTTONS ── */}
        {whatsapp || profile.phone ? (
          <div className="mt-3 grid gap-2.5" style={{ gridTemplateColumns: whatsapp && profile.phone ? "1fr 1fr" : "1fr" }}>
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}`}
                className="lux-btn-whatsapp group lux-card-enter-2"
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
                className="lux-btn-call group lux-card-enter-3"
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

        {/* ── SAVE CONTACT ── */}
        <a
          href={getProfileVcardPath(profile.slug)}
          className="lux-save-contact group mt-2.5 flex min-h-[3.5rem] w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4"
        >
          <span className="flex items-center gap-3">
            <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
              <UserPlus size={16} />
            </span>
            <span className="text-sm font-bold text-slate-200">Kontaktı yadda saxla</span>
          </span>
          <ExternalLink
            size={15}
            className="text-slate-500 transition-all duration-300 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>

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
          </div>
        ) : null}

        {/* ── PORTFOLIO ── */}
        {profile.gallery.length > 0 ? (
          <section className="mt-6 lux-card-enter-6">
            {/* Section header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="lux-overline">Selected work</p>
                <h2 className="lux-section-title mt-1">Portfolio</h2>
              </div>
              <span className="lux-count-badge rounded-full px-3 py-1 text-xs font-bold">
                {profile.gallery.length} iş
              </span>
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {profile.gallery.map((image, index) => (
                <a
                  key={image}
                  href={image}
                  target="_blank"
                  rel="noreferrer"
                  className={`${index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"} group relative overflow-hidden rounded-[1.5rem] lux-gallery-item`}
                >
                  <img
                    src={image}
                    alt={`${profile.name} — iş ${index + 1}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-3 right-3 flex size-8 translate-y-2 items-center justify-center rounded-full lux-gallery-btn opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={14} />
                  </div>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── QR CODE CARD ── */}
        <div className="mt-5 lux-qr-card flex items-center gap-5 rounded-2xl p-4 lux-card-enter-7">
          <div className="lux-qr-wrap shrink-0 rounded-xl p-2">
            <img
              src={qr}
              alt={`${profile.name} QR`}
              className="size-[4.5rem] rounded-lg"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <QrCode size={14} className="text-cyan-400 shrink-0" />
              <span>QR kod</span>
            </div>
            <p className="mt-1 text-[11px] font-medium leading-[1.6] text-slate-500">
              NFC işləmədikdə kamera ilə skan edin.
            </p>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-6 flex flex-col items-center gap-1.5">
          <div className="lux-footer-divider" />
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
            Powered by{" "}
            <span className="lux-brand-text">Zia NFC</span>
          </p>
        </div>
      </div>

      {/* ── STICKY BOTTOM CTA ── */}
      {whatsapp || profile.phone ? (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-safe-bottom">
          <div className="mx-auto max-w-[440px] pb-4 pt-2">
            <div className="lux-sticky-bar overflow-hidden rounded-[1.75rem] p-2">
              <div
                className={`grid gap-2 ${whatsapp && profile.phone ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {whatsapp ? (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    className="flex min-h-[3rem] items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-sm font-black text-white transition-all duration-200 active:scale-[0.96] hover:brightness-110"
                  >
                    <MessageCircle size={17} /> WhatsApp
                  </a>
                ) : null}
                {profile.phone ? (
                  <a
                    href={`tel:${profile.phone}`}
                    className="lux-sticky-call flex min-h-[3rem] items-center justify-center gap-2 rounded-2xl text-sm font-black text-white transition-all duration-200 active:scale-[0.96]"
                  >
                    <Phone size={17} /> Zəng et
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
  variant,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  variant: "instagram" | "tiktok" | "website";
}) {
  const variantClass = {
    instagram: "lux-social-instagram",
    tiktok: "lux-social-tiktok",
    website: "lux-social-website",
  }[variant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`lux-social-chip ${variantClass} group flex min-h-[3.75rem] flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-200 active:scale-[0.95]`}
    >
      <span className="lux-social-icon transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <span className="text-[10px] font-bold tracking-wide text-slate-300">{label}</span>
    </a>
  );
}
