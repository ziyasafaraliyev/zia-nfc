import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://code.tidio.co https://*.tidio.co https://*.tidio.com https://*.tidiochat.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.tidio.co https://*.tidio.com https://*.tidiochat.com; img-src 'self' blob: data: https://*.supabase.co https://*.tidio.co https://*.tidio.com https://*.tidiochat.com; font-src 'self' data: https://fonts.gstatic.com https://*.tidio.co https://*.tidio.com https://*.tidiochat.com; connect-src 'self' https://*.supabase.co https://*.tidio.co wss://*.tidio.co https://*.tidio.com wss://*.tidio.com https://*.tidiochat.com wss://*.tidiochat.com; frame-src 'self' https://*.tidio.co https://*.tidio.com https://*.tidiochat.com; media-src 'self' https://*.tidio.co https://*.tidio.com https://*.tidiochat.com; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
