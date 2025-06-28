import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com","randomuser.me","i.pravatar.cc"],
  },
  webpack: (config: WebpackConfig, { isServer }: { isServer: boolean }) => {
    // Only apply these settings for the server-side bundle
    if (isServer) {
      // Fixes npm packages that depend on `net` module
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        http2: false,
      };
    } else {
      // Client-side bundle
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "node:events": false,
        "node:process": false,
        "node:util": false,
        "node:http": false,
        "node:https": false,
        "node:zlib": false,
        "node:stream": false,
        "node:buffer": false,
        "node:url": false,
        "node:net": false,
        "node:tls": false,
        "node:crypto": false,
      };
    }
    return config;
  },
  // Ensure Firebase Admin is treated as external package
  transpilePackages: ['firebase-admin'],
};

export default nextConfig;
