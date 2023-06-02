/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [ "localhost", "linear.yoganova.my.id", "linear-vps.yoganova.my.id"],
    disableStaticImages: true,
    unoptimized: true,
  },
  api: {
    responseLimit: '100mb',
  },
};


module.exports = nextConfig;
