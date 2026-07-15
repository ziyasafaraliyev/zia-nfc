import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioClient from "./PortfolioClient";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile || !profile.enabled) {
    return {
      title: "Portfolio tapılmadı | Zia NFC",
      robots: { index: false, follow: false },
    };
  }

  const profileUrl = getProfileUrl(profile.slug);
  return {
    title: `${profile.name} — Portfolio | Zia NFC`,
    alternates: { canonical: `${profileUrl}/portfolio` },
    openGraph: {
      title: `${profile.name} — Portfolio`,
      url: `${profileUrl}/portfolio`,
      siteName: "Zia NFC",
      type: "website",
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile || !profile.enabled) notFound();
  
  return <PortfolioClient profile={profile} />;
}

