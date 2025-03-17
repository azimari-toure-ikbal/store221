import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactStrictMode: false,
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "3jcovyf6o9.ufs.sh" },
    ],
  },
};

export default nextConfig;
