import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['africastalking'],
  /* config options here */
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}

export default nextConfig
