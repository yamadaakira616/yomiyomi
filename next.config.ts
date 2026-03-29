import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/yomiyomi",
  images: { unoptimized: true },
};

export default nextConfig;
