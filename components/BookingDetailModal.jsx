"use client";
import { useEffect } from "react";

export default function BookingDetailModal({ isOpen, onClose, booking }) {
  // Chặn cuộn trang khi mở modal
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  // Format tiền tệ
  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Format ngày
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "...";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop mờ */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Nội dung Modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-primary p-6 flex justify-between items-center text-white">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">
              Booking Reference
            </p>
            <h2 className="text-2xl font-serif font-bold">
              #{booking.MaDatPhong || booking.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Thông tin chính */}
          <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Phòng Nghỉ Dưỡng
              </h3>
              <p className="text-sm text-gray-500">
                Kỳ nghỉ thượng hạng tại InterContinental
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                  booking.TrangThai === "Cancelled" ||
                  booking.status === "Cancelled"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {booking.TrangThai || booking.status || "Confirmed"}
              </span>
            </div>
          </div>

          {/* Grid thông tin chi tiết */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase mb-1">
                Ngày nhận phòng
              </p>
              <p className="font-semibold text-lg text-gray-800">
                {formatDate(booking.NgayNhanPhong)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase mb-1">
                Ngày trả phòng
              </p>
              <p className="font-semibold text-lg text-gray-800">
                {formatDate(booking.NgayTraPhong)}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase mb-1">Khách hàng</p>
              <p className="font-medium">{booking.HoTen || "Quý khách"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase mb-1">
                Số lượng khách
              </p>
              <p className="font-medium">{booking.SoLuongKhach || 2} Người</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase mb-1">
                Ngày đặt đơn
              </p>
              <p className="font-medium">{formatDate(booking.NgayDat)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase mb-1">
                Tổng thanh toán
              </p>
              <p className="font-bold text-xl text-accent">
                {formatMoney(booking.TongTien)}
              </p>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition"
            >
              Đóng
            </button>
            <button
              className="px-6 py-2 rounded bg-primary text-white font-bold hover:bg-gray-800 transition"
              onClick={() => alert("Chức năng in hóa đơn đang phát triển!")}
            >
              In Hóa Đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
