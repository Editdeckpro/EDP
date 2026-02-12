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
      new URL("https://editdeckpro-backend.onrender.com/**"),
      new URL("https://backend.editdeckpro.com/**"),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: 20 * 1024 * 1024, // 20 MB – match backend limit for image generation (reference images)
    },
  },
};

export default nextConfig;
