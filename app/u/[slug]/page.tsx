import ProfilePageView from "@/components/profile-page-view";
import { profileAvatarSrc, profileCoverSrc } from "@/lib/media";
import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Long ISR window — admin save uses revalidatePath + revalidateTag.
 * Cold NFC taps hit CDN/edge cache when available.
 */
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile || !profile.enabled) {
    return {
      title: "Profil tapılmadı | Zia NFC",
      robots: { index: false, follow: false },
    };
  }
  const profileUrl = getProfileUrl(profile.slug);
  const title = `${profile.name}${profile.profession ? ` — ${profile.profession}` : ""}`;
  const description =
    profile.bio || `${profile.name} rəqəmsal profil, portfolio və əlaqə.`;
  const ogImage =
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
      type: "profile",
      images: ogImage ? [{ url: ogImage, alt: profile.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  // Same request as generateMetadata — React cache() dedupes Supabase call
  const profile = await getProfileBySlug(slug);
  if (!profile || !profile.enabled) notFound();

  const profileUrl = getProfileUrl(profile.slug);
  const qrUrl = `/u/${profile.slug}/qr`;

  // CDN-resized media for fast LCP on mobile NFC open
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
      {/* Early connection + LCP image hint for phone browsers */}
      {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
        <>
          <link
            rel="preconnect"
            href={process.env.NEXT_PUBLIC_SUPABASE_URL}
            crossOrigin="anonymous"
          />
          <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        </>
      ) : null}
      {lcpPreload ? (
        <link rel="preload" as="image" href={lcpPreload} fetchPriority="high" />
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
