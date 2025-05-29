/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
