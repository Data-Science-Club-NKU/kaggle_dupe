import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    // Define the file paths to copy
    const filesToCopy = [
      './data/train.csv',
      './data/test.csv',
      './data/Sample_submission.csv',
    ];

    // Add a rule to copy the files to the public directory
    config.module.rules.push({
      test: /\.(csv)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/files',  // Path in the browser
            outputPath: `${isServer ? '../' : ''}static/files`, // Path in the output directory
            name: '[name].[ext]',
            emitFile: !isServer,
          },
        },
      ],
    });

    return config;
  },
  output: 'export', // required for static websites
  distDir: 'dist', // output directory
  images: { unoptimized: true },
};

export default nextConfig;
