import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  allowedDevOrigins: ["192.168.1.53", "192.168.1.102", "192.168.0.105"],
};

export default nextConfig;
