import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Content-Security-Policy
 * - unsafe-inline needed for Next.js / Tailwind runtime styles
 * - unsafe-eval avoided in production when possible; Next 15 still may need it in dev
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' blob: data: https://*.supabase.co",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://integrate.api.nvidia.com https://va.vercel-scripts.com https://*.vercel-insights.com",
  "frame-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "ilwloubhfkcewjfkbgbs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {
      // Portfolio / multi-image admin uploads (unchanged capacity)
      bodySizeLimit: "50mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Never cache admin UI
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
        ],
      },
      {
        source: "/restoran/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
        ],
      },
      {
        // Public static brand assets — long cache
        source: "/:file(logo|favicon|logo-pay|favicon-pay|ziya|vizit-kart|stiker|masa-standi).webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // NOTE: do not set Cache-Control on /u or /r HTML — breaks App Router RSC/navigation
    ];
  },
};

export default nextConfig;
