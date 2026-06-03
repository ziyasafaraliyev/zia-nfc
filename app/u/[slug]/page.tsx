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
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

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
  const title = `${profile.name}${profile.profession ? ` | ${profile.profession}` : " | Digital Portfolio"}`;
  const description =
    profile.bio ||
    `${profile.name} üçün rəqəmsal profil, portfolio, əlaqə məlumatları və sosial linklər.`;
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

  if (!profile || !profile.enabled) {
    notFound();
  }

  const profileUrl = getProfileUrl(profile.slug);
  const qr = await QRCode.toDataURL(profileUrl, {
    margin: 1,
    width: 200,
    color: { dark: "#020617", light: "#ffffff" },
  });
  const whatsapp = profile.whatsapp?.replace(/[^\d]/g, "");
  const sameAs = [profile.instagram, profile.tiktok, profile.website].filter(
    Boolean,
  ) as string[];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.profession || undefined,
    description: profile.bio || undefined,
    url: profileUrl,
    image: profile.avatar_url || undefined,
    telephone: profile.phone || profile.whatsapp || undefined,
    address: profile.location || undefined,
    sameAs,
  };

  return (
    <main className="mobile-profile-shell min-h-screen overflow-hidden px-3 py-3 text-white sm:px-4 sm:py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-10rem] h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-28 top-56 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[430px] pb-28">
        <nav className="mb-3 flex items-center justify-between gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-2xl">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-black text-white/75 transition duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-[0.97]"
          >
            ← Zia NFC
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-950 shadow-sm">
            <ShieldCheck size={14} className="text-cyan-600" /> Verified
          </span>
        </nav>

        <section className="profile-card-enter overflow-hidden rounded-[2.25rem] border border-white/15 bg-white text-slate-950 shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
          <div
            className="profile-hero relative h-[25rem] overflow-hidden"
            style={
              profile.background_url
                ? {
                    background: `linear-gradient(180deg, rgba(2,6,23,0.06), rgba(2,6,23,0.82)), url("${profile.background_url}") center/cover no-repeat`,
                  }
                : undefined
            }
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(34,211,238,0.26),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0.86)_100%)]" />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/15 bg-white/15 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur-xl">
                Digital profile
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/15 px-3 py-1.5 text-xs font-bold text-white/90 backdrop-blur-xl">
                <Sparkles size={13} /> Premium
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-5">
              <div className="flex items-end gap-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="size-28 rounded-[2rem] border-4 border-white object-cover shadow-[0_18px_60px_rgba(0,0,0,0.34)]"
                  />
                ) : (
                  <div className="grid size-28 place-items-center rounded-[2rem] border-4 border-white bg-cyan-300 text-5xl font-black text-slate-950 shadow-[0_18px_60px_rgba(0,0,0,0.34)]">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 pb-1 text-white">
                  {profile.profession ? (
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                      {profile.profession}
                    </p>
                  ) : null}
                  <h1 className="mt-1 text-4xl font-black leading-[0.92] tracking-[-0.04em]">
                    {profile.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 pb-6 pt-5">
            {profile.bio || profile.location ? (
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                {profile.bio ? (
                  <p className="text-[15px] font-medium leading-7 text-slate-600">
                    {profile.bio}
                  </p>
                ) : null}
                {profile.location ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm">
                    <MapPin size={16} className="text-cyan-700" />{" "}
                    {profile.location}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              {whatsapp ? (
                <PrimaryAction
                  href={`https://wa.me/${whatsapp}`}
                  icon={<MessageCircle size={20} />}
                  label="WhatsApp ilə əlaqə"
                  tone="emerald"
                />
              ) : null}
              {profile.phone ? (
                <PrimaryAction
                  href={`tel:${profile.phone}`}
                  icon={<Phone size={20} />}
                  label="Zəng et"
                  tone="dark"
                />
              ) : null}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {profile.instagram ? (
                <Social
                  href={profile.instagram}
                  icon={<Instagram size={18} />}
                  label="Instagram"
                />
              ) : null}
              {profile.tiktok ? (
                <Social
                  href={profile.tiktok}
                  icon={<Music2 size={18} />}
                  label="TikTok"
                />
              ) : null}
              {profile.website ? (
                <Social
                  href={profile.website}
                  icon={<Globe size={18} />}
                  label="Website"
                />
              ) : null}
              <Social
                href={getProfileVcardPath(profile.slug)}
                icon={<UserPlus size={18} />}
                label="Kontakt saxla"
                local
              />
            </div>

            {profile.gallery.length > 0 ? (
              <section className="mt-8">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
                      Portfolio
                    </p>
                    <h2 className="mt-1 text-2xl font-black tracking-[-0.03em]">
                      Görülən işlər
                    </h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                    {profile.gallery.length} şəkil
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-6 gap-2.5">
                  {profile.gallery.map((image, index) => (
                    <PortfolioItem
                      key={image}
                      image={image}
                      name={profile.name}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc,#ffffff)] p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={qr}
                  alt={`${profile.name} QR code`}
                  className="size-24 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                    <QrCode size={16} className="text-cyan-700" /> QR kod
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    NFC işləmədikdə kamera ilə skan edin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {whatsapp || profile.phone ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/75 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-2xl">
          <div className="mx-auto grid max-w-[430px] grid-cols-2 gap-2">
            {whatsapp ? (
              <StickyAction
                href={`https://wa.me/${whatsapp}`}
                icon={<MessageCircle size={18} />}
                label="WhatsApp"
                tone="emerald"
              />
            ) : null}
            {profile.phone ? (
              <StickyAction
                href={`tel:${profile.phone}`}
                icon={<Phone size={18} />}
                label="Zəng et"
                tone="light"
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}

function PrimaryAction({
  href,
  icon,
  label,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  tone: "emerald" | "dark";
}) {
  const className =
    tone === "emerald"
      ? "bg-emerald-400 text-slate-950 shadow-[0_18px_45px_rgba(52,211,153,0.34)] hover:bg-emerald-300"
      : "bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.2)] hover:bg-slate-800";

  return (
    <a
      href={href}
      className={`premium-cta relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 py-4 text-base font-black transition duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${className}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {icon} {label}
      </span>
    </a>
  );
}

function StickyAction({
  href,
  icon,
  label,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  tone: "emerald" | "light";
}) {
  const className =
    tone === "emerald"
      ? "bg-emerald-400 text-slate-950"
      : "bg-white text-slate-950";

  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black shadow-sm transition duration-150 ease-out active:scale-[0.97] ${className}`}
    >
      {icon} {label}
    </a>
  );
}

function Social({
  href,
  icon,
  label,
  local = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  local?: boolean;
}) {
  return (
    <a
      href={href}
      target={local ? undefined : "_blank"}
      rel={local ? undefined : "noreferrer"}
      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-black text-slate-800 shadow-sm transition duration-150 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.97]"
    >
      <span className="text-slate-500 transition-colors duration-150 ease-out group-hover:text-cyan-700">
        {icon}
      </span>{" "}
      {label}
    </a>
  );
}

function PortfolioItem({
  image,
  name,
  index,
}: {
  image: string;
  name: string;
  index: number;
}) {
  const span = index === 0 ? "col-span-6" : "col-span-3";
  const aspect = index === 0 ? "aspect-[16/10]" : "aspect-square";

  return (
    <a
      href={image}
      target="_blank"
      rel="noreferrer"
      className={`${span} group relative overflow-hidden rounded-[1.35rem] bg-slate-100 shadow-sm ring-1 ring-slate-200 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.16)] active:scale-[0.99]`}
    >
      <img
        src={image}
        alt={`${name} portfolio ${index + 1}`}
        className={`${aspect} w-full object-cover transition duration-300 ease-out group-hover:scale-[1.035]`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-white/0 opacity-0 transition duration-200 ease-out group-hover:opacity-100" />
      <div className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-between rounded-2xl border border-white/20 bg-white/20 px-3 py-2 text-white opacity-0 backdrop-blur-xl transition duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <span className="text-xs font-black">Bax</span>
        <ArrowUpRight size={15} />
      </div>
    </a>
  );
}
