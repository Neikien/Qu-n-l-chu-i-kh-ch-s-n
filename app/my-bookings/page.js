"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiService } from "@/services/apiService";
import Link from "next/link";
import Image from "next/image";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user && user.MaKH) {
        setLoading(true);
        const data = await apiService.getBookingsByCustomer(user.MaKH);
        setBookings(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // Hàm render trạng thái (Màu sắc theo trạng thái)
  const renderStatus = (status) => {
    // Giả sử status backend trả về là string
    const s = status ? String(status).toLowerCase() : "pending";

    if (s.includes("confirmed") || s.includes("success")) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
          Đã xác nhận
        </span>
      );
    }
    if (s.includes("cancel")) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider rounded-full">
          Đã hủy
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider rounded-full">
        Chờ xử lý
      </span>
    );
  };

  // --- GIAO DIỆN KHI CHƯA ĐĂNG NHẬP ---
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl text-primary mb-4">
          Vui lòng đăng nhập
        </h2>
        <p className="text-gray-500 mb-6">
          Bạn cần đăng nhập để xem lịch sử đặt phòng của mình.
        </p>
        <Link
          href="/login"
          className="bg-primary text-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-gray-800 transition"
        >
          Đăng Nhập Ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl text-primary mb-2">
            Lịch Sử Đặt Phòng
          </h1>
          <p className="text-gray-500 font-light">
            Quản lý các kỳ nghỉ sắp tới và đã qua của bạn
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : bookings.length === 0 ? (
          // --- GIAO DIỆN KHI TRỐNG ---
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              📅
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Chưa có đặt phòng nào
            </h3>
            <p className="text-gray-500 mb-8">
              Có vẻ như bạn chưa thực hiện chuyến đi nào với chúng tôi.
            </p>
            <Link
              href="/rooms"
              className="text-primary border-b border-primary pb-1 hover:text-accent hover:border-accent transition"
            >
              Khám phá phòng ngay &rarr;
            </Link>
          </div>
        ) : (
          // --- DANH SÁCH BOOKING ---
          <div className="grid gap-6">
            {bookings.map((item) => (
              <div
                key={item.MaDatPhong || item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col md:flex-row"
              >
                {/* Ảnh minh họa (Placeholder vì API booking thường ko trả về ảnh) */}
                <div className="w-full md:w-1/3 relative h-48 md:h-auto bg-gray-200">
                  <Image
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000"
                    alt="Room"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {renderStatus(item.TrangThai)}
                  </div>
                </div>

                {/* Nội dung chi tiết */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                        Booking ID: #{item.MaDatPhong || item.id}
                      </p>
                      <h3 className="font-serif text-2xl text-primary">
                        Phòng Nghỉ Dưỡng
                      </h3>
                      {/* Nếu API trả về TenPhong thì thay thế dòng trên bằng {item.TenPhong} */}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.TongTien || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6 border-t border-b border-gray-100 py-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">
                        Check-in
                      </p>
                      <p className="font-medium text-black">
                        {item.NgayNhanPhong
                          ? new Date(item.NgayNhanPhong).toLocaleDateString(
                              "vi-VN"
                            )
                          : "..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">
                        Check-out
                      </p>
                      <p className="font-medium text-black">
                        {item.NgayTraPhong
                          ? new Date(item.NgayTraPhong).toLocaleDateString(
                              "vi-VN"
                            )
                          : "..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">
                        Số lượng khách
                      </p>
                      <p className="font-medium text-black">
                        {item.SoLuongKhach || 2} Người
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">
                        Ngày đặt
                      </p>
                      <p className="font-medium text-black">
                        {item.NgayDat
                          ? new Date(item.NgayDat).toLocaleDateString("vi-VN")
                          : "..."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded text-sm font-bold hover:bg-gray-200 transition">
                      Xem Chi Tiết
                    </button>
                    {/* Chỉ hiện nút Hủy nếu chưa hủy */}
                    {(!item.TrangThai || item.TrangThai !== "Cancelled") && (
                      <button className="px-6 border border-red-200 text-red-500 py-3 rounded text-sm font-bold hover:bg-red-50 transition">
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
