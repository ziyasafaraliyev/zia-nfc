import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import VisitTracker from "@/components/VisitTracker";
import { WebMCPProvider } from "@/components/WebMCPProvider";
import "./globals.css";

/** Inter font has 100% full bold glyph support for Azerbaijani ə/Ə */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Zia NFC | Premium NFC Vizit Kart və Rəqəmsal Profil Platforması",
  description:
    "Azərbaycanda premium NFC vizit kartları, rəqəmsal profillər, vCard və restoran menyu QR sistemi. Bir toxunuşla kontakt və portfolio paylaşın.",
  keywords: [
    "NFC vizit kart",
    "NFC vizit kart Bakı",
    "rəqəmsal profil",
    "elektron vizitka",
    "smart vizit kart",
    "vCard paylaşımı",
    "restoran menyu QR",
    "NFC stiker",
    "Zia NFC",
    "rəqəmsal vizit kart",
  ],
  metadataBase: new URL("https://zianfc.vercel.app"),
  openGraph: {
    title: "Zia NFC | Premium NFC vizit kart platforması",
    description: "Premium NFC vizit kartları, rəqəmsal profillər, portfoliolar və kontakt paylaşımı üçün mükəmməl həll.",
    url: "https://zianfc.vercel.app",
    siteName: "Zia NFC",
    locale: "az_AZ",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Zia NFC Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zia NFC | Premium NFC vizit kart platforması",
    description: "Premium NFC vizit kartları, rəqəmsal profillər, portfoliolar və kontakt paylaşımı üçün mükəmməl həll.",
    images: ["/logo.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.webp", type: "image/webp" },
    ],
    apple: [
      { url: "/favicon.webp", type: "image/webp" },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az" className={`${inter.variable} ${outfit.variable}`}>
      <head />
      <body className="bg-white text-slate-950 antialiased">
        <WebMCPProvider />
        <VisitTracker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
