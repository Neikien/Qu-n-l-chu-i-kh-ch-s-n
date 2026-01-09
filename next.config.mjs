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
      {
        protocol: "https",
        hostname: "tse4.mm.bing.net",
        port: "",
        pathname: "/**",
      },
      // Nếu bạn muốn cho phép tất cả các server ảnh của Bing (tse1, tse2, tse3...)
      // thì có thể thêm dòng dưới đây (tùy chọn):
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
