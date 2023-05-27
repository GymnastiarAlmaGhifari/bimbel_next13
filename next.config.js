/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["th.bing.com", "img.jakpost.net", "indopolitika.com", "localhost", "linear.yoganova.my.id", "linear-vps.yoganova.my.id"],
    disableStaticImages: true,
    unoptimized: true,
  },
  api: {
    responseLimit: '100mb',
  },
};


module.exports = nextConfig;
