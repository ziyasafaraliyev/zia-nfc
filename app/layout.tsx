import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Zia NFC | Premium NFC vizit kart platforması",
  description:
    "Premium NFC vizit kartları, rəqəmsal profillər, portfoliolar və kontakt paylaşımı üçün mükəmməl həll.",
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
        url: "/logo.png",
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
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png" },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az">
      <body className={`${inter.variable} bg-white text-slate-950 antialiased`}>{children}</body>
    </html>
  );
}
