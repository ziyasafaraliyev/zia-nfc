import {
  getAdminSession,
  toggleCarProfile,
} from "@/app/admin/actions";
import { listCarProfiles } from "@/lib/car";
import { getCarProfileUrl } from "@/lib/urls";
import type { CarProfile } from "@/lib/types";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Car,
  Edit,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Plus,
  Power,
  Users,
} from "lucide-react";
import CarForm from "@/components/car-form";
import CopyUrlButton from "@/components/copy-url-button";
import DeleteProfileButton from "@/components/delete-profile-button";
import ServerActionForm from "@/components/server-action-form";
import { logoutAdmin } from "@/app/admin/actions";

type Props = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const quietButtonClass =
  "grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50 active:scale-[0.96]";

const viewProfileButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-sky-500/20 bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_25px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 active:scale-[0.98]";

function adminErrorMessage(error?: string) {
  switch (error) {
    case "duplicate-slug":
      return "Bu profil linki (slug) artıq mövcuddur. Başqa slug istifadə edin.";
    case "reserved-slug":
      return "Bu slug sistem üçün rezerv olunub. Başqa slug seçin.";
    case "required":
      return "Sürücü adı, avto modeli, dövlət nömrəsi və slug mütləq doldurulmalıdır.";
    case "supabase":
      return "Production mühitində Supabase key tapılmadı.";
    case "upload":
      return "Şəkil yüklənmədi. Yükləmə ayarlarını yoxlayın.";
    case "file-too-large":
      return "Şəkil faylı maksimum 20MB olmalıdır.";
    case "unsupported-image":
      return "Şəkil formatı dəstəklənmir. JPG, PNG və ya WEBP yükləyin.";
    case "save":
      return "Zia Car profili yadda saxlanmadı. Yenidən cəhd edin.";
    default:
      return null;
  }
}

export default async function ZiaCarAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getAdminSession();

  if (!session || session.role !== "super_admin") {
    redirect("/admin?redirectTo=/car/admin");
  }

  const profiles = await listCarProfiles();
  const enabledCount = profiles.filter((p) => p.enabled).length;
  const disabledCount = profiles.length - enabledCount;

  const errorMessage = adminErrorMessage(params.error);

  return (
    <main className="dashboard-bg min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <header className="dashboard-surface rounded-[2.25rem] overflow-hidden">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/car"
                className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50"
                title="Zia Car səhifəsinə qayıt"
              >
                <ArrowLeft size={18} />
              </Link>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
                  <Car size={13} className="text-sky-500" />
                  <span className="text-slate-800 font-extrabold">Zia NFC</span>
                  <span className="text-sky-500 font-black">Zia Car İdarəsi</span>
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl">
                  Zia Car Admin Paneli
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-400 font-medium">
                  Zia Car müştərilərinin avto profillərini idarə edin · {profiles.length} profil ({enabledCount} aktiv, {disabledCount} deaktiv)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-sky-500 hover:text-sky-500"
              >
                <LayoutDashboard size={15} /> Əsas Admin Panel
              </Link>
              <ServerActionForm action={logoutAdmin}>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-red-300 hover:text-red-500 hover:bg-red-50">
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
              Zia Car profili uğurla yadda saxlanıldı.
            </AlertBanner>
          ) : null}
          {errorMessage ? (
            <AlertBanner tone="error" icon={<AlertCircle size={19} />}>
              {errorMessage}
            </AlertBanner>
          ) : null}
        </div>

        {/* Main Grid: Form + List */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          {/* Create Form */}
          <aside className="dashboard-surface rounded-[2.25rem] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-6 lg:sticky lg:top-6 self-start">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <div className="grid size-12 place-items-center rounded-2xl bg-sky-500 text-white shadow-sm">
                  <Plus size={23} />
                </div>
                <h2 className="mt-3 text-xl font-black tracking-tight text-slate-900">
                  Yeni Zia Car Profil Yarat
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-400 font-medium">
                  Sadə avto profili: nömrələr, whatsapp, profil/cover şəkli və sosial şəbəkələr.
                </p>
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-slate-50 border border-slate-200 p-4 sm:p-5">
              <CarForm key="create-car-profile" />
            </div>
          </aside>

          {/* Profiles List */}
          <section className="space-y-4">
            <div className="rounded-[2.25rem] dashboard-surface-soft p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Avto Profillər Siyahısı
                  </p>
                  <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-900">
                    Bütün Zia Car Profilləri
                  </h2>
                </div>
                <p className="text-xs font-medium text-slate-400">
                  Toplam: <span className="font-bold text-slate-600">{profiles.length}</span>
                </p>
              </div>
            </div>

            {profiles.length === 0 ? (
              <div className="rounded-[2.25rem] border-2 border-dashed border-slate-200 bg-slate-50/70 p-10 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <Car size={24} className="text-sky-500" />
                </div>
                <h3 className="mt-4 text-lg font-black tracking-tight text-slate-800">
                  Hələ heç bir Zia Car profili yoxdur
                </h3>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-400">
                  Soldakı formdan ilk müştəri avto profilini əlavə edin.
                </p>
              </div>
            ) : (
              profiles.map((profile) => (
                <CarProfileCard key={profile.id || profile.slug} profile={profile} />
              ))
            )}
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
    success: "border-sky-200 bg-sky-50 text-sky-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-700",
  }[tone];

  const iconStyles = {
    success: "text-sky-600",
    warning: "text-amber-600",
    error: "text-red-500",
  }[tone];

  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-6 shadow-sm ${styles}`}>
      <span className={`grid size-6 shrink-0 place-items-center rounded-xl ${iconStyles}`}>
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

function CarProfileCard({ profile }: { profile: CarProfile }) {
  const url = getCarProfileUrl(profile.slug);

  return (
    <article className="overflow-hidden rounded-[2.25rem] border border-slate-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="flex min-w-0 gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.driver_name}
                className="size-16 rounded-3xl object-cover shadow-sm ring-1 ring-slate-100"
              />
            ) : (
              <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-sky-500/10 text-2xl font-bold text-sky-500 shadow-sm border border-sky-500/20">
                {profile.driver_name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-xl font-black tracking-tight text-slate-900">
                  {profile.driver_name}
                </h3>
                <StatusBadge enabled={profile.enabled} />
              </div>
              <p className="mt-1 truncate text-xs font-extrabold text-sky-600">
                🚘 {profile.plate} · {profile.car_name}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                /{profile.slug}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              title="Profili aç"
              className={viewProfileButtonClass}
            >
              <ArrowUpRight size={16} />
              <span>Profilə bax</span>
            </a>
            <CopyUrlButton url={url} />
            {profile.id ? (
              <>
                <ServerActionForm action={toggleCarProfile}>
                  <input type="hidden" name="id" value={profile.id} />
                  <input type="hidden" name="enabled" value={String(profile.enabled)} />
                  <button className={quietButtonClass} title="Aktiv/Deaktiv Et">
                    <Power size={18} />
                  </button>
                </ServerActionForm>
                <DeleteProfileButton
                  id={profile.id}
                  slug={profile.slug}
                  actionName="deleteCarProfile"
                />
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Edit Form Dropdown */}
      <details className="group border-t border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-xs font-bold text-slate-600 transition sm:px-6">
          <span className="inline-flex items-center gap-2">
            <Edit size={15} className="text-sky-500" /> Zia Car Profilini Redaktə Et
          </span>
          <ArrowLeft
            className="transition-transform duration-150 ease-out group-open:-rotate-90 text-slate-400"
            size={15}
          />
        </summary>
        <div className="border-t border-slate-100 bg-white p-5 sm:p-6">
          <CarForm key={profile.id} profile={profile} />
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
          ? "bg-sky-50 border-sky-200 text-sky-700"
          : "bg-slate-100 border-slate-200 text-slate-500"
      }`}
    >
      {enabled ? "Aktiv" : "Deaktiv"}
    </span>
  );
}
