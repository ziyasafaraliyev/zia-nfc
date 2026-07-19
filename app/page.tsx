import LandingPage from "@/components/landing-page";
import WebChat from "@/components/web-chat";

const BASE_URL = "https://zianfc.vercel.app";

/** Schema.org structured data for the homepage */
const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zia NFC",
    alternateName: "Zia NFC Azerbaycan",
    url: BASE_URL,
    description:
      "Premium NFC vizit kartları, rəqəmsal profillər, portfoliolar və kontakt paylaşımı üçün mükəmməl həll.",
    inLanguage: "az",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/u/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zia NFC",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.webp`,
    description:
      "Azərbaycanda premium NFC vizit kart platforması. Rəqəmsal profillər, portfolio və kontakt paylaşımı.",
    foundingLocation: {
      "@type": "Place",
      addressCountry: "AZ",
      addressLocality: "Bakı",
    },
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["az", "ru", "en"],
    },
    offers: [
      {
        "@type": "Offer",
        name: "NFC Vizit Kart",
        description: "Premium NFC texnologiyalı rəqəmsal vizit kart",
        seller: { "@type": "Organization", name: "Zia NFC" },
      },
      {
        "@type": "Offer",
        name: "NFC Stiker",
        description: "Telefon və əşyalar üçün yapışqan NFC stiker",
        seller: { "@type": "Organization", name: "Zia NFC" },
      },
      {
        "@type": "Offer",
        name: "NFC Masa Standı",
        description: "Restoran və ofislər üçün NFC masa dayağı",
        seller: { "@type": "Organization", name: "Zia NFC" },
      },
    ],
  },
];

/**
 * Landing is a Server Component (static HTML + client islands).
 * WebChat is a tiny client launcher that dynamic-imports chat on first open.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026"),
        }}
      />
      <LandingPage />
      <WebChat />
    </>
  );
}

