import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactStrictMode: false,
  images: {
    loader: "custom",
    loaderFile: "./lib/loader.js",
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "3jcovyf6o9.ufs.sh" },
    ],
  },
};

export default nextConfig;
