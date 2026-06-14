import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

  const images = profile.gallery ?? [];

  return (
    <main className="lux-shell relative min-h-screen overflow-x-hidden">
      <div className="relative z-10 mx-auto max-w-[440px] px-4 py-6 pb-16">
        <header className="mt-2">
          <p className="lux-overline">Selected work</p>
          <h1 className="lux-name mt-1">{profile.name}</h1>
          {profile.profession ? (
            <p className="lux-overline mt-1">{profile.profession}</p>
          ) : null}
        </header>

        {images.length > 0 ? (
          <section className="mt-6">
            <div className="grid grid-cols-2 gap-2.5">
              {images.map((image, index) => (
                <a
                  key={`${image}-${index}`}
                  href={image}
                  target="_blank"
                  rel="noreferrer"
                  className={`${index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"} group relative overflow-hidden rounded-[1.5rem] lux-gallery-item`}
                >
                  <img
                    src={image}
                    alt={`${profile.name} — iş ${index + 1}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-3 right-3 flex size-8 translate-y-2 items-center justify-center rounded-full lux-gallery-btn opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={14} />
                  </div>
                </a>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-10 rounded-[2.25rem] border border-white/80 bg-white/60 p-6 text-center">
            <p className="text-sm font-bold text-slate-700">Hələ portfolio yoxdur.</p>
          </section>
        )}
      </div>
    </main>
  );
}

