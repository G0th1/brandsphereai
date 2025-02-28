/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { 
    domains: ['lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com'],
    unoptimized: true 
  },
  typescript: {
    // !! WARN !!
    // Genom att ignorera typfel under bygget kan  
    // det leda till runtime-fel i produktionen.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Inaktivera ESLint under bygget
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;
