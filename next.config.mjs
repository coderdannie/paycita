/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["paycita.kayexpresslogisticsllc.com"],
    unoptimized: true,
  },
};

export default nextConfig;
