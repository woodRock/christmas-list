import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/christmas-list",
  assetPrefix: "/christmas-list/",
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
