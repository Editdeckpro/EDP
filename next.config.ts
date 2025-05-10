import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/image-generation/generate",
        destination: "/generate", // Keep the URL /image-generation/generate but show content from /generate
      },
      {
        source: "/remix-image/remix",
        destination: "/remix", // Keep the URL /image-remix/remix but show content from /remix
      },
    ];
  },
  images: {
    remotePatterns: [
      new URL("http://localhost:5000/images/**"),
      new URL("https://editdeckpro-backend.onrender.com/images/**"),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: 10 * 1024 * 1024, // 10 MB in bytes
    },
  },
};

export default nextConfig;
