import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "@google/generative-ai", "ethers", "siwe"],
  turbopack: {
    resolveAlias: {
      "@solana/web3.js": "./src/stubs/empty.js",
      "@mysten/sui/jsonRpc": "./src/stubs/empty.js",
      "@mysten/sui": "./src/stubs/empty.js",
    },
  },
};

export default nextConfig;
