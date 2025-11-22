/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "digital.ihg.com" },
      { protocol: "https", hostname: "www.angsana.com" },
    ],
  },
};
export default nextConfig;
