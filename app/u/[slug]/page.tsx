import ProfilePageView from "@/components/profile-page-view";
import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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
  const image = profile.avatar_url || profile.background_url || undefined;
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
      images: image ? [{ url: image, alt: profile.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile || !profile.enabled) notFound();

  const profileUrl = getProfileUrl(profile.slug);
  const qrUrl = `/u/${profile.slug}/qr`;

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
    image: profile.avatar_url ?? undefined,
    telephone: profile.phone ?? profile.whatsapp ?? undefined,
    address: profile.location ?? undefined,
    sameAs,
  };

  return (
    <ProfilePageView
      profile={profile}
      profileUrl={profileUrl}
      qrUrl={qrUrl}
      jsonLd={jsonLd}
    />
  );
}