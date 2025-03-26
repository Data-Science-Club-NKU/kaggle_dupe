import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      // Ensure CSV files are included in the build output
      "/api/*": ["./data/train.csv", "./data/test.csv", "./data/Sample_submission.csv"],
    },
  },
};

export default nextConfig;
