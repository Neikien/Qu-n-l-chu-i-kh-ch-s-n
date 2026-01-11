"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiService } from "@/services/apiService"; // Import apiService của bạn

export default function RoomServicePage() {
  const params = useParams(); // Lấy MaDatPhong từ URL
  const bookingId = params.id;
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Ảnh giả lập cho đẹp
  const MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
  ];

  // 1. Tải danh sách dịch vụ
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          "https://khachsan-backend-production-9810.up.railway.app/services/?skip=0&limit=100"
        );
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Lỗi tải dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // 2. Hàm Xử lý đặt dịch vụ (GỌI API LUÔN)
  const handleOrderService = async (service) => {
    if (!confirm(`Bạn muốn gọi "${service.TenDV}" với giá ${service.GiaDV} đ?`))
      return;

    setProcessing(true);
    try {
      // Gọi hàm addServiceToBooking đã viết trong apiService
      // Tham số: (BookingID, ServiceID, Số lượng mặc định là 1)
      await apiService.addServiceToBooking(bookingId, service.MaDV, 1);

      alert("✅ Gọi dịch vụ thành công! Nhân viên sẽ phục vụ ngay.");
    } catch (error) {
      alert("❌ Lỗi: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải menu...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow p-4 mb-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/my-bookings" className="text-gray-500 hover:underline">
            ← Quay lại đơn phòng
          </Link>
          <h1 className="font-bold text-xl uppercase">
            Room Service (Phòng #{bookingId})
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={service.MaDV}
            className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
          >
            <div className="relative h-48 w-full">
              <Image
                src={MOCK_IMAGES[index % MOCK_IMAGES.length]}
                alt={service.TenDV}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 flex-grow">
              <h3 className="font-bold text-lg mb-1">{service.TenDV}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {service.MoTa}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="font-bold text-primary text-lg">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(parseFloat(service.GiaDV) || 0)}
                </span>

                <button
                  onClick={() => handleOrderService(service)}
                  disabled={processing}
                  className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
                >
                  {processing ? "..." : "Đặt Ngay"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
