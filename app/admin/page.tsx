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
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition duration-200 ease-out placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100";

function adminErrorMessage(error?: string) {
  switch (error) {
    case "duplicate-slug":
      return "This profile slug already exists. Please use a different slug.";
    case "reserved-slug":
      return "This slug is reserved. Please use another slug.";
    case "required":
      return "Name and slug are required.";
    case "supabase":
      return "Supabase service key is missing in the production environment.";
    case "upload":
      return "Image upload failed. Please check the Supabase storage bucket and try again.";
    case "save":
      return "Profile could not be saved. Please check Supabase settings and try again.";
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
  const errorMessage = adminErrorMessage(params.error);

  const profilesWithQr = await Promise.all(
    profiles.map(async (profile) => {
      const url = getProfileUrl(profile.slug);
      const qr = await QRCode.toDataURL(url, {
        margin: 1,
        width: 120,
        color: { dark: "#020617", light: "#ffffff" },
      });
      return { profile, url, qr };
    }),
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6ff_52%,#ffffff_100%)] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
                <Sparkles size={14} /> Admin workspace
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Client profiles
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Create, edit, activate, and share premium NFC profile pages from
                one focused dashboard.
              </p>
            </div>
            <form action={logoutAdmin}>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-800 active:scale-[0.98]">
                <LogOut size={18} /> Sign out
              </button>
            </form>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat
              icon={<Users size={19} />}
              value={String(profiles.length)}
              label="Total profiles"
            />
            <Stat
              icon={<Activity size={19} />}
              value={String(enabledCount)}
              label="Active profiles"
            />
            <Stat
              icon={<Database size={19} />}
              value={hasSupabaseEnv() ? "Live" : "Demo"}
              label="Data mode"
            />
          </div>
        </header>

        {!hasSupabaseEnv() ? (
          <div className="mt-5 flex gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-900">
            <AlertCircle className="mt-0.5 shrink-0" size={19} />
            Supabase environment values are missing. Demo profile is visible,
            but real create/edit needs `.env.local`.
          </div>
        ) : null}

        {params.saved ? (
          <div className="mt-5 flex gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-black text-emerald-800">
            <BadgeCheck size={19} /> Profile saved successfully.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-5 flex gap-3 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-black text-rose-800">
            <AlertCircle size={19} /> {errorMessage}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="self-start rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-cyan-300">
                  <Plus size={23} />
                </div>
                <h2 className="mt-4 text-2xl font-black tracking-tight">
                  Create profile
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add a new NFC profile with contact actions, social links,
                  gallery, and vCard support.
                </p>
              </div>
            </div>
            <ProfileForm />
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-700">
                  Directory
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  Managed profiles
                </h2>
              </div>
            </div>

            {profiles.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-sm">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                  <Users size={22} />
                </div>
                <h3 className="mt-4 text-xl font-black tracking-tight">
                  No profiles yet
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Create your first profile from the form on the left.
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
          </div>
        </section>
      </div>
    </main>
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
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-2xl bg-slate-100 text-slate-700">
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
    <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div className="flex gap-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="size-14 rounded-2xl object-cover"
            />
          ) : (
            <div className="grid size-14 place-items-center rounded-2xl bg-slate-950 text-xl font-black text-cyan-300">
              {profile.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black tracking-tight">
                {profile.name}
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  profile.enabled
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                }`}
              >
                {profile.enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-slate-500">
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
            className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition duration-150 ease-out hover:border-cyan-200 hover:text-cyan-700 active:scale-[0.98]"
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
                  className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition duration-150 ease-out hover:border-orange-200 hover:text-orange-600 active:scale-[0.98]"
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

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
        <Link2 size={17} className="shrink-0 text-cyan-700" />
        <a
          href={url}
          className="min-w-0 break-all transition-colors hover:text-cyan-700"
        >
          {url}
        </a>
      </div>

      <div className="mt-4 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-slate-950">
        <div className="flex items-center gap-2 text-sm font-black text-slate-700">
          <QrCode size={16} className="text-cyan-700" /> QR kod
        </div>
        <img
          src={qr}
          alt={`${profile.name} QR kodu`}
          className="h-28 w-28 rounded-2xl bg-slate-50 p-2 shadow-sm"
        />
      </div>

      <details className="group mt-4 rounded-3xl border border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-black text-slate-950">
          <span className="inline-flex items-center gap-2">
            <WandSparkles size={17} className="text-cyan-700" /> Edit profile
            details
          </span>
          <ArrowUpRight
            className="transition-transform duration-200 ease-out group-open:rotate-45"
            size={17}
          />
        </summary>
        <div className="border-t border-slate-200 p-5">
          <ProfileForm profile={profile} />
        </div>
      </details>
    </article>
  );
}

function Login({ error }: { error: boolean }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 py-10 text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
      <form
        action={loginAdmin}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-7 text-slate-950 shadow-[0_34px_110px_rgba(0,0,0,0.35)] sm:p-8"
      >
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-cyan-300">
          <LockKeyhole size={22} />
        </div>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-cyan-700">
          Admin login
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Zia NFC panel
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Sign in to manage client profiles and NFC card destinations.
        </p>
        {error ? (
          <div className="mt-5 flex gap-2 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm font-bold text-orange-700">
            <AlertCircle size={17} /> Email or password is incorrect.
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
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 font-black text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-800 active:scale-[0.98]">
          Sign in <ArrowUpRight size={18} />
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
          label="Full name"
          defaultValue={profile?.name}
          required
        />
        <Field
          name="slug"
          label="Profile slug"
          defaultValue={profile?.slug}
          required
        />
        <Field
          name="profession"
          label="Profession"
          defaultValue={profile?.profession}
        />
        <Field name="phone" label="Phone" defaultValue={profile?.phone} />
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
        label="Location"
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
        Portfolio URLs
        <textarea
          name="gallery"
          defaultValue={(profile?.gallery ?? []).join("\n")}
          rows={4}
          className={inputClass}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <UploadField name="avatar" label="Profile image upload" />
        <UploadField name="background" label="Background image upload" />
        <UploadField name="galleryFiles" label="Portfolio upload" multiple />
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={profile?.enabled ?? true}
          className="size-5 rounded accent-cyan-500"
        />
        Profile is active
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-4 font-black text-slate-950 shadow-[0_16px_42px_rgba(34,211,238,0.22)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-cyan-300 active:scale-[0.98]">
        <Save size={18} /> Save profile
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
    <label className="block rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-black text-slate-700 transition duration-200 ease-out hover:border-cyan-300 hover:bg-cyan-50/40">
      <span className="flex items-center gap-2">
        {multiple ? <ImagePlus size={17} /> : <Upload size={17} />} {label}
      </span>
      <input
        name={name}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="mt-3 w-full text-sm font-semibold text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
      />
    </label>
  );
}
