/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev' },
      { protocol: 'https', hostname: 'ogrvhooygcoazracbvkb.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'admin.wondersofrome.com' },
    ],
  },
}

export default nextConfig
