"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useBooking } from "@/app/context/BookingContext";
import { format, differenceInDays, parseISO } from "date-fns";
import Image from "next/image";
import { Loader2 } from "lucide-react";

// URL Backend
const API_BASE_URL = "https://khachsan-backend-production-9810.up.railway.app";

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

  // Tính số đêm
  const checkIn = parseISO(bookingParams.checkInDate);
  const checkOut = parseISO(bookingParams.checkOutDate);
  const nights = differenceInDays(checkOut, checkIn) || 1;

  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập!");
      router.push("/login");
      return;
    }

    // Load thông tin phòng
    const fetchRoom = async () => {
      try {
        if (!roomId) throw new Error("Thiếu Room ID");
        const res = await fetch(`${API_BASE_URL}/rooms/?skip=0&limit=1000`);
        const data = await res.json();
        // So sánh chuỗi cho chắc ăn
        const found = data.find((r) => String(r.MaPhong) === String(roomId));
        if (found) setRoom(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, user, router]);

  // Tính toán tiền (Chỉ tiền phòng)
  const pricePerNight = room ? parseFloat(room.GiaPhong) : 0;
  const grandTotal = pricePerNight * nights;

  const handleConfirmPayment = async () => {
    if (!room) return;
    setProcessing(true);
    try {
      // Payload đơn giản, chỉ chứa thông tin phòng
      const bookingPayload = {
        MaKH: parseInt(user.MaKH || user.id),
        MaPhong: parseInt(room.MaPhong),
        NgayDat: format(new Date(), "yyyy-MM-dd"),
        NgayNhanPhong: bookingParams.checkInDate,
        NgayTraPhong: bookingParams.checkOutDate,
        TongTien: String(grandTotal),
        TrangThai: "Đã thanh toán",
      };

      console.log("📤 Đang đặt phòng:", bookingPayload);

      const res = await fetch(`${API_BASE_URL}/bookings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Lỗi khi tạo booking");
      }

      const result = await res.json();
      const newCode = result.MaDatPhong || result.id;

      alert(
        `✅ Đặt phòng thành công!\nMã đơn: ${newCode}\nBây giờ bạn có thể gọi thêm dịch vụ trong phần 'Đơn phòng của tôi'.`
      );
      router.push("/my-bookings");
    } catch (error) {
      alert(`❌ Lỗi: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!room)
    return (
      <div className="text-center py-20 text-red-500">
        Phòng không tồn tại hoặc đã bị xóa.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* CỘT TRÁI */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-primary mb-6">
          Xác Nhận Đặt Phòng
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
          <h3 className="font-bold text-sm uppercase tracking-widest mb-4 border-b pb-2">
            Khách hàng
          </h3>
          <p>
            <span className="font-bold">Họ tên:</span>{" "}
            {user?.name || user?.fullname || user?.username}
          </p>
          <p>
            <span className="font-bold">Email:</span> {user?.email}
          </p>
        </div>
        <div className="bg-white border p-6 rounded-lg">
          <h3 className="font-bold text-sm uppercase mb-4">Thanh toán</h3>
          <label className="flex items-center gap-3 p-4 border bg-blue-50 rounded">
            <input
              type="radio"
              checked
              readOnly
              className="accent-primary w-5 h-5"
            />
            <div>
              <span className="font-bold block text-gray-900">
                Thanh toán tại khách sạn
              </span>
              <span className="text-sm text-gray-500">
                Trả tiền mặt/thẻ khi nhận phòng.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="bg-white border shadow-xl rounded-lg p-8 h-fit">
        <h3 className="font-serif text-xl font-bold mb-6 text-center">
          Thông Tin Phòng
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

        <div className="space-y-4 border-b pb-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">
              Loại phòng
            </p>
            <p className="text-lg font-medium text-primary">
              {room.TenPhong || room.LoaiPhong}
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500 block">Check-in</span>{" "}
              <b>{format(checkIn, "dd/MM/yyyy")}</b>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block">Check-out</span>{" "}
              <b>{format(checkOut, "dd/MM/yyyy")}</b>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-gray-600">
            <span>Giá phòng ({nights} đêm)</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-xl text-primary pt-4 border-t">
            <span>Tổng cộng</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={processing}
          className="w-full py-4 bg-primary text-white font-bold uppercase rounded shadow-lg flex justify-center gap-2 hover:bg-black transition-all disabled:bg-gray-400"
        >
          {processing && <Loader2 className="animate-spin" />}
          {processing ? "Đang xử lý..." : "Xác Nhận Booking"}
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
