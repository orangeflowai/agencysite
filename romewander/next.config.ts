import type { NextConfig } from "next";

// Extract Supabase hostname from env for dynamic image domain
function supabaseHostname(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  try { return new URL(url).hostname; } catch { return '*.supabase.co'; }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
      { protocol: 'https', hostname: 'api.dicebear.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
      // Cloudflare R2 — standard public bucket URLs (add custom CDN domain below if mapped)
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.pub.r2.dev', pathname: '/**' },
      // Your Supabase storage bucket — auto-detected from NEXT_PUBLIC_SUPABASE_URL
      { protocol: 'https', hostname: supabaseHostname(), pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
