/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "franchise.sharetea.com.au",
      },
      {
        protocol: "https",
        hostname: "www.texanerin.com",
      },
    ],
  },
};

export default nextConfig;
