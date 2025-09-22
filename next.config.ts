import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Silence workspace root inference warning by pinning the root to this project
    root: __dirname,
  },
};

export default nextConfig;
