/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ مهم جداً لحل مشكلة Docker

  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    domains: [
      'cnn-arabic-images.cnn.io',
      'backend.bishahcc.org',
      'bishahcc.org',
      'localhost',
      'bisha.runasp.net',
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext]',
      },
    });
    return config;
  },
};

export default nextConfig;
