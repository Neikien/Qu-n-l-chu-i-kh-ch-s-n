"use client";

import Image from "next/image";

// Hàm format tiền (nhận vào string hoặc number đều được)
const formatCurrency = (amount) => {
  const num = parseFloat(amount); // Chuyển '1600000.00' -> 1600000
  if (isNaN(num)) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

export default function RoomListing({ rooms, onBookRoom }) {
  // Nếu không có phòng nào
  if (!rooms || rooms.length === 0) {
    return null; // Hoặc hiện thông báo "Không có phòng"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="group bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden flex flex-col"
        >
          {/* 1. ẢNH PHÒNG */}
          <div className="relative h-[250px] w-full overflow-hidden">
            <Image
              src={room.image}
              alt={room.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Tag giá tiền */}
            <div className="absolute bottom-0 left-0 bg-white/95 px-4 py-2 text-primary font-bold font-serif text-lg">
              {formatCurrency(room.price)}
            </div>
          </div>

          {/* 2. THÔNG TIN */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-serif text-xl font-bold text-primary group-hover:text-accent transition-colors">
                {room.name}
              </h3>
            </div>

            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
              Mã: {room.MaPhong || room.id}
            </p>

            <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
              {room.desc}
            </p>

            {/* 3. NÚT ĐẶT PHÒNG */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <button
                onClick={() => onBookRoom(room)}
                className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-[2px] hover:bg-gray-800 transition-all rounded"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
