import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.transloadit.com',
      },
      {
        protocol: 'https',
        hostname: '**.transloadit.net',
      },
      {
        protocol: 'https',
        hostname: 'api2.transloadit.com',
      },
    ],
  },
};

export default nextConfig;
