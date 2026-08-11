import type { Metadata } from "next";
import LandingPage from "@/components/landing-page";
import WebChat from "@/components/web-chat";

export const metadata: Metadata = {
  title: "Zia Vizitkart — Premium NFC Vizit Kartları və Rəqəmsal Profillər",
  description:
    "Bir toxunuşla əlaqələrinizi, sosial şəbəkələrinizi və biznes profilinizi saniyələr içində paylaşın. Premium NFC vizit kart platforması.",
  openGraph: {
    title: "Zia Vizitkart — Premium NFC Vizit Kartları və Rəqəmsal Profillər",
    description:
      "Bir toxunuşla əlaqələrinizi, sosial şəbəkələrinizi və biznes profilinizi saniyələr içində paylaşın.",
    images: ["/logo.webp"],
  },
};

export default function VizitkartPage() {
  return (
    <>
      <LandingPage />
      <WebChat />
    </>
  );
}
