/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    qualities: [75, 85, 90, 100],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
        '@prisma/adapter-pg': 'commonjs @prisma/adapter-pg',
      });
    }
    return config;
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg'],
};

module.exports = nextConfig;
