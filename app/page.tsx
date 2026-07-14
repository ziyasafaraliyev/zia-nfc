import LandingPage from "@/components/landing-page";
import WebChat from "@/components/web-chat";

/**
 * Landing is a Server Component (static HTML + client islands).
 * WebChat is a tiny client launcher that dynamic-imports chat on first open.
 */
export default function Home() {
  return (
    <>
      <LandingPage />
      <WebChat />
    </>
  );
}

