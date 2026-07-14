import Navbar from "@/components/pay/Navbar";
import Hero from "@/components/pay/Hero";
import MobileShowcase from "@/components/pay/MobileShowcase";
import HowItWorks from "@/components/pay/HowItWorks";
import Demo from "@/components/pay/Demo";
import Features from "@/components/pay/Features";
import ValueProp from "@/components/pay/ValueProp";
import TimeSaved from "@/components/pay/TimeSaved";
import Pricing from "@/components/pay/Pricing";
import FAQ from "@/components/pay/FAQ";
import CTA from "@/components/pay/CTA";
import Footer from "@/components/pay/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zia Pay — NFC & QR ilə menyu, səbət və ödəniş",
  description:
    "Zia Pay: müştəri NFC və ya QR oxudur, menyu açılır, səbətə yığır, təsdiqləyir və Apple Pay / Google Pay ilə tam və ya yediklərini seçərək ödəyir.",
  openGraph: {
    title: "Zia Pay — NFC & QR ilə menyu, səbət və ödəniş",
    description:
      "Menyu, səbət və ödəniş — bir NFC/QR toxunuşunda. Apple Pay & Google Pay.",
    siteName: "Zia Pay",
  },
};

export default function ZiaPayPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-950">
      <Navbar />
      <Hero />
      <MobileShowcase />
      <Demo />
      <HowItWorks />
      <Features />
      <ValueProp />
      <TimeSaved />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
