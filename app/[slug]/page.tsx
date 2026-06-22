import { getRestaurantBySlug } from "@/lib/restaurants";
import { getProfileBySlug } from "@/lib/profiles";
import { notFound } from "next/navigation";
import ProfilePage from "@/app/u/[slug]/page";
import RestaurantPage from "@/app/r/[slug]/page";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const profile = await getProfileBySlug(slug);
  if (profile) {
    const ProfileMetadata = (await import("@/app/u/[slug]/page")).generateMetadata;
    return ProfileMetadata({ params: Promise.resolve({ slug }) });
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

export default async function CombinedPage({ params }: Props) {
  const { slug } = await params;

  // First check for profile
  const profile = await getProfileBySlug(slug);
  if (profile && profile.enabled) {
    return <ProfilePage params={Promise.resolve({ slug })} />;
  }

  // Then check for restaurant
  const restaurant = await getRestaurantBySlug(slug);
  if (restaurant && restaurant.enabled) {
    return <RestaurantPage params={Promise.resolve({ slug })} />;
  }

  return notFound();
}
