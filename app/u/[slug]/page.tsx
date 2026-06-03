import { getProfileBySlug } from "@/lib/profiles";
import {
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  QrCode,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function ProfilePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;

  const profile = await getProfileBySlug(slug);

  if (!profile || !profile.enabled) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const profileUrl = `${siteUrl}/u/${profile.slug}`;
  const qr = await QRCode.toDataURL(profileUrl, {
    margin: 1,
    width: 180,
    color: { dark: "#020617", light: "#ffffff" },
  });
  const whatsapp = profile.whatsapp?.replace(/[^\d]/g, "");

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:py-10">
      <div className="mx-auto mb-4 flex max-w-md items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm font-bold text-slate-400 transition-colors hover:text-white"
        >
          ← Ana səhifə
        </Link>
      </div>
      <section className="mx-auto max-w-md overflow-hidden rounded-[2.2rem] border border-white/10 bg-white text-slate-950 shadow-[0_34px_110px_rgba(0,0,0,0.35)]">
        <div
          className="profile-aurora relative h-56"
          style={
            profile.background_url
              ? {
                  background: `linear-gradient(rgba(2,6,23,0.34), rgba(2,6,23,0.34)), url("${profile.background_url}") center/cover no-repeat`,
                }
              : undefined
          }
        >
          <div className="absolute inset-x-6 top-5 flex items-center justify-between">
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan-100 backdrop-blur">
              Sizin Logo
            </span>
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur">
              Rəqəmsal profil
            </span>
          </div>
          <div className="absolute -bottom-16 left-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="size-32 rounded-[2rem] border-4 border-white object-cover shadow-lift"
              />
            ) : (
              <div className="grid size-32 place-items-center rounded-[2rem] border-4 border-white bg-cyan-300 text-5xl font-black text-slate-950 shadow-lift">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-7 pt-20">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-700">
            {profile.profession}
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight">
            {profile.name}
          </h1>
          {profile.bio ? (
            <p className="mt-4 leading-7 text-slate-600">{profile.bio}</p>
          ) : null}
          {profile.location ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
              <MapPin size={16} /> {profile.location}
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-2 gap-3">
            {profile.phone ? (
              <a
                href={`tel:${profile.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 font-black text-white transition duration-150 ease-out active:scale-[0.98]"
              >
                <Phone size={17} /> Zəng et
              </a>
            ) : null}
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 font-black text-white transition duration-150 ease-out active:scale-[0.98]"
              >
                <MessageCircle size={17} /> WhatsApp
              </a>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
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
              href={`/u/${profile.slug}/vcard`}
              icon={<UserPlus size={18} />}
              label="Kontaktı yadda saxla"
            />
          </div>

          {profile.gallery.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-lg font-black tracking-tight">Portfolio</h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {profile.gallery.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={`${profile.name} portfolio`}
                    className="aspect-square rounded-2xl object-cover"
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <img
              src={qr}
              alt="Profile QR code"
              className="size-24 rounded-2xl bg-white p-2"
            />
            <div>
              <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                <QrCode size={16} /> QR ehtiyat nüsxəsi
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                NFC mövcud olmadıqda kamera ilə skan edin.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Social({
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
      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm transition duration-150 ease-out hover:border-slate-300 active:scale-[0.98]"
    >
      {icon} {label}
    </a>
  );
}
