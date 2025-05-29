import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.sonata.io.vn",
      },
      {
        protocol: "https",
        hostname: "sonata.io.vn",
      },
    ],
  },
};

export default nextConfig;
