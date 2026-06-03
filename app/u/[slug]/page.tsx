import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl, getProfileVcardPath } from "@/lib/urls";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Award,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
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
    width: 220,
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
    <main className="executive-profile-shell min-h-screen overflow-hidden text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-[-18rem] top-52 h-[34rem] w-[34rem] rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-16rem] h-[34rem] w-[34rem] rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <nav className="flex items-center justify-between gap-4 rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-2xl">
          <Link
            href="/"
            className="inline-flex items-center rounded-full px-3 py-2 text-sm font-black text-slate-600 transition duration-150 ease-out hover:bg-slate-100 hover:text-slate-950 active:scale-[0.97]"
          >
            ← Zia NFC
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white shadow-sm">
            <ShieldCheck size={14} className="text-cyan-300" /> Verified profile
          </div>
        </nav>

        <section className="executive-card-enter mt-6 overflow-hidden rounded-[2.4rem] border border-white/80 bg-white/90 shadow-[0_34px_120px_rgba(15,23,42,0.12)] backdrop-blur-2xl lg:rounded-[3rem]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="relative min-h-[34rem] overflow-hidden bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
              <div
                className="absolute inset-0 opacity-75"
                style={
                  profile.background_url
                    ? {
                        background: `linear-gradient(90deg, rgba(2,6,23,0.92), rgba(2,6,23,0.68), rgba(2,6,23,0.38)), url("${profile.background_url}") center/cover no-repeat`,
                      }
                    : undefined
                }
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_80%_12%,rgba(16,185,129,0.18),transparent_28%),linear-gradient(135deg,rgba(2,6,23,0.95),rgba(15,23,42,0.72))]" />

              <div className="relative flex h-full flex-col justify-between gap-12">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    icon={<Sparkles size={14} />}
                    label="Premium digital identity"
                  />
                  {profile.location ? (
                    <Badge
                      icon={<MapPin size={14} />}
                      label={profile.location}
                    />
                  ) : null}
                </div>

                <div className="max-w-3xl">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="size-28 rounded-[2rem] border border-white/30 object-cover shadow-[0_22px_70px_rgba(0,0,0,0.34)] ring-4 ring-white/10 sm:size-32"
                      />
                    ) : (
                      <div className="grid size-28 place-items-center rounded-[2rem] border border-white/30 bg-white text-5xl font-black text-slate-950 shadow-[0_22px_70px_rgba(0,0,0,0.34)] ring-4 ring-white/10 sm:size-32">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      {profile.profession ? (
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
                          {profile.profession}
                        </p>
                      ) : null}
                      <h1 className="mt-3 text-5xl font-black leading-[0.92] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                        {profile.name}
                      </h1>
                    </div>
                  </div>

                  {profile.bio ? (
                    <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-200 sm:text-xl">
                      {profile.bio}
                    </p>
                  ) : null}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                        tone="light"
                      />
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Metric
                    icon={<Award size={18} />}
                    value="Premium"
                    label="Profile quality"
                  />
                  <Metric
                    icon={<Star size={18} />}
                    value={String(profile.gallery.length)}
                    label="Portfolio items"
                  />
                  <Metric
                    icon={<QrCode size={18} />}
                    value="QR"
                    label="Instant access"
                  />
                </div>
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-white p-6 lg:border-l lg:border-t-0 lg:p-7">
              <div className="lg:sticky lg:top-8">
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Contact hub
                  </p>
                  <div className="mt-4 grid gap-3">
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
                      label="Kontaktı yadda saxla"
                      local
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img
                      src={qr}
                      alt={`${profile.name} QR code`}
                      className="size-28 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200"
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
            </aside>
          </div>
        </section>

        {profile.gallery.length > 0 ? (
          <section className="mt-8 rounded-[2.4rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_90px_rgba(15,23,42,0.09)] backdrop-blur-2xl sm:p-6 lg:rounded-[3rem] lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">
                  Selected portfolio
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                  Görülən işlər
                </h2>
              </div>
              <p className="max-w-xl text-base font-semibold leading-7 text-slate-500">
                Portfolio vizualları böyük preview və təmiz grid sistemi ilə
                təqdim olunur ki, müştəri işi saniyələr içində anlaya bilsin.
              </p>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-12">
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
      </div>
    </main>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl">
      {icon} {label}
    </span>
  );
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-cyan-200">
        {icon}
        <span className="text-xl font-black text-white">{value}</span>
      </div>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/60">
        {label}
      </p>
    </div>
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
  tone: "emerald" | "light";
}) {
  const className =
    tone === "emerald"
      ? "bg-emerald-400 text-slate-950 shadow-[0_18px_48px_rgba(52,211,153,0.34)] hover:bg-emerald-300"
      : "bg-white text-slate-950 shadow-[0_18px_48px_rgba(255,255,255,0.18)] hover:bg-slate-100";

  return (
    <a
      href={href}
      className={`premium-cta relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-4 text-base font-black transition duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${className}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {icon} {label}
      </span>
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
      className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm transition duration-150 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
    >
      <span className="inline-flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-slate-950 group-hover:text-white">
          {icon}
        </span>
        {label}
      </span>
      <ArrowUpRight
        size={16}
        className="text-slate-400 transition group-hover:text-slate-950"
      />
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
  const size =
    index === 0
      ? "lg:col-span-7 lg:row-span-2"
      : index === 1
        ? "lg:col-span-5"
        : "lg:col-span-4";
  const aspect = index === 0 ? "aspect-[16/11] lg:h-full" : "aspect-[4/3]";

  return (
    <a
      href={image}
      target="_blank"
      rel="noreferrer"
      className={`${size} group relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm ring-1 ring-slate-200 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.18)] active:scale-[0.99]`}
    >
      <img
        src={image}
        alt={`${name} portfolio ${index + 1}`}
        className={`${aspect} w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/0 to-white/0 opacity-0 transition duration-200 ease-out group-hover:opacity-100" />
      <div className="absolute bottom-4 left-4 right-4 flex translate-y-2 items-center justify-between rounded-2xl border border-white/20 bg-white/20 px-4 py-3 text-white opacity-0 backdrop-blur-xl transition duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <span className="text-sm font-black">View project</span>
        <ArrowUpRight size={17} />
      </div>
    </a>
  );
}
