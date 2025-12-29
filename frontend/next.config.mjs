/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "digital.ihg.com",
      },
      {
        protocol: "https",
        hostname: "www.angsana.com",
      },
      {
        protocol: "https",
        hostname: "phuquoc.regenthotels.com", // <-- DÒNG MỚI THÊM VÀO ĐÂY
      },
    ],
  },
};

export default nextConfig;
