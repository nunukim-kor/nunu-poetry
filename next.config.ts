import type { NextConfig } from "next";
const nextConfig: NextConfig = { experimental: { optimizePackageImports: ["jose"] } };
export default nextConfig;
