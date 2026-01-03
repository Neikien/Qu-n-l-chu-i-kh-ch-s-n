"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Hàm format tiền tệ VND
const formatCurrency = (amount) => {
  // Chuyển đổi string "1800000.00" thành số float trước khi format
  const num = parseFloat(amount);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

// Danh sách ảnh ngẫu nhiên để fallback (vì JSON của bạn không có trường HinhAnh)
const RANDOM_IMAGES = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800",
];

function RoomsContent() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotel_id");

  const [rooms, setRooms] = useState([]);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let roomsUrl =
          "https://khachsan-backend-production-9810.up.railway.app/rooms/?skip=0&limit=100";

        // --- 1. LẤY THÔNG TIN KHÁCH SẠN (Header) ---
        if (hotelId) {
          roomsUrl = `https://khachsan-backend-production-9810.up.railway.app/rooms/?hotel_id=${hotelId}`;
          const hotelsRes = await fetch(
            "https://khachsan-backend-production-9810.up.railway.app/hotels/?skip=0&limit=100"
          );
          if (hotelsRes.ok) {
            const hotelsData = await hotelsRes.json();
            const currentHotel = hotelsData.find(
              (h) => h.MaKS.toString() === hotelId.toString()
            );
            if (currentHotel) {
              setHotelInfo(currentHotel);
            }
          }
        }

        // --- 2. LẤY DANH SÁCH PHÒNG TỪ BACKEND ---
        const res = await fetch(roomsUrl);
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const rawData = await res.json();

        // --- 3. MAP DỮ LIỆU JSON BACKEND -> FRONTEND ---
        const formattedRooms = rawData.map((room, index) => ({
          id: room.MaPhong, // VD: 29111

          // Ưu tiên hiển thị Loại Phòng. Nếu có TenPhong thì dùng, không thì dùng LoaiPhong
          name: room.TenPhong || room.LoaiPhong || `Phòng ${room.MaPhong}`,

          // Chuyển giá từ string "1800000.00" sang số
          price: room.GiaPhong,

          // Vì JSON không có ảnh, ta lấy ảnh random cho đẹp
          image: room.HinhAnh || RANDOM_IMAGES[index % RANDOM_IMAGES.length],

          // Tạo mô tả tự động nếu backend không gửi MoTa
          desc:
            room.MoTa ||
            `Trải nghiệm không gian sang trọng tại ${room.LoaiPhong} (Mã số: ${room.MaPhong}). Đầy đủ tiện nghi đẳng cấp.`,

          status: room.TinhTrang, // "Trống" hoặc "Đã đặt"
        }));

        setRooms(formattedRooms);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId]);

  return (
    <>
      {/* HERO BANNER */}
      <div className="relative h-[50vh] w-full overflow-hidden bg-gray-900">
        <Image
          src={
            hotelInfo?.HinhAnh ||
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1920"
          }
          alt="Rooms Hero"
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-4 animate-fade-in-up">
            Accommodation
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 animate-fade-in-up delay-100 drop-shadow-lg">
            {hotelInfo ? hotelInfo.TenKS : "Phòng Nghỉ & Suites"}
          </h1>
          {hotelInfo && (
            <p className="text-lg font-light max-w-2xl opacity-90">
              {hotelInfo.DiaChi}
            </p>
          )}
        </div>
      </div>

      {/* ROOM LIST */}
      <div className="max-w-[1320px] mx-auto py-20 px-5">
        {/* Breadcrumb */}
        <div className="mb-10 text-xs font-bold tracking-widest text-gray-400 uppercase">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          {hotelInfo ? (
            <>
              <Link
                href="/destinations"
                className="hover:text-primary transition-colors"
              >
                Destinations
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="text-primary">{hotelInfo.TenKS}</span>
            </>
          ) : (
            <span className="text-primary">Danh sách phòng</span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-serif text-xl">
              Đang tải danh sách phòng...
            </p>
          </div>
        ) : (
          <>
            {rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="group flex flex-col bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500 relative"
                  >
                    {/* Ảnh phòng */}
                    <div className="relative h-[300px] overflow-hidden">
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                          room.status !== "Trống" ? "grayscale" : ""
                        }`}
                      />

                      {/* Tag Giá tiền */}
                      <div className="absolute bottom-0 left-0 bg-white/95 px-6 py-3 z-10">
                        <span className="font-serif text-xl text-primary font-bold">
                          {formatCurrency(room.price)}
                        </span>
                      </div>

                      {/* Tag Trạng thái (Nếu không trống) */}
                      {room.status !== "Trống" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                          <span className="border-2 border-white text-white px-4 py-2 font-bold uppercase tracking-widest text-sm transform -rotate-12">
                            Đã đặt
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Thông tin */}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-2xl text-primary group-hover:text-accent transition-colors">
                          {room.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
                        Mã phòng: {room.id}
                      </p>

                      <p className="text-gray-500 font-light text-sm mb-8 line-clamp-3 leading-relaxed flex-grow">
                        {room.desc}
                      </p>

                      <div className="pt-6 border-t border-gray-100">
                        {room.status === "Trống" ? (
                          <Link
                            href="/booking"
                            className="block w-full py-4 text-center bg-primary text-white text-xs font-bold uppercase tracking-[2px] hover:bg-gray-800 transition-all"
                          >
                            Đặt Phòng Ngay
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="block w-full py-4 text-center bg-gray-200 text-gray-400 text-xs font-bold uppercase tracking-[2px] cursor-not-allowed"
                          >
                            Không khả dụng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-gray-300 bg-gray-50">
                <h3 className="font-serif text-2xl text-gray-400 mb-2">
                  Chưa tìm thấy phòng trống.
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Vui lòng quay lại sau hoặc chọn khách sạn khác.
                </p>
                <Link
                  href="/destinations"
                  className="text-accent font-bold uppercase tracking-widest text-xs border-b border-accent pb-1 hover:text-primary hover:border-primary"
                >
                  Quay lại danh sách khách sạn
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function RoomsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <RoomsContent />
      </Suspense>
    </main>
  );
}
