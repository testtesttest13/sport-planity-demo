/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Disable static page generation to avoid build-time Supabase calls
  output: 'standalone',
}

module.exports = nextConfig

