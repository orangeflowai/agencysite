import type { NextConfig } from "next";

// Extract Supabase hostname from env for dynamic image domain
function supabaseHostname(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  try { return new URL(url).hostname; } catch { return '*.supabase.co'; }
}

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
      { protocol: 'https', hostname: 'api.dicebear.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
      // Cloudflare R2 bucket URLs - Specific to user provided values
      { protocol: 'https', hostname: '6802e5ddd9360c77c3e4945d0a21c78a.r2.cloudflarestorage.com', pathname: '/romeagencywebsites/**' },
      { protocol: 'https', hostname: 'pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev', pathname: '/**' },
      // Your Supabase storage bucket
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
