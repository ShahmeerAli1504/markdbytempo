/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'example.supabase.co';

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: supabaseHost }],
  },
  experimental: {
    serverActions: { bodySizeLimit: '6mb' },
  },
  // There are no accounts on this site — send any old login/dashboard links home.
  async redirects() {
    return [
      { source: '/login', destination: '/', permanent: true },
      { source: '/signup', destination: '/get-sponsored', permanent: true },
      { source: '/dashboard/:path*', destination: '/', permanent: true },
      { source: '/dashboard', destination: '/', permanent: true },
      { source: '/auth/:path*', destination: '/', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
