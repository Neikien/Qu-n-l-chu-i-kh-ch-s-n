"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// 1. DANH SÁCH ẢNH MOCK DATA (Dùng để hiển thị cho đẹp vì DB chưa có ảnh xịn)
const MOCK_IMAGES = [
  "https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-4068417844-16x9?", // Ảnh 1 -HN
  "https://phuquoc.regenthotels.com/sites/rpq/files/styles/width_1920/public/homepage/Drone%20beach%20%282%29.jpg?itok=sIrMX5EB", // Ảnh 2 - ĐN
  "https://phuquoc.regenthotels.com/sites/rpq/files/styles/height_1400/public/homepage/OneBedroomSkyPoolVilla.jpg?itok=02RUSs_N", // Ảnh 3 - NT
  "https://phuquoc.regenthotels.com/sites/rpq/files/styles/height_1400/public/homepage/R6WI8638%20copy.jpg?itok=1AeuwdT6", // Ảnh 4 Da Lat
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200&auto=format&fit=crop", // Ảnh 5 TPHCM
  "https://phuquoc.regenthotels.com/sites/rpq/files/styles/height_1400/public/homepage/DSC07735re2.jpg?itok=7xE6xiRd", // Ảnh 6 Thanh Hóa
];

const regions = ["All", "Asia", "Europe", "Americas", "Oceania"];

export default function DestinationsPage() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 2. GỌI API LẤY KHÁCH SẠN ---
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(
          "https://khachsan-backend-production-9810.up.railway.app/hotels/?skip=0&limit=100"
        );
        if (!res.ok) throw new Error("Failed to fetch hotels");

        const data = await res.json();

        // --- 3. KẾT HỢP DATA THẬT + ẢNH MOCK ---
        const formattedHotels = data.map((h, index) => {
          // Xử lý địa chỉ ngắn gọn
          const addressParts = h.DiaChi ? h.DiaChi.split(",") : [];
          const shortLocation =
            addressParts.length > 0
              ? addressParts[addressParts.length - 1].trim()
              : "Vietnam";

          return {
            id: h.MaKS,
            name: h.TenKS, // Tên thật từ DB
            location: shortLocation, // Địa chỉ thật (đã rút gọn)
            region: "Asia",
            // QUAN TRỌNG: Lấy ảnh từ MOCK_IMAGES theo thứ tự (index % độ dài mảng)
            image: MOCK_IMAGES[index % MOCK_IMAGES.length],
            desc: h.MoTa || "Experience luxury in the heart of Vietnam.", // Mô tả thật
          };
        });

        setHotels(formattedHotels);
      } catch (error) {
        console.error("Lỗi tải khách sạn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels =
    selectedRegion === "All"
      ? hotels
      : hotels.filter((item) => item.region === selectedRegion);

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. HERO BANNER */}
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

      {/* 2. MAIN CONTENT */}
      <div className="max-w-[90%] mx-auto py-20 px-5">
        {/* Intro & Filter */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-10 leading-tight">
            Let our newest openings inspire your next journey
          </h2>

          {/* Filter Tabs */}
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

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-serif text-xl">
            Loading destinations...
          </div>
        ) : (
          /* 3. GRID KHÁCH SẠN */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Ảnh Card (Dùng ảnh Mock) */}
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

                  {/* Thông tin (Dữ liệu thật từ API) */}
                  <div className="text-left">
                    <h3 className="font-serif text-3xl lg:text-4xl text-primary mb-6 leading-tight group-hover:text-accent transition-colors">
                      {hotel.name}
                    </h3>

                    <p className="text-lg text-secondary font-light leading-loose mb-10 line-clamp-3">
                      {hotel.desc}
                    </p>

                    {/* Nút Explore - Dẫn về trang phòng của khách sạn đó */}
                    <Link
                      href={`/rooms?hotel_id=${hotel.id}`}
                      className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      Explore Hotel
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Empty State
              <div className="col-span-full text-center py-20 text-gray-400 font-serif text-xl">
                No hotels found in {selectedRegion}.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
