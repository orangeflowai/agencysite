# Cloudflare R2 Image Hosting Setup for Rome Agency Websites

This guide explains how to configure and use Cloudflare R2 for hosting tour images across all agency sites (`romewander`, `wondersofrome`, `romewebsite`, `ticketsinrome-live`).

## 1. Cloudflare Dashboard Configuration

1.  **Create Bucket**: Ensure a bucket named `romeagencywebsites` exists in your Cloudflare R2 dashboard.
2.  **CORS Policy**: Add the following CORS policy to your bucket to allow the Next.js dev server and production domains to access images:
    ```json
    [
      {
        "AllowedOrigins": ["*"],
        "AllowedMethods": ["GET"],
        "AllowedHeaders": ["*"]
      }
    ]
    ```
3.  **Public Access**: Enable the **Public Bucket URL** or connect a custom domain (e.g., `images.romewander.com`) for SEO-friendly image paths.

## 2. Next.js Configuration (`next.config.ts`)

All sites have been updated with the following `images.remotePatterns` to allow loading from R2:

```typescript
const nextConfig: NextConfig = {
    // ...
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '6802e5ddd9360c77c3e4945d0a21c78a.r2.cloudflarestorage.com',
                pathname: '/romeagencywebsites/**',
            },
            {
                protocol: 'https',
                hostname: 'pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev',
                pathname: '/**',
            },
        ],
    },
    compiler: {
        styledComponents: true, // Required for Sanity UI compatibility
    },
};
```

## 3. Uploading Images

- **Option A (Manual)**: Upload images directly via the Cloudflare dashboard.
- **Option B (S3 API)**: Use an S3-compatible tool (like Rclone or AWS CLI) with your R2 credentials to bulk upload.
- **Option C (Sanity Sync)**: Your Sanity CMS is configured to store metadata, but `TourCard` now handles both Sanity CDN and direct R2 URLs.

## 4. Troubleshooting Build Errors

If you see `styled-components` missing errors during build:
1.  Verify `package.json` contains `"styled-components": "^6.1.1"` in `dependencies`.
2.  Verify `next.config.ts` has `compiler: { styledComponents: true }`.
3.  Ensure `npm install --legacy-peer-deps` is used on Vercel to handle Sanity UI dependency conflicts.

---
*Created by Antigravity*
