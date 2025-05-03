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
    remotePatterns: [new URL("http://localhost:5000/images/**")],
  },
};

export default nextConfig;
