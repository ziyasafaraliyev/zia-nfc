import {
  loginAdmin,
  logoutAdmin,
  saveProfile,
  toggleProfile,
} from "@/app/admin/actions";
import CopyUrlButton from "@/components/copy-url-button";
import DeleteProfileButton from "@/components/delete-profile-button";
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
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none backdrop-blur-sm transition duration-200 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100";
const quietButtonClass =
  "grid size-11 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm transition duration-200 hover:border-slate-300 hover:bg-white hover:text-slate-950 hover:shadow-md active:scale-[0.96]";

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
    <main className="min-h-screen bg-gradient-to-tr from-[#f8fafc] via-[#f1f5f9] to-[#eef2f6] px-4 py-5 text-slate-900 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/60 shadow-[0_24px_70px_rgba(99,102,241,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_24px_85px_rgba(99,102,241,0.08)]">
          <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                <Sparkles size={14} className="text-indigo-650" /> Zia NFC Admin
              </div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Müştəri profilləri
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                Profil yarat, linki paylaş, QR kodu hazırla və kartların canlı
                statusunu bir sadə paneldən idarə et.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
                Data mode:{" "}
                <span
                  className={
                    hasSupabaseEnv() ? "text-emerald-600" : "text-amber-600"
                  }
                >
                  {hasSupabaseEnv() ? "Live" : "Demo"}
                </span>
              </div>
              <form action={logoutAdmin}>
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 active:scale-[0.96] sm:w-auto">
                  <LogOut size={18} /> Çıxış
                </button>
              </form>
            </div>
          </div>

          <div className="grid border-t border-slate-200/50 bg-white/30 sm:grid-cols-3">
            <Stat
              icon={<Users size={18} />}
              value={String(profiles.length)}
              label="Ümumi profil"
            />
            <Stat
              icon={<Activity size={18} />}
              value={String(enabledCount)}
              label="Aktiv profil"
            />
            <Stat
              icon={<Database size={18} />}
              value={String(disabledCount)}
              label="Deaktiv profil"
            />
          </div>
        </header>

        <div className="mt-5 space-y-3">
          {!hasSupabaseEnv() ? (
            <AlertBanner tone="warning" icon={<AlertCircle size={19} />}>
              Supabase environment values yoxdur. Demo profil görünə bilər, amma
              real create/edit üçün Vercel env-ləri lazımdır.
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

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <aside className="self-start rounded-[2.25rem] border border-white/80 bg-white/60 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6 lg:sticky lg:top-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="grid size-12 place-items-center rounded-2xl bg-indigo-650 text-white shadow-md shadow-indigo-500/10">
                  <Plus size={23} />
                </div>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Yeni profil
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ad, əlaqələr, sosial linklər və portfolio şəkillərini əlavə
                  et.
                </p>
              </div>
            </div>
            <ProfileForm />
          </aside>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-[2.25rem] border border-white/80 bg-white/50 p-5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Directory
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  İdarə olunan profillər
                </h2>
              </div>
              <p className="text-sm font-semibold text-slate-400">
                Linklər artıq{" "}
                <span className="font-extrabold text-slate-800">/{"{slug}"}</span>{" "}
                formatındadır.
              </p>
            </div>

            {profiles.length === 0 ? (
              <div className="rounded-[2.25rem] border border-dashed border-slate-200 bg-white/40 p-10 text-center shadow-sm">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-500 border border-indigo-100">
                  <Users size={22} />
                </div>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Hələ profil yoxdur
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  İlk müştəri profilini soldakı formdan yarat.
                </p>
              </div>
            ) : null}

            {profilesWithQr.map(({ profile, url, qr }) => (
              <ProfileCard
                key={profile.slug}
                profile={profile}
                url={url}
                qr={qr}
              />
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
  const styles = {
    success: "border-emerald-100 bg-emerald-50/80 text-emerald-800",
    warning: "border-amber-100 bg-amber-50/80 text-amber-900",
    error: "border-rose-100 bg-rose-50/80 text-rose-800",
  }[tone];

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-6 shadow-sm backdrop-blur-sm ${styles}`}
    >
      {icon}
      <span>{children}</span>
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
    <div className="border-t border-slate-200/50 p-6 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0 hover:bg-white/30 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50">
          {icon}
        </div>
        <div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
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
    <article className="overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/60 shadow-[0_16px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(99,102,241,0.08)]">
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
              <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-indigo-50 text-2xl font-bold text-indigo-600 shadow-sm border border-indigo-100/50">
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
              <p className="mt-1 truncate text-sm font-semibold text-indigo-650">
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
          <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-500">
            <Link2 size={17} className="shrink-0 text-slate-400" />
            <a
              href={url}
              className="min-w-0 break-all transition-colors hover:text-indigo-600"
            >
              {url}
            </a>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-sm p-3 text-slate-900">
            <img
              src={qr}
              alt={`${profile.name} QR kodu`}
              className="size-20 rounded-xl bg-slate-50 p-1.5 shadow-sm border border-slate-100"
            />
            <div className="hidden pr-2 sm:block">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <QrCode size={16} className="text-indigo-650" /> QR kod
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Hazır paylaşım
              </p>
            </div>
          </div>
        </div>
      </div>

      <details className="group border-t border-slate-100/60 bg-slate-50/40 hover:bg-slate-50/70 transition-colors duration-200">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-bold text-slate-800 transition sm:px-6">
          <span className="inline-flex items-center gap-2">
            <WandSparkles size={17} className="text-indigo-600" /> Profili redaktə et
          </span>
          <ArrowUpRight
            className="transition-transform duration-150 ease-out group-open:rotate-45 text-slate-400"
            size={17}
          />
        </summary>
        <div className="border-t border-slate-200/50 bg-white/50 backdrop-blur-md p-5 sm:p-6">
          <ProfileForm profile={profile} />
        </div>
      </details>
    </article>
  );
}

function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${enabled ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"}`}
    >
      {enabled ? "Aktiv" : "Deaktiv"}
    </span>
  );
}

function Login({ error }: { error: boolean }) {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-tr from-[#f8fafc] via-[#f1f5f9] to-[#eef2f6] px-4 py-10 text-slate-900 font-sans">
      <form
        action={loginAdmin}
        className="w-full max-w-md rounded-[2.25rem] border border-white/80 bg-white/60 p-7 shadow-[0_30px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 hover:shadow-[0_30px_80px_rgba(99,102,241,0.1)] transition-all duration-300"
      >
        <div className="grid size-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/10">
          <LockKeyhole size={22} />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Admin login
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 font-serif" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Zia NFC panel
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Müştəri profillərini idarə etmək üçün daxil olun.
        </p>
        {error ? (
          <div className="mt-5 flex gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
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
              className={`${inputClass} pl-11`}
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
              className={`${inputClass} pl-11`}
            />
          </div>
        </label>
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-4 font-bold text-white shadow-md shadow-indigo-500/10 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.96]">
          Daxil ol <ArrowUpRight size={18} />
        </button>
      </form>
    </main>
  );
}

function ProfileForm({ profile }: { profile?: Profile }) {
  return (
    <form
      action={saveProfile}
      encType="multipart/form-data"
      className="grid gap-4"
    >
      <input type="hidden" name="id" value={profile?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          name="name"
          label="Ad Soyad"
          defaultValue={profile?.name}
          required
        />
        <Field
          name="slug"
          label="Profil linki / slug"
          defaultValue={profile?.slug}
          required
        />
        <Field
          name="profession"
          label="Peşə"
          defaultValue={profile?.profession}
        />
        <Field name="phone" label="Telefon" defaultValue={profile?.phone} />
        <Field
          name="whatsapp"
          label="WhatsApp"
          defaultValue={profile?.whatsapp}
        />
        <Field
          name="instagram"
          label="Instagram URL"
          defaultValue={profile?.instagram}
        />
        <Field
          name="tiktok"
          label="TikTok URL"
          defaultValue={profile?.tiktok}
        />
        <Field
          name="website"
          label="Website URL"
          defaultValue={profile?.website}
        />
      </div>
      <Field
        name="location"
        label="Lokasiya"
        defaultValue={profile?.location}
      />
      <label className="block text-sm font-bold text-slate-700">
        Bio
        <textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          rows={4}
          className={inputClass}
        />
      </label>
      <label className="block text-sm font-bold text-slate-700">
        Portfolio URL-ləri
        <textarea
          name="gallery"
          defaultValue={(profile?.gallery ?? []).join("\n")}
          rows={4}
          className={inputClass}
          placeholder="Hər linki yeni sətirdə yaz"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          name="cover_style"
          label="Cover görünüşü"
          defaultValue={profile?.cover_style ?? "auto"}
          options={[
            { value: "auto", label: "Auto / premium" },
            { value: "square", label: "Kvadrat / 1:1" },
            { value: "banner", label: "Banner / aşağı hündürlük" },
          ]}
        />
        <SelectField
          name="cover_position"
          label="Cover fokus yeri"
          defaultValue={profile?.cover_position ?? "center"}
          options={[
            { value: "top", label: "Yuxarı" },
            { value: "center", label: "Mərkəz" },
            { value: "bottom", label: "Aşağı" },
          ]}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <UploadField name="avatar" label="Profil şəkli" />
        <UploadField name="background" label="Cover şəkli" />
        <UploadField name="galleryFiles" label="Portfolio şəkilləri" multiple />
      </div>
      <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm font-bold text-slate-700">
        <span>Profil aktivdir</span>
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={profile?.enabled ?? true}
          className="size-5 rounded accent-indigo-655"
        />
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-650 px-5 py-4 font-bold text-white shadow-md shadow-indigo-500/10 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.96]">
        <Save size={18} /> Yadda saxla
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={inputClass}
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <select name={name} defaultValue={defaultValue} className={inputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function UploadField({
  name,
  label,
  multiple = false,
}: {
  name: string;
  label: string;
  multiple?: boolean;
}) {
  return (
    <label className="block rounded-3xl border border-dashed border-slate-200 bg-white/50 p-4 text-sm font-bold text-slate-750 transition duration-200 ease-out hover:border-indigo-400 hover:bg-white hover:shadow-sm cursor-pointer">
      <span className="flex items-center gap-2 text-slate-800">
        {multiple ? <ImagePlus size={17} className="text-indigo-650" /> : <Upload size={17} className="text-indigo-655" />} {label}
      </span>
      <span className="mt-2 block text-xs font-semibold text-slate-405">
        Max 5MB · JPG, PNG, WEBP və ya GIF
      </span>
      <input
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        className="mt-3 w-full text-sm font-semibold text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-indigo-700 file:hover:bg-indigo-100 file:transition-colors file:cursor-pointer"
      />
    </label>
  );
}
