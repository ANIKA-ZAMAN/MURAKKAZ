import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/work", destination: "/collections" },
      { source: "/services", destination: "/compare" },
      { source: "/products", destination: "/shop" },
      { source: "/research", destination: "/scent-index" },
      { source: "/about-the-studio", destination: "/our-story" },
      { source: "/about", destination: "/our-story" },
    ];
  },
};

export default nextConfig;
