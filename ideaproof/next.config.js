/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      path: false,
      os: false,
      crypto: false,
    };
    return config;
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig;

