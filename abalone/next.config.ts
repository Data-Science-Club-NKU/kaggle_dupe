import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    const filesToCopy = [
      './data/train.csv',
      './data/test.csv',
      './data/Sample_submission.csv',
    ];

    config.module.rules.push({
      test: /\.(csv)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/files',
            outputPath: `${isServer ? '../' : ''}static/files`,
            name: '[name].[ext]',
            emitFile: !isServer,
          },
        },
      ],
    });

    return config;
  },
  distDir: 'dist', // output directory
  images: { unoptimized: true },
};

export default nextConfig;
