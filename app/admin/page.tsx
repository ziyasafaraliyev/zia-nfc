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
  "mt-2 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm outline-none transition duration-150 ease-out placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70";
const quietButtonClass =
  "grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition duration-150 ease-out hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.97]";

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
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-slate-600">
                <Sparkles size={14} className="text-cyan-600" /> Zia NFC Admin
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Müştəri profilləri
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                Profil yarat, linki paylaş, QR kodu hazırla və kartların canlı
                statusunu bir sadə paneldən idarə et.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
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
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition duration-150 ease-out hover:bg-slate-800 active:scale-[0.97] sm:w-auto">
                  <LogOut size={18} /> Çıxış
                </button>
              </form>
            </div>
          </div>

          <div className="grid border-t border-slate-200/70 bg-slate-50/70 sm:grid-cols-3">
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
          <aside className="self-start rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-6 lg:sticky lg:top-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-cyan-300 shadow-sm">
                  <Plus size={23} />
                </div>
                <h2 className="mt-4 text-2xl font-black tracking-tight">
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
            <div className="flex flex-col gap-3 rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Directory
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  İdarə olunan profillər
                </h2>
              </div>
              <p className="text-sm font-semibold text-slate-500">
                Linklər artıq{" "}
                <span className="font-black text-slate-950">/{"{slug}"}</span>{" "}
                formatındadır.
              </p>
            </div>

            {profiles.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                  <Users size={22} />
                </div>
                <h3 className="mt-4 text-xl font-black tracking-tight">
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
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-rose-200 bg-rose-50 text-rose-800",
  }[tone];

  return (
    <div
      className={`flex items-start gap-3 rounded-3xl border p-4 text-sm font-bold leading-6 ${styles}`}
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
    <div className="border-t border-slate-200/70 p-5 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-black tracking-tight">{value}</p>
          <p className="text-sm font-bold text-slate-500">{label}</p>
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
    <article className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.07)] transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="flex min-w-0 gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="size-16 rounded-3xl object-cover shadow-sm"
              />
            ) : (
              <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-slate-950 text-2xl font-black text-cyan-300 shadow-sm">
                {profile.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-2xl font-black tracking-tight">
                  {profile.name}
                </h3>
                <StatusBadge enabled={profile.enabled} />
              </div>
              <p className="mt-1 truncate text-sm font-bold text-slate-500">
                /{profile.slug}
              </p>
              {profile.profession ? (
                <p className="mt-2 text-sm font-semibold text-slate-600">
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
          <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            <Link2 size={17} className="shrink-0 text-slate-500" />
            <a
              href={url}
              className="min-w-0 break-all transition-colors hover:text-slate-950"
            >
              {url}
            </a>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-slate-950">
            <img
              src={qr}
              alt={`${profile.name} QR kodu`}
              className="size-20 rounded-xl bg-slate-50 p-1.5 shadow-sm"
            />
            <div className="hidden pr-2 sm:block">
              <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                <QrCode size={16} /> QR kod
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Hazır paylaşım
              </p>
            </div>
          </div>
        </div>
      </div>

      <details className="group border-t border-slate-100 bg-slate-50/70">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-100/70 sm:px-6">
          <span className="inline-flex items-center gap-2">
            <WandSparkles size={17} className="text-cyan-700" /> Profili redaktə
            et
          </span>
          <ArrowUpRight
            className="transition-transform duration-150 ease-out group-open:rotate-45"
            size={17}
          />
        </summary>
        <div className="border-t border-slate-200 bg-white p-5 sm:p-6">
          <ProfileForm profile={profile} />
        </div>
      </details>
    </article>
  );
}

function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${enabled ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-orange-50 text-orange-700 ring-1 ring-orange-200"}`}
    >
      {enabled ? "Aktiv" : "Deaktiv"}
    </span>
  );
}

function Login({ error }: { error: boolean }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f5f7] px-4 py-10 text-slate-950">
      <form
        action={loginAdmin}
        className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_34px_110px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:p-8"
      >
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-cyan-300 shadow-sm">
          <LockKeyhole size={22} />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Admin login
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Zia NFC panel
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Müştəri profillərini idarə etmək üçün daxil olun.
        </p>
        {error ? (
          <div className="mt-5 flex gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">
            <AlertCircle size={17} /> Email və ya şifrə yanlışdır.
          </div>
        ) : null}
        <label className="mt-6 block text-sm font-black text-slate-700">
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
        <label className="mt-4 block text-sm font-black text-slate-700">
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
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 font-black text-white shadow-sm transition duration-150 ease-out hover:bg-slate-800 active:scale-[0.97]">
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
      <label className="block text-sm font-black text-slate-700">
        Bio
        <textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          rows={4}
          className={inputClass}
        />
      </label>
      <label className="block text-sm font-black text-slate-700">
        Portfolio URL-ləri
        <textarea
          name="gallery"
          defaultValue={(profile?.gallery ?? []).join("\n")}
          rows={4}
          className={inputClass}
          placeholder="Hər linki yeni sətirdə yaz"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <UploadField name="avatar" label="Profil şəkli" />
        <UploadField name="background" label="Cover şəkli" />
        <UploadField name="galleryFiles" label="Portfolio şəkilləri" multiple />
      </div>
      <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
        <span>Profil aktivdir</span>
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={profile?.enabled ?? true}
          className="size-5 rounded accent-slate-950"
        />
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 font-black text-white shadow-sm transition duration-150 ease-out hover:bg-slate-800 active:scale-[0.97]">
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
    <label className="block text-sm font-black text-slate-700">
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
    <label className="block rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-black text-slate-700 transition duration-150 ease-out hover:border-slate-400 hover:bg-white">
      <span className="flex items-center gap-2">
        {multiple ? <ImagePlus size={17} /> : <Upload size={17} />} {label}
      </span>
      <span className="mt-2 block text-xs font-semibold text-slate-500">
        Max 5MB · JPG, PNG, WEBP və ya GIF
      </span>
      <input
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        className="mt-3 w-full text-sm font-semibold text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
      />
    </label>
  );
}
