import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl, getProfileVcardPath } from "@/lib/urls";
import {
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
  searchParams: Promise<{ error?: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;

  const profile = await getProfileBySlug(slug);

  if (!profile || !profile.enabled) {
    notFound();
  }

  const profileUrl = getProfileUrl(profile.slug);
  const qr = await QRCode.toDataURL(profileUrl, {
    margin: 1,
    width: 180,
    color: { dark: "#020617", light: "#ffffff" },
  });
  const whatsapp = profile.whatsapp?.replace(/[^\d]/g, "");

  return (
    <main className="profile-shell min-h-screen overflow-hidden px-4 py-5 text-white sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -right-20 top-52 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-lg">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white/70 backdrop-blur-xl transition duration-150 ease-out hover:bg-white/15 hover:text-white active:scale-[0.97]"
          >
            ← Ana səhifə
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-100 backdrop-blur-xl">
            <ShieldCheck size={14} /> Verified
          </span>
        </div>

        <section className="profile-card-enter overflow-hidden rounded-[2.4rem] border border-white/15 bg-white text-slate-950 shadow-[0_34px_120px_rgba(0,0,0,0.42)] ring-1 ring-white/10">
          <div
            className="profile-hero relative min-h-[19rem] overflow-hidden"
            style={
              profile.background_url
                ? {
                    background: `linear-gradient(180deg, rgba(2,6,23,0.08), rgba(2,6,23,0.76)), url("${profile.background_url}") center/cover no-repeat`,
                  }
                : undefined
            }
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.28),transparent_30%),linear-gradient(180deg,transparent_0%,rgba(2,6,23,0.78)_100%)]" />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white/90 backdrop-blur-xl">
                Zia NFC
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-xs font-bold text-white/85 backdrop-blur-xl">
                <Sparkles size={13} /> Digital profile
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-5">
              <div className="flex items-end gap-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="size-28 rounded-[2rem] border-4 border-white/90 object-cover shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
                  />
                ) : (
                  <div className="grid size-28 place-items-center rounded-[2rem] border-4 border-white/90 bg-cyan-300 text-5xl font-black text-slate-950 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 pb-1 text-white">
                  {profile.profession ? (
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                      {profile.profession}
                    </p>
                  ) : null}
                  <h1 className="mt-1 text-4xl font-black leading-none tracking-tight sm:text-5xl">
                    {profile.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 pb-6 pt-5 sm:px-6 sm:pb-7">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-sm">
              {profile.bio ? (
                <p className="text-base leading-7 text-slate-600">
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

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {whatsapp ? (
                <PrimaryAction
                  href={`https://wa.me/${whatsapp}`}
                  tone="whatsapp"
                  icon={<MessageCircle size={19} />}
                  label="WhatsApp"
                />
              ) : null}
              {profile.phone ? (
                <PrimaryAction
                  href={`tel:${profile.phone}`}
                  tone="dark"
                  icon={<Phone size={19} />}
                  label="Zəng et"
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
                label="Kontaktı yadda saxla"
                local
              />
            </div>

            {profile.gallery.length > 0 ? (
              <section className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
                      Selected work
                    </p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight">
                      Portfolio
                    </h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                    {profile.gallery.length} şəkil
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-6 gap-2.5">
                  {profile.gallery.map((image, index) => (
                    <a
                      key={image}
                      href={image}
                      target="_blank"
                      rel="noreferrer"
                      className={`${index === 0 ? "col-span-6" : "col-span-3"} group relative overflow-hidden rounded-[1.35rem] bg-slate-100 shadow-sm ring-1 ring-slate-200/80 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.16)] active:scale-[0.99]`}
                    >
                      <img
                        src={image}
                        alt={`${profile.name} portfolio`}
                        className={`${index === 0 ? "aspect-[16/10]" : "aspect-square"} w-full object-cover transition duration-300 ease-out group-hover:scale-[1.035]`}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/34 via-transparent to-white/0 opacity-0 transition duration-200 ease-out group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc,#ffffff)] p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
                  <img
                    src={qr}
                    alt="Profile QR code"
                    className="size-24 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                    <QrCode size={16} className="text-cyan-700" /> QR ehtiyat
                    nüsxəsi
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    NFC işləmədikdə kamera ilə skan edin və profili dərhal açın.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
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
  tone: "dark" | "whatsapp";
}) {
  const className =
    tone === "whatsapp"
      ? "from-emerald-500 to-green-600 text-white shadow-[0_16px_38px_rgba(16,185,129,0.32)] hover:shadow-[0_20px_48px_rgba(16,185,129,0.42)]"
      : "from-slate-950 to-slate-800 text-white shadow-[0_16px_38px_rgba(15,23,42,0.22)] hover:shadow-[0_20px_48px_rgba(15,23,42,0.32)]";

  return (
    <a
      href={href}
      className={`premium-cta relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br px-5 py-4 text-base font-black transition duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${className}`}
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
      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm transition duration-150 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.97]"
    >
      <span className="text-slate-500 transition-colors duration-150 ease-out group-hover:text-cyan-700">
        {icon}
      </span>{" "}
      {label}
    </a>
  );
}
