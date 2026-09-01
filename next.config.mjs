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
  // Prevent browsers from caching page HTML across deploys — a stale page
  // (old design, old JS) served from a visitor's disk cache after a new
  // release causes hydration/chunk mismatches. `_next/static` assets are
  // content-hashed already, so they're excluded and keep their normal
  // long-lived cache.
  async headers() {
    return [
      {
        source: '/:path((?!_next|favicon.ico|manifest.json).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
