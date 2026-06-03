import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Zia NFC | Premium NFC business card platform",
  description:
    "Premium NFC business cards with digital profiles, portfolios, QR fallback, and contact sharing.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az">
      <body className={`${inter.variable} bg-white text-slate-950 antialiased`}>{children}</body>
    </html>
  );
}
