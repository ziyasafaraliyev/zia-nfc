import {
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  saveProfile,
  toggleProfile,
} from "@/app/admin/actions";
import CopyUrlButton from "@/components/copy-url-button";
import DeleteProfileButton from "@/components/delete-profile-button";
import ProfileForm from "@/components/profile-form";
import ServerActionForm from "@/components/server-action-form";
import { listProfiles } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import { getProfileUrl } from "@/lib/urls";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  Database,
  ImagePlus,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  LogOut,
  Mail,
  Plus,
  Power,
  Save,
  Sparkles,
  Upload,
  Users,
  WandSparkles,
} from "lucide-react";
import { cookies } from "next/headers";

type Props = {
  searchParams: Promise<{ error?: string; saved?: string; redirectTo?: string }>;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/20" +
  " font-[Outfit]"; 
const quietButtonClass =
  "grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:border-[#29AEEE] hover:text-[#29AEEE] hover:bg-[#29AEEE]/5 active:scale-[0.96]";


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
      return "Hər şəkil maksimum 20MB olmalıdır. Daha kiçik şəkillər yükləyin.";
    case "too-many-gallery-images":
      return "Bir dəfəyə maksimum 30 şəkil yükləyə bilərsiniz. Şəkilləri hissə-hissə əlavə edin.";
    case "unsupported-image":
      return "Şəkil formatı dəstəklənmir. JPG, PNG, WEBP və ya GIF yükləyin. iPhone HEIC formatını əvvəl JPG/PNG edin.";
    case "unsupported-cv":
      return "CV yalnız PDF formatında ola bilər.";
    case "unauthorized":
      return "Bu profili redaktə etmək üçün icazəniz yoxdur.";
    case "slug-change-not-allowed":
      return "Müştəri profil linkini (slug) dəyişə bilməz.";
    case "gallery-files-missing":
      return "Portfolio şəkilləri serverə çatmadı. Səhifəni yeniləyib profil kartından yenidən yükləyin.";
    case "gallery-save-mismatch":
      return "Portfolio bölmələri tam yadda saxlanmadı. Profil kartından redaktə edib yenidən cəhd edin.";
    case "save":
      return "Profil yadda saxlanmadı. Supabase ayarlarını yoxlayıb yenidən cəhd edin.";
    default:
      return null;
  }
}

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getAdminSession();

  if (!session) {
    return <Login error={params.error} redirectTo={params.redirectTo} />;
  }

  const profiles = await listProfiles();
  const isSuper = session.role === "super_admin";
  const errorMessage = adminErrorMessage(params.error);

  if (!isSuper) {
    const profile = profiles.find((p) => p.id === session.profileId);
    if (!profile) {
      return (
        <main className="grid min-h-screen place-items-center bg-[#f5f7fa] px-4 py-10 font-sans">
          <div className="text-center">
            <h1 className="text-2xl font-black text-red-500">Xəta</h1>
            <p className="mt-2 text-slate-500">Hesabınıza uyğun profil tapılmadı.</p>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen dashboard-bg px-4 py-6 text-slate-900 sm:px-6 lg:px-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="mx-auto max-w-3xl">
          {/* Top bar */}
          <header className="dashboard-surface rounded-[2.25rem] overflow-hidden">
            <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 shadow-sm transition hover:opacity-80 active:scale-[0.985]">
                  <img src="/logo.png" alt="Zia NFC" className="size-4 rounded-full object-cover" />
                  <span className="text-slate-800 font-extrabold">Zia NFC</span>
                  <span className="text-[#29AEEE] font-black">Müştəri</span>
                </Link>

                <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl">
                  Profil Paneli
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-400 font-medium">
                  Xoş gəlmisiniz! Aşağıdakı form vasitəsilə profil məlumatlarınızı yeniləyə bilərsiniz.
                </p>
              </div>

              <div className="flex items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={getProfileUrl(profile.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-[#29AEEE] hover:text-[#29AEEE] hover:bg-[#29AEEE]/5 active:scale-[0.98]"
                >
                  <ArrowUpRight size={15} /> Profilə bax
                </a>
                {(() => {
                  const customerEmail = profile.email || profile.client_email;
                  return customerEmail ? (
                    <a
                      href={`mailto:${customerEmail}`}
                      title={customerEmail}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-[#29AEEE] hover:text-[#29AEEE] hover:bg-[#29AEEE]/5 active:scale-[0.98] max-w-[220px]"
                    >
                      <Mail size={15} /> <span className="truncate">{customerEmail}</span>
                    </a>
                  ) : null;
                })()}
                <ServerActionForm action={logoutAdmin}>
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:text-red-500 hover:bg-red-50 active:scale-[0.98]">
                    <LogOut size={15} /> Çıxış
                  </button>
                </ServerActionForm>
              </div>
            </div>
          </header>

          {/* Alerts */}
          <div className="mt-5 space-y-3">
            {params.saved ? (
              <AlertBanner tone="success" icon={<BadgeCheck size={19} />}>
                Profiliniz uğurla yadda saxlanıldı.
              </AlertBanner>
            ) : null}

            {errorMessage ? (
              <AlertBanner tone="error" icon={<AlertCircle size={19} />}>
                {errorMessage}
              </AlertBanner>
            ) : null}
          </div>

          {/* Edit Form */}
          <section className="mt-6 dashboard-surface rounded-[2.25rem] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-slate-900 mb-6">
              Məlumatların Redaktəsi
            </h2>
            <div className="rounded-[1.8rem] bg-slate-50 border border-slate-200 p-4 sm:p-5">
              <ProfileForm key={profile.id} profile={profile} userRole="client" mode="edit" />
            </div>
          </section>
        </div>
      </main>
    );
  }

  const enabledCount = profiles.filter((profile) => profile.enabled).length;
  const disabledCount = profiles.length - enabledCount;

  return (
    <main className="min-h-screen dashboard-bg px-4 py-6 text-slate-900 sm:px-6 lg:px-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="mx-auto max-w-7xl">
        {/* Top bar */}
        <header className="dashboard-surface rounded-[2.25rem] overflow-hidden">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 shadow-sm transition hover:opacity-80 active:scale-[0.985]">
                <img src="/logo.png" alt="Zia NFC" className="size-4 rounded-full object-cover" />
                <span className="text-slate-800 font-extrabold">Zia NFC</span>
                <span className="text-[#29AEEE] font-black">Admin</span>
              </Link>

              <h1
                className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl"
                style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}
              >
                Super Admin
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 font-medium">
                Profillər, QR kodlar və müştəri idarəetməsi bir yerdə.
              </p>
            </div>

            <div className="flex items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <span className="size-2 rounded-full"
                  style={{ background: hasSupabaseEnv() ? '#22c55e' : '#f59e0b' }}
                />
                <span>{hasSupabaseEnv() ? "Live · Supabase" : "Demo modu"}</span>
              </div>

              <ServerActionForm action={logoutAdmin}>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:text-red-500 hover:bg-red-50 active:scale-[0.98]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  <LogOut size={15} /> Çıxış
                </button>
              </ServerActionForm>
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
                  className="mt-3 text-xl font-black tracking-tight text-slate-900"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Yeni Profil Yarat
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-400 font-medium">
                  Yalnız yeni müştəri profili üçün. Mövcud profil redaktəsi sağdakı kartdadır.
                </p>
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-slate-50 border border-slate-200 p-4 sm:p-5">
              <ProfileForm key="create-profile" mode="create" />
            </div>
          </aside>

          {/* Right: directory + analytics */}
          <section className="space-y-4">
            <div className="rounded-[2.25rem] dashboard-surface-soft p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Profil Siyahısı
                  </p>
                  <h2
                    className="mt-1.5 text-2xl font-black tracking-tight text-slate-900"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Profillər
                  </h2>
                </div>
                <p className="text-xs font-medium text-slate-400">
                  Link formatı: <span className="font-bold text-slate-600">/{"{slug}"}</span>
                </p>
              </div>

              {/* ultra-clean “analytics” placeholders */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MiniMetric title="Aktiv" value={String(enabledCount)} />
                <MiniMetric title="Deaktiv" value={String(disabledCount)} />
              </div>
            </div>

            {profiles.length === 0 ? (
              <div className="rounded-[2.25rem] border-2 border-dashed border-slate-200 bg-slate-50/70 p-10 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <Users size={24} className="text-[#29AEEE]" />
                </div>
                <h3
                  className="mt-4 text-lg font-black tracking-tight text-slate-800"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Hələ heç bir profil yoxdur
                </h3>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-400">
                  Soldakı formdan ilk müştəri profilini əlavə edin.
                </p>
              </div>
            ) : null}

            {profiles.map((profile) => {
              const url = getProfileUrl(profile.slug);
              return (
                <ProfileCard key={profile.slug} profile={profile} url={url} />
              );
            })}
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
  const styles = {
    success: "border-[#29AEEE]/25 bg-[#29AEEE]/8 text-slate-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-700",
  }[tone];

  const iconStyles = {
    success: "text-[#29AEEE]",
    warning: "text-amber-600",
    error: "text-red-500",
  }[tone];

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-6 shadow-sm ${styles}`}
    >
      <span className={`grid size-6 shrink-0 place-items-center rounded-xl ${iconStyles}`}>
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}


function MiniMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>
      <p
        className="mt-1.5 text-2xl font-black tracking-tight text-slate-900"
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
    <div className="border-t border-slate-100 px-6 py-5 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0 hover:bg-slate-50/70 transition-colors duration-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-[#29AEEE]/10 border border-[#29AEEE]/15 text-[#29AEEE]">
          {icon}
        </div>
        <div>
          <p
            className="text-2xl font-black tracking-tight text-slate-900"
          >
            {value}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
}: {
  profile: Profile;
  url: string;
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
                <h3 className="truncate text-xl font-black tracking-tight text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {profile.name}
                </h3>
                <StatusBadge enabled={profile.enabled} />
              </div>
              <p className="mt-1 truncate text-xs font-semibold text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                /{profile.slug}
              </p>

              {profile.profession ? (
                <p className="mt-1 text-xs font-semibold text-slate-500" style={{ fontFamily: "'Outfit', sans-serif" }}>
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
                <ServerActionForm action={toggleProfile}>
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
                </ServerActionForm>
                <DeleteProfileButton id={profile.id} slug={profile.slug} />
              </>
            ) : null}

          </div>
        </div>

        <div className="mt-5">
          <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <Link2 size={17} className="shrink-0 text-slate-400" />
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 break-all transition-colors hover:text-[#29AEEE]"
            >
              {url}
            </a>
          </div>
        </div>
      </div>

      <details className="group border-t border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-xs font-bold text-slate-600 transition sm:px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <span className="inline-flex items-center gap-2">
            <WandSparkles size={15} className="text-[#29AEEE]" /> Profili Redaktə Et
          </span>
          <ArrowUpRight
            className="transition-transform duration-150 ease-out group-open:rotate-45 text-slate-400"
            size={15}
          />
        </summary>
        <div className="border-t border-slate-100 bg-white p-5 sm:p-6">
          <ProfileForm key={profile.id} profile={profile} mode="edit" />
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


function Login({ error, redirectTo }: { error?: string, redirectTo?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f7fa] px-4 py-10 font-sans">
      <ServerActionForm
        action={loginAdmin}
        className="w-full max-w-md rounded-[2.25rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-8 transition-all duration-300"
      >
        {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )}
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
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Admin Girişi
        </p>
        <h1
          className="mt-2 text-2xl font-black tracking-tight text-slate-900"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Zia NFC Panel
        </h1>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400 font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {redirectTo === "/restoran" 
            ? "Restoranları idarə etmək üçün daxil olun."
            : "Müştəri profillərini idarə etmək üçün daxil olun."}
        </p>
        {error ? (
          <div className="mt-5 flex gap-2 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-600">
            <AlertCircle size={17} />{" "}
            {error === "rate-limited"
              ? "Çox sayda uğursuz cəhd. Zəhmət olmasa 1 dəqiqə gözləyin."
              : "Email və ya şifrə yanlışdır."}
          </div>
        ) : null}
        <label className="mt-6 block text-xs font-bold text-slate-600 uppercase tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
          E-poçt
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
              className={`${inputClass} pl-11 dashboard-focus-ring`}
            />
          </div>
        </label>
        <label className="mt-4 block text-xs font-bold text-slate-600 uppercase tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Şifrə
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className={`${inputClass} pl-11 dashboard-focus-ring`}
            />
          </div>
        </label>
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#29AEEE] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#29AEEE]/20 transition-all duration-200 active:scale-[0.96] relative overflow-hidden hover:bg-[#1a9ad4]" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Daxil ol <ArrowUpRight size={17} />
        </button>
      </ServerActionForm>
    </main>
  );
}

