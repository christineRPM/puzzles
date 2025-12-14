import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Ignore optional dependencies that aren't needed in browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false,
      };
      
      // Add alias to ignore these modules
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false,
      };
    }
    
    // Ignore these modules during webpack bundling
    config.plugins = config.plugins || [];
    const { IgnorePlugin } = require('webpack');
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /^@react-native-async-storage\/async-storage$/,
      }),
      new IgnorePlugin({
        resourceRegExp: /^pino-pretty$/,
      })
    );
    
    return config;
  },
};

export default nextConfig;
