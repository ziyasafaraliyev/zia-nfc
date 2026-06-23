import { getAdminSession } from "@/app/admin/actions";
import { listRestaurants } from "@/lib/restaurants";
import { getRestaurantPath } from "@/lib/urls";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Star,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Power,
  BadgeCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import RestaurantForm from "@/components/restaurant-form";
import DeleteProfileButton from "@/components/delete-profile-button";
import { cookies } from "next/headers";

type Props = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const quietButtonClass =
  "grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:border-[#29AEEE] hover:text-[#29AEEE] hover:bg-[#29AEEE]/5 active:scale-[0.96]";

function adminErrorMessage(error?: string) {
  switch (error) {
    case "duplicate-slug":
      return "Bu link artıq mövcuddur. Başqa slug istifadə edin.";
    case "reserved-slug":
      return "Bu slug sistem üçün rezerv olunub. Başqa slug seçin.";
    case "required":
      return "Restoran adı və link mütləq doldurulmalıdır.";
    case "supabase":
      return "Production mühitində Supabase service key tapılmadı.";
    case "upload":
      return "Şəkil yüklənmədi. Supabase Storage bucket ayarlarını yoxlayın.";
    case "file-too-large":
      return "Hər şəkil maksimum 5MB olmalıdır. Ümumi forma limiti 30MB-dır.";
    case "unsupported-image":
      return "Şəkil formatı dəstəklənmir. JPG, PNG, WEBP və ya GIF yükləyin. iPhone HEIC formatını əvvəl JPG/PNG edin.";
    case "save":
      return "Restoran yadda saxlanmadı. Supabase ayarlarını yoxlayıb yenidən cəhd edin.";
    default:
      return null;
  }
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getAdminSession();

  if (!session || session.role !== "super_admin") {
    redirect("/admin?redirectTo=/restoran");
  }

  const restaurants = await listRestaurants();
  const totalRevenue = restaurants.reduce((sum, r) => sum + (r.revenue || 0), 0);
  const totalOrders = restaurants.reduce((sum, r) => sum + (r.orders_count || 0), 0);
  const activeRestaurants = restaurants.filter(r => r.enabled).length;
  const avgRating = activeRestaurants > 0 
    ? restaurants.filter(r => r.enabled && r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / activeRestaurants 
    : 0;

  const errorMessage = adminErrorMessage(params.error);

  return (
    <main className="min-h-screen bg-[#f5f7fa] px-4 py-6 text-slate-900 sm:px-6 lg:px-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="mx-auto max-w-7xl">
        <header className="dashboard-surface rounded-[2.25rem] overflow-hidden">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#29AEEE] hover:text-[#29AEEE] hover:bg-[#29AEEE]/5">
                <ArrowLeft size={18} />
              </Link>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
                  <LayoutDashboard size={12} className="text-[#29AEEE]" />
                  <span className="text-slate-800 font-extrabold">Zia NFC</span>
                  <span className="text-[#29AEEE] font-black">Restoran İdarəsi</span>
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl">
                  Restoran İdarə Paneli
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-400 font-medium">
                  Bütün restoranları və statistikaları bir yerdən idarə edin.
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-divider" />
          <div className="grid sm:grid-cols-4">
            <Stat
              icon={<Users size={18} />}
              value={String(restaurants.length)}
              label="Ümumi Restoran"
              subValue={`${activeRestaurants} aktiv`}
            />
            <Stat
              icon={<DollarSign size={18} />}
              value={`$${totalRevenue.toLocaleString()}`}
              label="Ümumi Gəlir"
            />
            <Stat
              icon={<ShoppingBag size={18} />}
              value={String(totalOrders)}
              label="Sifariş Sayı"
            />
            <Stat
              icon={<Star size={18} />}
              value={avgRating.toFixed(1)}
              label="Ortalama Reytinq"
            />
          </div>
        </header>

        <div className="mt-5 space-y-3">
          {params.saved ? (
            <AlertBanner tone="success" icon={<BadgeCheck size={19} />}>
              Restoran uğurla yadda saxlanıldı.
            </AlertBanner>
          ) : null}
          {errorMessage ? (
            <AlertBanner tone="error" icon={<AlertCircle size={19} />}>
              {errorMessage}
            </AlertBanner>
          ) : null}
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <aside className="dashboard-surface rounded-[2.25rem] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-6 lg:sticky lg:top-6 self-start">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#29AEEE] text-white shadow-sm">
                  <Plus size={23} />
                </div>
                <h2 className="mt-3 text-xl font-black tracking-tight text-slate-900">
                  Yeni Restoran Əlavə Et
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-400 font-medium">
                  Restoran məlumatlarını, şəkillərini və sosial media linklərini əlavə edin.
                </p>
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-slate-50 border border-slate-200 p-4 sm:p-5">
              <RestaurantForm />
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-[2.25rem] dashboard-surface-soft p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Restoran Siyahısı
                  </p>
                  <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-900">
                    Bütün Restoranlar
                  </h2>
                </div>
                <p className="text-xs font-medium text-slate-400">
                  Toplam: <span className="font-bold text-slate-600">{restaurants.length}</span>
                </p>
              </div>
            </div>

            {restaurants.length === 0 ? (
              <div className="rounded-[2.25rem] border-2 border-dashed border-slate-200 bg-slate-50/70 p-10 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <Users size={24} className="text-[#29AEEE]" />
                </div>
                <h3 className="mt-4 text-lg font-black tracking-tight text-slate-800">
                  Hələ heç bir restoran yoxdur
                </h3>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-400">
                  Soldakı formdan ilk restoranı əlavə edin.
                </p>
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id || restaurant.slug} restaurant={restaurant} />
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
    success: "border-white/15 bg-white/5 text-white",
    warning: "border-white/15 bg-white/5 text-white",
    error: "border-white/15 bg-white/5 text-white",
  }[tone];

  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-6 shadow-sm backdrop-blur-sm ${styles}`}>
      <span className="grid size-6 place-items-center rounded-xl border border-white/15 bg-white/5">
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
  subValue,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  subValue?: string;
}) {
  return (
    <div className="border-t border-slate-100 px-6 py-5 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0 hover:bg-slate-50/70 transition-colors duration-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-[#29AEEE]/10 border border-[#29AEEE]/15 text-[#29AEEE]">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-black tracking-tight text-slate-900">
            {value}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
            {subValue && (
              <span className="block text-[9px] text-slate-400 mt-0.5">
                {subValue}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: any }) {
  return (
    <article className="overflow-hidden rounded-[2.25rem] border border-slate-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="flex min-w-0 gap-4">
            {restaurant.avatar_url ? (
              <img
                src={restaurant.avatar_url}
                alt={restaurant.name}
                className="size-16 rounded-3xl object-cover shadow-sm ring-1 ring-slate-100"
              />
            ) : (
              <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-[#29AEEE]/10 text-2xl font-bold text-[#29AEEE] shadow-sm border border-[#29AEEE]/20">
                {restaurant.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-xl font-black tracking-tight text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {restaurant.name}
                </h3>
                <StatusBadge enabled={restaurant.enabled} />
              </div>
              <p className="mt-1 truncate text-xs font-semibold text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                /{restaurant.slug}
              </p>
              {restaurant.location_name && (
                <p className="mt-1 text-xs font-semibold text-slate-500" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {restaurant.location_name}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-semibold text-slate-400">
                {restaurant.revenue && (
                  <span className="flex items-center gap-1">
                    <DollarSign size={10} />
                    ${restaurant.revenue.toLocaleString()}
                  </span>
                )}
                {restaurant.orders_count && (
                  <span className="flex items-center gap-1">
                    <ShoppingBag size={10} />
                    {restaurant.orders_count} sifariş
                  </span>
                )}
                {restaurant.rating && (
                  <span className="flex items-center gap-1 text-orange-500">
                    <Star size={10} fill="currentColor" />
                    {restaurant.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Link
              href={getRestaurantPath(restaurant.slug)}
              target="_blank"
              rel="noreferrer"
              className={quietButtonClass}
              title="İctimai səhifəyə bax"
            >
              <ExternalLink size={18} />
            </Link>
            <form action={toggleRestaurant}>
              <input type="hidden" name="id" value={restaurant.id} />
              <input type="hidden" name="enabled" value={String(restaurant.enabled)} />
              <button
                className={quietButtonClass}
                title="Aktiv/Deaktiv Et"
              >
                <Power size={18} />
              </button>
            </form>
            <DeleteProfileButton 
              id={restaurant.id} 
              slug={restaurant.slug} 
              actionName="deleteRestaurant"
            />
          </div>
        </div>
      </div>

      <details className="group border-t border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-xs font-bold text-slate-600 transition sm:px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <span className="inline-flex items-center gap-2">
            <Edit size={15} className="text-[#29AEEE]" /> Restoranı Redaktə Et
          </span>
          <ArrowLeft
            className="transition-transform duration-150 ease-out group-open:rotate-180 text-slate-400"
            size={15}
          />
        </summary>
        <div className="border-t border-slate-100 bg-white p-5 sm:p-6">
          <RestaurantForm restaurant={restaurant} />
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

async function toggleRestaurant(formData: FormData) {
  "use server";
  const { toggleRestaurant } = await import("@/app/admin/actions");
  await toggleRestaurant(formData);
}
