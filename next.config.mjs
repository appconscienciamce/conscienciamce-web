/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  // The stylesheet was the only render-blocking request of the page.
  experimental: { inlineCss: true },
  images: { qualities: [75, 90] },
};

export default nextConfig;
