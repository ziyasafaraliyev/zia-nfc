import type { Metadata } from "next";
import MainPlatformPage from "@/components/main-platform-page";
import WebChat from "@/components/web-chat";

const BASE_URL = "https://zianfc.vercel.app";

export const metadata: Metadata = {
  title: "Zia NFC — Rəqəmsal NFC & QR Platforması | Vizitkart, Menu, Pay, Car",
  description:
    "Zia NFC platforması: Ağıllı NFC vizit kartları (Zia Vizitkart), rəqəmsal restoran menyusu (Zia Menu), sürətli NFC ödəniş sistemi (Zia Pay) və avto təmas stikeri (Zia Car).",
  openGraph: {
    title: "Zia NFC — Rəqəmsal NFC & QR Platforması | Vizitkart, Menu, Pay, Car",
    description:
      "Biznesiniz və şəxsi brendiniz üçün 4 fərqli rəqəmsal NFC həlli tək platformada: Zia Vizitkart, Zia Menu, Zia Pay və Zia Car.",
    images: ["/logo.webp"],
  },
};

/** Schema.org structured data for the main homepage platform */
const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zia NFC Platform",
    alternateName: "Zia NFC Azerbaycan",
    url: BASE_URL,
    description:
      "Rəqəmsal NFC vizit kartları, restoran menyuları, NFC ödəniş və avto təmas həlləri birləşdirən platforma.",
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
      "Azərbaycanda rəqəmsal NFC və QR platforması: Zia Vizitkart, Zia Menu, Zia Pay, Zia Car.",
    foundingLocation: {
      "@type": "Place",
      addressCountry: "AZ",
      addressLocality: "Bakı",
    },
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["az", "en"],
    },
    offers: [
      {
        "@type": "Offer",
        name: "Zia Vizitkart — Premium NFC Vizit Kartı",
        description: "Rəqəmsal vizit profil, vCard ixracı və sosial platforma hostinq abunəliyi",
        seller: { "@type": "Organization", name: "Zia NFC" },
      },
      {
        "@type": "Offer",
        name: "Zia Menu — Rəqəmsal Restoran Menyusu",
        description: "Restoran və kafelər üçün QR/NFC rəqəmsal menyu platforması",
        seller: { "@type": "Organization", name: "Zia NFC" },
      },
      {
        "@type": "Offer",
        name: "Zia Pay — Sürətli NFC Ödəniş və Təşəkkür",
        description: "Kafelər və xidmət sektoru üçün NFC ödəniş və bəxşiş (tip) sistemi",
        seller: { "@type": "Organization", name: "Zia NFC" },
      },
      {
        "@type": "Offer",
        name: "Zia Car — Avto Təmas NFC & QR Stikeri",
        description: "Avtomobil ön şüşəsi üçün rəqəmsal təmas kartı və parkinq nömrə stikeri",
        seller: { "@type": "Organization", name: "Zia NFC" },
      },
    ],
  },
];

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
      <MainPlatformPage />
      <WebChat />
    </>
  );
}
