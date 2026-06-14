import {
  loginAdmin,
  logoutAdmin,
  saveProfile,
  toggleProfile,
} from "@/app/admin/actions";
import CopyUrlButton from "@/components/copy-url-button";
import DeleteProfileButton from "@/components/delete-profile-button";
import ProfileForm from "@/components/profile-form";
import { listProfiles } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import { getProfileUrl } from "@/lib/urls";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  Database,
  ImagePlus,
  Link2,
  LockKeyhole,
  LogOut,
  Mail,
  Plus,
  Power,
  QrCode,
  Save,
  Sparkles,
  Upload,
  Users,
  WandSparkles,
} from "lucide-react";
import { cookies } from "next/headers";
import QRCode from "qrcode";

type Props = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/20";
const quietButtonClass =
  "grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition duration-200 hover:border-[#29AEEE] hover:text-[#29AEEE] hover:bg-[#29AEEE]/5 active:scale-[0.96]";


function adminErrorMessage(error?: string) {
  switch (error) {
    case "duplicate-slug":
      return "Bu profil linki artıq mövcuddur. Başqa slug istifadə edin.";
    case "reserved-slug":
      return "Bu slug sistem üçün rezerv olunub. Başqa slug seçin.";
    case "required":
      return "Ad və slug xanaları mütləq doldurulmalıdır.";
    case "supabase":
      return "Production mühitində Supabase service key tapılmadı.";
    case "upload":
      return "Şəkil yüklənmədi. Supabase Storage bucket ayarlarını yoxlayın.";
    case "file-too-large":
      return "Hər şəkil maksimum 5MB olmalıdır. Ümumi forma limiti 30MB-dır.";
    case "unsupported-image":
      return "Şəkil formatı dəstəklənmir. JPG, PNG, WEBP və ya GIF yükləyin. iPhone HEIC formatını əvvəl JPG/PNG edin.";
    case "save":
      return "Profil yadda saxlanmadı. Supabase ayarlarını yoxlayıb yenidən cəhd edin.";
    default:
      return null;
  }
}

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const store = await cookies();
  const allowedEmail = process.env.ADMIN_EMAIL || "ziya@gmail.com";
  const isAdmin = store.get("zia_admin_email")?.value === allowedEmail;

  if (!isAdmin) {
    return <Login error={params.error === "login"} />;
  }

  const profiles = await listProfiles();
  const enabledCount = profiles.filter((profile) => profile.enabled).length;
  const disabledCount = profiles.length - enabledCount;
  const errorMessage = adminErrorMessage(params.error);

  const profilesWithQr = await Promise.all(
    profiles.map(async (profile) => {
      const url = getProfileUrl(profile.slug);
      const qr = await QRCode.toDataURL(url, {
        margin: 1,
        width: 128,
        color: { dark: "#020617", light: "#ffffff" },
      });
      return { profile, url, qr };
    }),
  );

  return (
    <main className="min-h-screen dashboard-bg px-4 py-6 text-slate-900 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Top bar */}
        <header className="dashboard-surface rounded-[2.25rem] overflow-hidden">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-slate-700 shadow-sm">
                <img src="/logo.png" alt="Zia NFC" className="size-4 rounded-full object-cover" />
                <span className="opacity-90">Zia NFC</span>
                <span className="opacity-60">Admin</span>
              </div>

              <h1
                className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Müştəri dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                Profil idarəetməsi, paylaşım axını və performans görünüşü—hamısı
                bir premium paneldə.
              </p>
            </div>

            <div className="flex items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="hidden sm:flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                Data mode:{" "}
                <span className="text-slate-900">
                  {hasSupabaseEnv() ? "Live" : "Demo"}
                </span>
                <span className="ml-2 rounded-full bg-[#29AEEE]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#29AEEE]">
                  {hasSupabaseEnv() ? "Online" : "Preview"}
                </span>
              </div>

              <form action={logoutAdmin}>
                <button className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#29AEEE] hover:text-[#29AEEE] active:scale-[0.98] sm:w-auto">
                  <LogOut size={18} /> Çıxış
                </button>
              </form>
            </div>
          </div>

          {/* Stats */}
          <div className="dashboard-divider" />
          <div className="grid sm:grid-cols-3">
            <Stat
              icon={<Users size={18} />}
              value={String(profiles.length)}
              label="Ümumi"
            />
            <Stat icon={<Activity size={18} />} value={String(enabledCount)} label="Aktiv" />
            <Stat icon={<Database size={18} />} value={String(disabledCount)} label="Deaktiv" />
          </div>
        </header>

        {/* Alerts */}
        <div className="mt-5 space-y-3">
          {!hasSupabaseEnv() ? (
            <AlertBanner tone="warning" icon={<AlertCircle size={19} />}>
              Supabase env-ləri tapılmadı. Demo profil görünə bilər.
            </AlertBanner>
          ) : null}

          {params.saved ? (
            <AlertBanner tone="success" icon={<BadgeCheck size={19} />}>
              Profil uğurla yadda saxlanıldı.
            </AlertBanner>
          ) : null}

          {errorMessage ? (
            <AlertBanner tone="error" icon={<AlertCircle size={19} />}>
              {errorMessage}
            </AlertBanner>
          ) : null}
        </div>

        {/* Layout */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          {/* Left: profile management */}
          <aside className="dashboard-surface rounded-[2.25rem] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-6 lg:sticky lg:top-6 self-start">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#29AEEE] text-white shadow-sm">
                  <Plus size={23} />
                </div>
                <h2
                  className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Yeni / redaktə
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ad, kontaktlar, sosial linklər və portfolio—premium görünüş üçün.
                </p>
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-slate-50 border border-slate-200 p-4 sm:p-5">
              <ProfileForm />
            </div>
          </aside>

          {/* Right: directory + analytics */}
          <section className="space-y-4">
            <div className="rounded-[2.25rem] dashboard-surface-soft p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Directory
                  </p>
                  <h2
                    className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Profillər
                  </h2>
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  Linklər avtomatik formatdadır: <span className="font-extrabold text-slate-700">/{"{slug}"}</span>
                </p>
              </div>

              {/* ultra-clean “analytics” placeholders */}
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniMetric title="Aktiv paylaşımlar" value={String(enabledCount)} />
                <MiniMetric title="Yenilik" value={profiles.length ? "—" : "0"} />
                <MiniMetric title="Hazır QR" value={profiles.length ? String(profiles.length) : "0"} />
              </div>
            </div>

            {profiles.length === 0 ? (
              <div className="rounded-[2.25rem] border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <Users size={22} className="text-[#29AEEE]" />
                </div>
                <h3
                  className="mt-4 text-xl font-extrabold tracking-tight text-slate-900"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Hələ profil yoxdur
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Soldakı formdan ilk müştəri profilini yaradın.
                </p>
              </div>
            ) : null}

            {profilesWithQr.map(({ profile, url, qr }) => (
              <ProfileCard key={profile.slug} profile={profile} url={url} qr={qr} />
            ))}
          </section>
        </section>
      </div>
    </main>
  );
}


function AlertBanner({
  tone,
  icon,
  children,
}: {
  tone: "success" | "warning" | "error";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  // Palette restricted to black / white / brand-blue only.
  const styles = {
    success:
      "border-white/15 bg-white/5 text-white",
    warning:
      "border-white/15 bg-white/5 text-white",
    error:
      "border-white/15 bg-white/5 text-white",
  }[tone];

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-6 shadow-sm backdrop-blur-sm ${styles}`}
    >
      <span className="grid size-6 place-items-center rounded-xl border border-white/15 bg-white/5">
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}


function MiniMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
        {title}
      </p>
      <p
        className="mt-2 text-xl font-extrabold tracking-tight text-slate-900"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {value}
      </p>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="border-t border-slate-100 p-6 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0 hover:bg-slate-50 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div className="grid size-12 place-items-center rounded-2xl bg-[#29AEEE]/10 border border-[#29AEEE]/20 text-[#29AEEE]">
          {icon}
        </div>
        <div>
          <p
            className="text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {value}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}




function ProfileCard({
  profile,
  url,
  qr,
}: {
  profile: Profile;
  url: string;
  qr: string;
}) {
  return (
    <article className="overflow-hidden rounded-[2.25rem] border border-slate-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="flex min-w-0 gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="size-16 rounded-3xl object-cover shadow-sm ring-1 ring-slate-100"
              />
            ) : (
              <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-[#29AEEE]/10 text-2xl font-bold text-[#29AEEE] shadow-sm border border-[#29AEEE]/20">
                {profile.name.charAt(0)}
              </div>

            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-2xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {profile.name}
                </h3>
                <StatusBadge enabled={profile.enabled} />
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                /{profile.slug}
              </p>

              {profile.profession ? (
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {profile.profession}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              title="Open profile"
              className={quietButtonClass}
            >
              <ArrowUpRight size={18} />
            </a>
            <CopyUrlButton url={url} />
            {profile.id ? (
              <>
                <form action={toggleProfile}>
                  <input type="hidden" name="id" value={profile.id} />
                  <input
                    type="hidden"
                    name="enabled"
                    value={String(profile.enabled)}
                  />
                  <button
                    className={quietButtonClass}
                    title="Enable or disable"
                  >
                    <Power size={18} />
                  </button>
                </form>
                <DeleteProfileButton id={profile.id} slug={profile.slug} />
              </>
            ) : null}

          </div>
        </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <Link2 size={17} className="shrink-0 text-slate-400" />
            <a
              href={url}
              className="min-w-0 break-all transition-colors hover:text-white"
            >
              {url}
            </a>
          </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-slate-700">
            <img
              src={qr}
              alt={`${profile.name} QR kodu`}
              className="size-20 rounded-xl bg-white p-1.5 shadow-sm border border-slate-200"
            />
            <div className="hidden pr-2 sm:block">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <QrCode size={16} className="text-[#29AEEE]" /> QR kod
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Hazır paylaşım
              </p>
            </div>
          </div>

        </div>
      </div>

      <details className="group border-t border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-bold text-slate-700 transition sm:px-6">
          <span className="inline-flex items-center gap-2">
            <WandSparkles size={17} className="text-[#29AEEE]" /> Profili redaktə et
          </span>
          <ArrowUpRight
            className="transition-transform duration-150 ease-out group-open:rotate-45 text-slate-400"
            size={17}
          />
        </summary>
        <div className="border-t border-slate-100 bg-white p-5 sm:p-6">
          <ProfileForm profile={profile} />
        </div>
      </details>

    </article>
  );
}

function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold border ${
        enabled
          ? "bg-[#29AEEE]/10 border-[#29AEEE]/30 text-[#29AEEE]"
          : "bg-slate-100 border-slate-200 text-slate-500"
      }`}
    >
      {enabled ? "Aktiv" : "Deaktiv"}
    </span>
  );
}


function Login({ error }: { error: boolean }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f7fa] px-4 py-10 font-sans">
      <form
        action={loginAdmin}
        className="w-full max-w-md rounded-[2.25rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-8 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Zia NFC"
            className="size-12 rounded-2xl object-cover shadow-sm ring-1 ring-slate-200"
          />
          <div className="grid size-12 place-items-center rounded-2xl bg-[#29AEEE]/10 text-[#29AEEE] shadow-md border border-[#29AEEE]/20">
            <LockKeyhole size={20} />
          </div>
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Admin login
        </p>
        <h1
          className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Zia NFC panel
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Müştəri profillərini idarə etmək üçün daxil olun.
        </p>
        {error ? (
          <div className="mt-5 flex gap-2 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-600">
            <AlertCircle size={17} /> Email və ya şifrə yanlışdır.
          </div>
        ) : null}
        <label className="mt-6 block text-sm font-bold text-slate-700">
          Email
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              name="email"
              type="email"
              required
              className={`${inputClass} pl-11 dashboard-focus-ring`}
            />
          </div>
        </label>
        <label className="mt-4 block text-sm font-bold text-slate-700">
          Password
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              name="password"
              type="password"
              required
              className={`${inputClass} pl-11 dashboard-focus-ring`}
            />
          </div>
        </label>
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#29AEEE] px-5 py-4 font-bold text-white shadow-md shadow-[#29AEEE]/20 transition-all duration-200 active:scale-[0.96] relative overflow-hidden hover:bg-[#1a9ad4]">
          Daxil ol <ArrowUpRight size={18} />
        </button>
      </form>
    </main>
  );
}

