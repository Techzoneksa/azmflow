/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["azm.jaadscloud.com", "localhost:3000"],
    },
  },
};

export default nextConfig;
