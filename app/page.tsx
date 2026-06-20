import LandingPage from "@/components/landing-page";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <LandingPage />
      <Script src="//code.tidio.co/czthpvfnredauldg6xwb3irtbvdz8u8y.js" strategy="afterInteractive" />
    </>
  );
}
