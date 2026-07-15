import ProfilePageView from "@/components/profile-page-view";
import RestaurantPage from "@/app/r/[slug]/page";
import { profileAvatarSrc, profileCoverSrc } from "@/lib/media";
import { getProfileBySlug } from "@/lib/profiles";
import { getRestaurantBySlug } from "@/lib/restaurants";
import { getProfileUrl } from "@/lib/urls";
import { notFound } from "next/navigation";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const profile = await getProfileBySlug(slug);
  if (profile) {
    const profileUrl = getProfileUrl(profile.slug);
    const title = `${profile.name}${profile.profession ? ` — ${profile.profession}` : ""}`;
    const description =
      profile.bio || `${profile.name} rəqəmsal profil, portfolio və əlaqə.`;
    const image =
      profileAvatarSrc(profile.avatar_url) ||
      profileCoverSrc(profile.background_url) ||
      undefined;
    return {
      title,
      description,
      alternates: { canonical: profileUrl },
      openGraph: {
        title,
        description,
        url: profileUrl,
        siteName: "Zia NFC",
        type: "profile" as const,
        images: image ? [{ url: image, alt: profile.name }] : undefined,
      },
    };
  }

  const restaurant = await getRestaurantBySlug(slug);
  if (restaurant) {
    const RestaurantMetadata = (await import("@/app/r/[slug]/page")).generateMetadata;
    return RestaurantMetadata({ params: Promise.resolve({ slug }) });
  }

  return {
    title: "Səhifə tapılmadı | Zia NFC",
  };
}

/**
 * Short NFC URL: /{slug}
 * Renders profile view directly (no nested page re-fetch).
 */
export default async function CombinedPage({ params }: Props) {
  const { slug } = await params;

  const profile = await getProfileBySlug(slug);
  if (profile?.enabled) {
    const profileUrl = getProfileUrl(profile.slug);
    const qrUrl = `/u/${profile.slug}/qr`;
    const avatarSrc = profileAvatarSrc(profile.avatar_url);
    const coverSrc = profileCoverSrc(profile.background_url);
    const fastProfile = {
      ...profile,
      avatar_url: avatarSrc ?? profile.avatar_url,
      background_url: coverSrc ?? profile.background_url,
    };

    const sameAs = [
      profile.instagram,
      profile.tiktok,
      profile.website,
      profile.facebook,
      profile.x,
      profile.linkedin,
      profile.youtube,
      profile.behance,
      profile.threads,
      profile.whatsapp
        ? profile.whatsapp.startsWith("http")
          ? profile.whatsapp
          : `https://wa.me/${profile.whatsapp.replace(/[^\d]/g, "")}`
        : null,
    ].filter(Boolean) as string[];

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.profession ?? undefined,
      description: profile.bio ?? undefined,
      url: profileUrl,
      image: avatarSrc ?? profile.avatar_url ?? undefined,
      telephone: profile.phone ?? profile.whatsapp ?? undefined,
      address: profile.location ?? undefined,
      sameAs,
    };

    const lcpPreload = avatarSrc || coverSrc;

    return (
      <>
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
          <>
            <link
              rel="preconnect"
              href={process.env.NEXT_PUBLIC_SUPABASE_URL}
              crossOrigin="anonymous"
            />
            <link
              rel="dns-prefetch"
              href={process.env.NEXT_PUBLIC_SUPABASE_URL}
            />
          </>
        ) : null}
        {lcpPreload ? (
          <link
            rel="preload"
            as="image"
            href={lcpPreload}
            fetchPriority="high"
          />
        ) : null}
        <ProfilePageView
          profile={fastProfile}
          profileUrl={profileUrl}
          qrUrl={qrUrl}
          jsonLd={jsonLd}
        />
      </>
    );
  }

  const restaurant = await getRestaurantBySlug(slug);
  if (restaurant?.enabled) {
    return <RestaurantPage params={Promise.resolve({ slug })} />;
  }

  return notFound();
}
