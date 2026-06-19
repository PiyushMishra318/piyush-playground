import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/products/playground",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
