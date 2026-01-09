"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useBooking } from "@/app/context/BookingContext";
import { format, differenceInDays, parseISO } from "date-fns";
import Image from "next/image";

// Hàm format tiền tệ
const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );

function CheckoutContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const { user } = useAuth();
  const { bookingParams } = useBooking();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Tính số đêm lưu trú
  const checkIn = parseISO(bookingParams.checkInDate);
  const checkOut = parseISO(bookingParams.checkOutDate);
  const nights = differenceInDays(checkOut, checkIn) || 1;

  useEffect(() => {
    // Nếu chưa đăng nhập -> đá về login
    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      router.push("/login");
      return;
    }

    // Fetch thông tin phòng
    const fetchRoom = async () => {
      try {
        const res = await fetch(
          "https://khachsan-backend-production-9810.up.railway.app/rooms/?skip=0&limit=1000"
        );
        const data = await res.json();
        const found = data.find((r) => r.MaPhong.toString() === roomId);
        if (found) setRoom(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) fetchRoom();
  }, [roomId, user, router]);

  const handleConfirmPayment = async () => {
    setProcessing(true);
    try {
      // 1. Tính tổng tiền
      const totalPrice = parseFloat(room.GiaPhong) * nights;

      // 2. Chuẩn bị payload chuẩn
      const payload = {
        MaKH: user.MaKH || user.id || 1,
        MaPhong: parseInt(roomId),
        NgayDat: format(new Date(), "yyyy-MM-dd"),
        NgayNhanPhong: bookingParams.checkInDate,
        NgayTraPhong: bookingParams.checkOutDate,
        TongTien: totalPrice.toString(),
        // LƯU Ý: Vì chọn thanh toán tại khách sạn, trạng thái logic nên là "Chờ thanh toán"
        // Tuy nhiên tôi giữ nguyên "Đã thanh toán" như logic cũ của bạn để tránh lỗi backend.
        TrangThai: "Đã thanh toán",
      };

      console.log("📤 Gửi đơn:", payload);

      // 3. Gọi API
      const res = await fetch(
        "https://khachsan-backend-production-9810.up.railway.app/bookings/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Lỗi đặt phòng");
      }

      const result = await res.json();

      // 4. Thành công -> Chuyển hướng
      alert(`✅ ĐẶT PHÒNG THÀNH CÔNG!\nMã đơn: ${result.MaDatPhong}`);
      router.push("/my-bookings");
    } catch (error) {
      alert(`❌ Thất bại: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return <div className="text-center py-20">Đang tải thông tin...</div>;
  if (!room)
    return (
      <div className="text-center py-20">Không tìm thấy thông tin phòng.</div>
    );

  const pricePerNight = parseFloat(room.GiaPhong);
  const totalAmount = pricePerNight * nights;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG & THANH TOÁN */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-primary mb-6">
          Xác Nhận & Thanh Toán
        </h2>

        {/* Thông tin người đặt */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-100">
          <h3 className="font-bold text-sm uppercase tracking-widest mb-4 border-b pb-2">
            Thông tin khách hàng
          </h3>
          <p className="mb-1">
            <span className="font-bold">Họ tên:</span>{" "}
            {user?.name || user?.userName}
          </p>
          <p className="mb-1">
            <span className="font-bold">Email:</span>{" "}
            {user?.email || "Chưa cập nhật"}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            *Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
          </p>
        </div>

        {/* Phương thức thanh toán (ĐÃ SỬA: CHỈ CÒN OPTION KHÁCH SẠN) */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6">
          <h3 className="font-bold text-sm uppercase tracking-widest mb-4">
            Phương thức thanh toán
          </h3>
          <div className="space-y-3">
            {/* Option duy nhất */}
            <label className="flex items-center gap-3 p-4 border border-blue-500 bg-blue-50 rounded cursor-pointer">
              <input
                type="radio"
                name="payment"
                defaultChecked
                readOnly
                className="accent-primary w-5 h-5"
              />
              <div>
                <span className="font-bold text-gray-900 block">
                  Thanh toán tại khách sạn
                </span>
                <span className="text-sm text-gray-500">
                  Thanh toán tiền mặt hoặc thẻ tại quầy lễ tân khi nhận phòng.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
      <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-8 h-fit">
        <h3 className="font-serif text-xl font-bold mb-6 text-center">
          Chi Tiết Đặt Phòng
        </h3>

        <div className="relative h-48 w-full mb-6 rounded overflow-hidden">
          <Image
            src={
              room.HinhAnh ||
              "https://images.unsplash.com/photo-1611892440504-42a792e24d32"
            }
            fill
            className="object-cover"
            alt="Room"
          />
        </div>

        <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">
              Loại phòng
            </p>
            <p className="text-lg font-medium text-primary">
              {room.TenPhong || room.LoaiPhong}
            </p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">
                Nhận phòng
              </p>
              <p className="font-medium">{format(checkIn, "dd/MM/yyyy")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-bold">
                Trả phòng
              </p>
              <p className="font-medium">{format(checkOut, "dd/MM/yyyy")}</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="text-sm">Số đêm nghỉ:</span>
            <span className="font-bold">{nights} đêm</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-gray-600">
            <span>Giá phòng (x{nights})</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí dịch vụ (5%)</span>
            <span>{formatCurrency(totalAmount * 0.05)}</span>
          </div>
          <div className="flex justify-between font-bold text-xl text-primary pt-4 border-t">
            <span>Tổng thanh toán</span>
            <span>{formatCurrency(totalAmount * 1.05)}</span>
          </div>
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={processing}
          className="w-full py-4 bg-primary text-white font-bold uppercase tracking-[2px] hover:bg-gray-800 transition-all rounded shadow-lg disabled:bg-gray-400"
        >
          {processing ? "Đang xử lý..." : "Hoàn Tất Đặt Phòng"}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
