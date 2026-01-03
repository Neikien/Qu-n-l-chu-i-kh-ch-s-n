"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiService } from "@/lib/api"; // Đảm bảo đường dẫn đúng

// Khu vực mặc định (Bạn có thể map từ API nếu DB có trường Region)
const regions = ["All", "Vietnam", "Asia", "Europe", "Americas"];

export default function DestinationsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. GỌI API LẤY DANH SÁCH KHÁCH SẠN
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // Gọi API lấy tất cả khách sạn
        const data = await apiService.getHotels();

        // Map dữ liệu từ API sang format của UI
        // Backend trả về: MaKS, TenKhachSan, DiaChi, MoTa, HinhAnh...
        const formattedData = data.map((hotel) => ({
          id: hotel.MaKS || hotel.id,
          name: hotel.TenKhachSan || hotel.name,
          location: hotel.DiaChi || "Unknown Location",
          // Giả lập region dựa trên địa chỉ (hoặc bạn cần thêm trường region vào DB)
          region: detectRegion(hotel.DiaChi),
          image:
            hotel.HinhAnh ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
          desc: hotel.MoTa || "Experience luxury and elegance at its finest.",
        }));

        setHotels(formattedData);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Hàm phụ: Đoán khu vực dựa trên địa chỉ (Tạm thời)
  const detectRegion = (address = "") => {
    if (
      address.includes("Vietnam") ||
      address.includes("Hà Nội") ||
      address.includes("Đà Nẵng")
    )
      return "Vietnam";
    if (
      address.includes("Japan") ||
      address.includes("China") ||
      address.includes("Thailand")
    )
      return "Asia";
    if (
      address.includes("France") ||
      address.includes("UK") ||
      address.includes("Germany")
    )
      return "Europe";
    if (address.includes("USA") || address.includes("Canada"))
      return "Americas";
    return "Asia"; // Mặc định
  };

  // 2. LOGIC LỌC: KẾT HỢP SEARCH + REGION
  const filteredHotels = hotels.filter((hotel) => {
    // Lọc theo Region
    const matchRegion =
      selectedRegion === "All" || hotel.region === selectedRegion;

    // Lọc theo Search Query (Tên khách sạn hoặc địa điểm)
    const matchSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRegion && matchSearch;
  });

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* --- HERO BANNER --- */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1920&auto=format&fit=crop"
          alt="Destinations Hero"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6 animate-fade-in-up">
            Discover The World
          </p>
          <h1 className="font-serif text-6xl md:text-8xl mb-6 animate-fade-in-up delay-100">
            Our Destinations
          </h1>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-[1320px] mx-auto py-20 px-5">
        {/* Intro & Filter Section */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-10 leading-tight">
            Let our newest openings inspire your next journey
          </h2>

          {/* --- THANH TÌM KIẾM (MỚI) --- */}
          <div className="mb-10 relative max-w-lg">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-b border-gray-300 py-3 pr-10 text-xl font-serif text-primary outline-none focus:border-accent transition-colors placeholder:text-gray-300 bg-transparent"
            />
            <svg
              className="w-5 h-5 absolute right-0 top-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Bộ lọc Region Tabs */}
          <div className="flex flex-wrap gap-8 border-b border-gray-100 pb-4">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`pb-3 text-sm font-medium uppercase tracking-[2px] transition-all ${
                  selectedRegion === region
                    ? "text-primary border-b-2 border-accent"
                    : "text-gray-400 hover:text-primary"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID HIỂN THỊ --- */}
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-[450px] bg-gray-200 mb-10 w-full"></div>
                <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 w-full mb-2"></div>
                <div className="h-4 bg-gray-200 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Ảnh Card */}
                  <div className="relative h-[450px] w-full overflow-hidden mb-10 bg-gray-100 shadow-sm">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Tag Location */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-primary">
                      {hotel.location}
                    </div>
                  </div>

                  {/* Thông tin */}
                  <div className="text-left">
                    <h3 className="font-serif text-3xl lg:text-4xl text-primary mb-6 leading-tight group-hover:text-accent transition-colors">
                      {hotel.name}
                    </h3>

                    <p className="text-lg text-secondary font-light leading-loose mb-10 line-clamp-3">
                      {hotel.desc}
                    </p>

                    <Link
                      href={`/rooms?hotel_id=${hotel.id}`} // Link tới trang Rooms của khách sạn đó
                      className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      Explore Hotel
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Empty State
              <div className="col-span-full text-center py-20">
                <p className="font-serif text-2xl text-gray-400">
                  No destinations found matching "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRegion("All");
                  }}
                  className="mt-4 text-sm font-bold uppercase tracking-widest text-accent hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
