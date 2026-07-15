import { getRestaurantBySlug, getReviewsForRestaurant } from "@/lib/restaurants";
import { hasBuiltInMenu } from "@/lib/menu";
import { getRestaurantMenuPath } from "@/lib/urls";
import type { Metadata } from "next";
import {
  Instagram,
  MapPin,
  Music2,
  Phone,
  ExternalLink,
  Facebook,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RestaurantRating from "@/components/restaurant-rating";
import SmartImage from "@/components/smart-image";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.enabled) {
    return {
      title: "Restoran tapılmadı | Zia NFC",
      robots: { index: false, follow: false },
    };
  }
  const title = restaurant.name;
  const description =
    restaurant.description || `${restaurant.name} restoran, məhsullar və əlaqə.`;
  const image = restaurant.avatar_url || restaurant.cover_url || undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Zia NFC",
      type: "website",
      images: image ? [{ url: image, alt: restaurant.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.enabled) notFound();

  const reviews = restaurant.id ? await getReviewsForRestaurant(restaurant.id) : [];

  const coverStyle = restaurant.cover_style ?? "auto";
  const coverPosition = restaurant.cover_position ?? "center";
  const coverH =
    coverStyle === "banner"
      ? "h-52"
      : coverStyle === "square"
        ? "h-[30rem]"
        : "h-[24rem]";
  const objPos =
    coverPosition === "top"
      ? "object-top"
      : coverPosition === "bottom"
        ? "object-bottom"
        : "object-center";

  const hasSocials =
    restaurant.instagram ||
    restaurant.tiktok ||
    restaurant.facebook;

  const themeClass =
    restaurant.theme && restaurant.theme !== "light" ? `${restaurant.theme}-theme` : "";

  const gallery = restaurant.gallery || [];

  return (
    <main className={`lux-shell relative min-h-screen overflow-x-hidden ${themeClass}`}>
      {/* ── DEEP AMBIENT ATMOSPHERE ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="lux-orb-1 absolute -top-32 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full" />
        <div className="lux-orb-2 absolute right-[-15%] top-[20%] h-[28rem] w-[28rem] rounded-full" />
        <div className="lux-orb-3 absolute bottom-[-8%] left-[-12%] h-[32rem] w-[32rem] rounded-full" />
        <div className="lux-grid absolute inset-0" />
        <div className="lux-noise absolute inset-0 opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[440px] px-4 py-6 pb-16">
        {/* ── COVER + IDENTITY CARD ── */}
        <section className="lux-card lux-card-enter overflow-hidden rounded-b-[2.25rem] rounded-t-none">
          <div
            className={`${restaurant.cover_url ? "bg-[#1e1b4b]" : "lux-hero"} relative ${coverH} overflow-hidden`}
          >
            {restaurant.cover_url ? (
              <>
                <SmartImage
                  src={restaurant.cover_url}
                  alt=""
                  role="presentation"
                  fill
                  priority
                  sizes="(max-width: 440px) 100vw, 440px"
                  className={`object-cover ${objPos} opacity-70`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
              </>
            ) : null}

            <div className="lux-cover-shimmer absolute inset-0" />

            <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
              <Link
                href="/"
                className="lux-badge flex items-center gap-1.5 rounded-full px-2 py-1.5 pr-3 transition hover:opacity-90 active:scale-[0.98]"
              >
                <Image src="/logo.webp" alt="Zia NFC" width={18} height={18} className="size-[18px] rounded-full object-cover" />
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/90">
                  Zia NFC
                </span>
              </Link>
            </div>
          </div>

          <div className={`lux-identity px-5 pb-6 ${restaurant.avatar_url ? "pt-0" : "pt-5"}`}>
            <div className="flex items-end gap-4">
              {restaurant.avatar_url ? (
                <div className="-mt-16 shrink-0 relative z-10">
                  <div className="lux-avatar-ring p-[3px] rounded-[1.7rem]">
                    <SmartImage
                      src={restaurant.avatar_url}
                      alt={restaurant.name}
                      width={112}
                      height={112}
                      priority
                      sizes="112px"
                      className="size-[7rem] rounded-[1.55rem] object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div className="pb-1 min-w-0">
                <h1 className="lux-name mt-1 leading-[1.1]">
                  {restaurant.name}
                </h1>
              </div>
            </div>

            {restaurant.description ? (
              <p className="lux-bio mt-4">
                {restaurant.description}
              </p>
            ) : null}
          </div>
        </section>

        {/* ── PRIMARY ACTION BUTTONS ── */}
        <div className="mt-3 grid gap-2.5">
          {restaurant.phone ? (
            <a
              href={`tel:${restaurant.phone}`}
              className="lux-btn-call group lux-card-enter-3 transition-transform duration-200 hover:scale-[1.02]"
            >
              <Phone
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>Zəng et</span>
            </a>
          ) : null}

          {hasBuiltInMenu(restaurant.menu) ? (
            <Link
              href={getRestaurantMenuPath(restaurant.slug)}
              className="group lux-card-enter-2 flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-white text-[#29AEEE] font-bold text-sm shadow-[0_20px_40px_rgba(41,174,238,0.18)] transition-all duration-200 hover:scale-[1.02] hover:bg-[#f3fcff]"
            >
              <Menu
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>Menyu</span>
            </Link>
          ) : restaurant.menu_url ? (
            <a
              href={restaurant.menu_url}
              target="_blank"
              rel="noreferrer"
              className="group lux-card-enter-2 flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-white text-[#29AEEE] font-bold text-sm shadow-[0_20px_40px_rgba(41,174,238,0.18)] transition-all duration-200 hover:scale-[1.02] hover:bg-[#f3fcff]"
            >
              <Menu
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>Menyu</span>
            </a>
          ) : null}
        </div>

        {/* ── SOCIAL LINKS ── */}
        {hasSocials ? (
          <div className="mt-3 grid grid-cols-3 gap-2 lux-card-enter-5">
            {restaurant.instagram ? (
              <SocialChip
                href={restaurant.instagram}
                icon={<Instagram size={18} />}
                label="Instagram"
                variant="instagram"
              />
            ) : null}
            {restaurant.tiktok ? (
              <SocialChip
                href={restaurant.tiktok}
                icon={<Music2 size={18} />}
                label="TikTok"
                variant="tiktok"
              />
            ) : null}
            {restaurant.facebook ? (
              <SocialChip
                href={restaurant.facebook}
                icon={<Facebook size={18} />}
                label="Facebook"
                variant="facebook"
              />
            ) : null}
          </div>
        ) : null}

        {/* ── MAPS LOCATION BUTTON ── */}
        {restaurant.location_name && restaurant.location_url ? (
          <a
            href={restaurant.location_url}
            target="_blank"
            rel="noreferrer"
            className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
          >
            <span className="flex items-center gap-3">
              <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
                <MapPin size={16} className="text-[#29AEEE]" />
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-gray-800">Konum</span>
                <span className="text-[10px] font-semibold text-gray-400 mt-0.5">{restaurant.location_name}</span>
              </span>
            </span>
            <ExternalLink
              size={15}
              className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        ) : null}

        {/* ── GALLERY ── */}
        {gallery.length > 0 ? (
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white transition-transform duration-200 hover:scale-[1.02]"
                >
                  <SmartImage
                    src={url}
                    alt={`${restaurant.name} qalereya ${idx + 1}`}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {/* ── RATING & REVIEWS ── */}
        {restaurant.id && <RestaurantRating 
          restaurantId={restaurant.id}
          currentRating={restaurant.rating}
          reviews={reviews}
        />}

        {/* ── FOOTER ── */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="lux-footer-divider" />
          <div className="mt-2 flex items-center gap-1.5">
            <Image src="/logo.webp" alt="Zia NFC" width={16} height={16} className="size-4 rounded-full object-cover opacity-60" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              Powered by <span className="lux-brand-text">Zia NFC</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function SocialChip({
  href,
  icon,
  label,
  variant,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  variant:
  | "instagram"
  | "tiktok"
  | "facebook";
}) {
  const variantClass = {
    instagram: "lux-social-instagram",
    tiktok: "lux-social-tiktok",
    facebook: "lux-social-facebook",
  }[variant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`lux-social-chip ${variantClass} group flex min-h-[3.75rem] flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.95]`}
    >
      <span className="lux-social-icon transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <span className="text-[10px] font-bold tracking-wide text-gray-500">{label}</span>
    </a>
  );
}
