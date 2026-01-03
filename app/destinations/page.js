"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// 1. DỮ LIỆU GIẢ (MOCK DATA)
const hotels = [
  {
    id: 1,
    name: "InterContinental Crete",
    location: "Greece",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    desc: "Set against a stunning seaside backdrop, this luxurious urban resort on Mirabello Bay offers an iconic escape. Open seasonally, serves as your serene island retreat, featuring inspiring infinity pools, exquisite Greek dining options, and refined design.",
  },
  {
    id: 2,
    name: "InterContinental Auckland",
    location: "New Zealand",
    region: "Oceania",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    desc: "A luxury haven overlooking the Harbour, InterContinental Auckland is your window to the Waitematā. Unwind in the sanctuary of our elegant guest rooms and set out to connect with the tapestry of local culture, art, and cuisine from this stunning waterfront destination.",
  },
  {
    id: 3,
    name: "InterContinental Danang Sun Peninsula",
    location: "Vietnam",
    region: "Asia",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    desc: "Where myth meets luxury on the Son Tra Peninsula. A resort designed by Bill Bensley that redefines elegance with private pool villas and world-class dining.",
  },
  {
    id: 4,
    name: "InterContinental Paris Le Grand",
    location: "France",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
    desc: "Experience the essence of Parisian elegance overlooking the Opera Garnier. A historic landmark that has hosted royalty and artists for centuries.",
  },
  {
    id: 5,
    name: "InterContinental Maldives Maamunagau",
    location: "Maldives",
    region: "Asia",
    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1200&auto=format&fit=crop",
    desc: "Escape to the infinite blue of the Indian Ocean in our exclusive island sanctuary. The first and only All-Club InterContinental resort.",
  },
  {
    id: 6,
    name: "InterContinental New York Barclay",
    location: "USA",
    region: "Americas",
    image:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1200&auto=format&fit=crop",
    desc: "Classic luxury in the heart of Manhattan, merging history with modern sophistication. Just steps away from Park Avenue and high-end shopping.",
  },
];

const regions = ["All", "Asia", "Europe", "Americas", "Oceania"];

export default function DestinationsPage() {
  const [selectedRegion, setSelectedRegion] = useState("All");

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

          {/* Bộ lọc (Filter Tabs) */}
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

        {/* 3. DESTINATIONS GRID (2 CỘT - CHỮ TO - NÚT CHUẨN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="group cursor-pointer flex flex-col">
              {/* Ảnh Card (Khổ Ngang - Landscape) */}
              <div className="relative h-[450px] w-full overflow-hidden mb-10 bg-gray-100 shadow-sm">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Tag Location nhỏ trên ảnh */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-primary">
                  {hotel.location}
                </div>
              </div>

              {/* Thông tin (Căn trái - Typography Luxury) */}
              <div className="text-left">
                {/* Tên Khách sạn (Serif, To 3xl-4xl) */}
                <h3 className="font-serif text-3xl lg:text-4xl text-primary mb-6 leading-tight group-hover:text-accent transition-colors">
                  {hotel.name}
                </h3>

                {/* Mô tả (Font Sans, 18px, Giãn dòng rộng) */}
                <p className="text-lg text-secondary font-light leading-loose mb-10">
                  {hotel.desc}
                </p>

                {/* Nút Explore (Đồng bộ kích thước với nút Home/Experience) */}
                <Link
                  href={`/rooms`}
                  className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase text-primary hover:bg-primary hover:text-white transition-all"
                >
                  Explore Hotel
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHotels.length === 0 && (
          <div className="text-center py-32 text-gray-400 font-serif text-2xl">
            <p>No destinations found in this region.</p>
          </div>
        )}
      </div>
    </main>
  );
}
