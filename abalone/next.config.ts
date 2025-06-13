import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove custom distDir to use default .next directory
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    // Simplified file handling
    config.module.rules.push({
      test: /\.(csv)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/files/[name][ext]'
      }
    });

    return config;
  },
  images: { 
    unoptimized: true 
  },
  // Optional: Add output configuration if needed
  output: 'standalone'
};

export default nextConfig;
