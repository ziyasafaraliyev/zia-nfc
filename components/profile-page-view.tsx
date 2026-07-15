import type { Profile } from "@/lib/types";
import { getProfileVcardPath } from "@/lib/urls";
import {
  ExternalLink,
  Facebook,
  Globe,
  Hash,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Navigation,
  PenTool,
  Phone,
  Twitter,
  UserPlus,
  Youtube,
  Star,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import SmartImage from "@/components/smart-image";

/** Interactive islands — separate chunks, not on critical first paint path */
const PortfolioSection = dynamic(
  () => import("@/components/portfolio-section"),
  { loading: () => null },
);
const QrCodeModal = dynamic(() => import("@/components/qr-code-modal"), {
  loading: () => null,
});
const ReservationButton = dynamic(
  () => import("@/components/reservation-button"),
  { loading: () => null },
);

type Props = {
  profile: Profile;
  profileUrl: string;
  qrUrl: string;
  jsonLd: Record<string, unknown>;
};

const DEFAULT_SECTION_ORDER = [
  "identity",
  "actions",
  "socials",
  "save",
  "location",
  "google_review",
  "cv",
  "reservation",
  "portfolio",
  "qr",
  "footer",
] as const;

export default function ProfilePageView({
  profile,
  qrUrl,
  jsonLd,
}: Props) {
  const whatsapp = profile.whatsapp?.replace(/[^\d]/g, "");
  const whatsapp2 = profile.whatsapp2?.replace(/[^\d]/g, "");

  const coverStyle = profile.cover_style ?? "auto";
  const coverPosition = profile.cover_position ?? "center";
  /** Slightly shorter covers on small phones → less paint + smaller LCP surface */
  const coverH =
    coverStyle === "banner"
      ? "h-44 sm:h-52"
      : coverStyle === "square"
        ? "h-[22rem] sm:h-[30rem]"
        : "h-[18rem] sm:h-[24rem]";
  const objPos =
    coverPosition === "top"
      ? "object-top"
      : coverPosition === "bottom"
        ? "object-bottom"
        : "object-center";

  const hasSocials =
    profile.instagram ||
    profile.tiktok ||
    profile.website ||
    profile.facebook ||
    profile.x ||
    profile.linkedin ||
    profile.youtube ||
    profile.behance ||
    profile.threads ||
    profile.waze;

  const themeClass =
    profile.theme && profile.theme !== "light" ? `${profile.theme}-theme` : "";

  const sections: Record<typeof DEFAULT_SECTION_ORDER[number], React.ReactNode> = {
    identity: (
      <section
        key="identity"
        className="lux-card lux-card-enter overflow-hidden rounded-b-[2.25rem] rounded-t-none template-hero-classic"
      >
        <div
          className={`${profile.background_url ? "bg-[#1e1b4b]" : "lux-hero"} relative ${coverH} overflow-hidden`}
        >
          {profile.background_url ? (
            <>
              <SmartImage
                src={profile.background_url}
                alt=""
                role="presentation"
                fill
                priority
                sizes="(max-width: 440px) 100vw, 440px"
                className={`object-cover ${objPos} opacity-70`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
            </>
          ) : null}
          <div className="lux-cover-shimmer absolute inset-0" />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
            <Link
              href="/"
              className="lux-badge flex items-center gap-1.5 rounded-full px-2 py-1.5 pr-3"
            >
              <Image
                src="/logo.webp"
                alt="Zia NFC"
                width={18}
                height={18}
                className="size-[18px] rounded-full object-cover"
              />
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/90">
                Zia NFC
              </span>
            </Link>
          </div>
        </div>

        <div className={`lux-identity px-5 pb-6 ${profile.avatar_url ? "pt-0" : "pt-5"}`}>
          <div className="flex items-end gap-4">
            {profile.avatar_url ? (
              <div className="-mt-16 shrink-0 relative z-10">
                <div className="lux-avatar-ring p-[3px] rounded-[1.7rem]">
                  <SmartImage
                    src={profile.avatar_url}
                    alt={profile.name}
                    width={112}
                    height={112}
                    priority
                    sizes="112px"
                    className="size-[7rem] rounded-[1.55rem] object-cover"
                  />
                </div>
              </div>
            ) : null}
            <div className="pb-1 min-w-0">
              {profile.profession ? (
                <p className="lux-overline truncate">{profile.profession}</p>
              ) : null}
              <h1 className="lux-name mt-1 leading-[1.1]">{profile.name}</h1>
            </div>
          </div>
          {profile.bio ? <p className="lux-bio mt-4">{profile.bio}</p> : null}
        </div>
      </section>
    ),
    actions: (
      <div
        key="actions"
        className="mt-3 grid gap-2.5"
        style={{
          gridTemplateColumns:
            [whatsapp, whatsapp2, profile.phone, profile.phone2, profile.email].filter(Boolean)
              .length > 1
              ? "1fr 1fr"
              : "1fr",
        }}
      >
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
        {whatsapp2 ? (
          <a
            href={`https://wa.me/${whatsapp2}`}
            className="lux-btn-whatsapp group lux-card-enter-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <MessageCircle
              size={18}
              className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
            />
            <span>WhatsApp 2</span>
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
        {profile.phone2 ? (
          <a
            href={`tel:${profile.phone2}`}
            className="lux-btn-call group lux-card-enter-3 transition-transform duration-200 hover:scale-[1.02]"
          >
            <Phone
              size={18}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span>Zəng et 2</span>
          </a>
        ) : null}
      </div>
    ),
    socials: hasSocials ? (
      <div
        key="socials"
        className="mt-3 grid gap-2 lux-card-enter-5 template-social-grid template-social-cols-3"
      >
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
        {profile.email ? (
          <SocialChip
            href={`mailto:${profile.email}`}
            icon={<Mail size={18} />}
            label="E-poçt"
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
        {profile.behance ? (
          <SocialChip
            href={profile.behance}
            icon={<PenTool size={18} />}
            label="Behance"
            variant="behance"
          />
        ) : null}
        {profile.threads ? (
          <SocialChip
            href={profile.threads}
            icon={<Hash size={18} />}
            label="Threads"
            variant="threads"
          />
        ) : null}
        {profile.waze ? (
          <SocialChip
            href={profile.waze}
            icon={<Navigation size={18} />}
            label="Waze"
            variant="waze"
          />
        ) : null}
      </div>
    ) : null,
    save: (
      <a
        key="save"
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
    ),
    reservation:
      profile.reservation_enabled && profile.whatsapp ? (
        <ReservationButton
          key="reservation"
          profileName={profile.name}
          whatsappNumber={profile.whatsapp}
        />
      ) : null,
    location:
      profile.location && profile.location_url ? (
        <a
          key="location"
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
              <span className="text-[10px] font-semibold text-gray-400 mt-0.5">
                {profile.location}
              </span>
            </span>
          </span>
          <ExternalLink
            size={15}
            className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      ) : null,
    google_review:
      profile.google_review_url ? (
        <a
          key="google_review"
          href={profile.google_review_url}
          target="_blank"
          rel="noreferrer"
          className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="flex items-center gap-3">
            <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
              <Star size={16} className="text-[#29AEEE]" />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-sm font-bold text-gray-800">Rəy bildir</span>
              <span className="text-[10px] font-semibold text-gray-400 mt-0.5">
                Google-da bizi qiymətləndirin
              </span>
            </span>
          </span>
          <ExternalLink
            size={15}
            className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      ) : null,
    portfolio:
      profile.gallery.length > 0 ? (
        <PortfolioSection
          key="portfolio"
          gallery={profile.gallery}
          profileName={profile.name}
        />
      ) : null,
    cv: profile.cv_url ? (
      <a
        key="cv"
        href={profile.cv_url}
        target="_blank"
        rel="noreferrer"
        className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
      >
        <span className="flex items-center gap-3">
          <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="m9 15 3 3 3-3" />
            </svg>
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-sm font-bold text-gray-800">CV</span>
            <span className="text-[10px] font-semibold text-gray-400 mt-0.5">
              PDF formatında endir / bax
            </span>
          </span>
        </span>
        <ExternalLink
          size={15}
          className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    ) : null,
    qr: (
      <QrCodeModal
        key="qr"
        qrUrl={qrUrl}
        profileName={profile.name}
        theme={profile.theme}
      />
    ),
    footer: (
      <div key="footer" className="mt-6 flex flex-col items-center gap-2">
        <div className="lux-footer-divider" />
        <div className="mt-2 flex items-center gap-1.5">
          <Link href="/" className="flex items-center gap-1.5">
            <Image
              src="/logo.webp"
              alt="Zia NFC"
              width={16}
              height={16}
              className="size-4 rounded-full object-cover opacity-60"
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              Powered by <span className="lux-brand-text">Zia NFC</span>
            </p>
          </Link>
        </div>
      </div>
    ),
  };

  return (
    <main
      className={`lux-shell relative min-h-screen overflow-x-hidden ${themeClass} template-business`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026"),
        }}
      />

      {/* Ambient decor only on md+ — mobile paint path stays light for NFC opens */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden md:block"
      >
        <div className="lux-orb-1 absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full" />
        <div className="lux-orb-2 absolute right-[-15%] top-[20%] h-[28rem] w-[28rem] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-[440px] px-4 py-6 pb-16">
        {DEFAULT_SECTION_ORDER.map((key) => sections[key])}
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
    | "whatsapp"
    | "behance"
    | "threads"
    | "waze";
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
    behance: "lux-social-website",
    threads: "lux-social-website",
    waze: "lux-social-website",
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