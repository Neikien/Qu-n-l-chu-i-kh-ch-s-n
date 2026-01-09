"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import {
  Edit,
  Save,
  X,
  Trash2,
  Eye,
  MapPin,
  BedDouble,
  Loader2,
  Calculator,
} from "lucide-react";

const API_BASE_URL = "https://khachsan-backend-production-9810.up.railway.app";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL CHI TIẾT ---
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [roomDetail, setRoomDetail] = useState(null);
  const [hotelDetail, setHotelDetail] = useState(null);

  // --- STATE MODAL SỬA ---
  const [isEditing, setIsEditing] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editRoomPrice, setEditRoomPrice] = useState(0); // Lưu giá phòng gốc để tính lại tiền
  const [calculatingPrice, setCalculatingPrice] = useState(false); // Loading khi tính tiền

  // --- HÀM HỖ TRỢ NGÀY THÁNG (FIX LỖI LỆCH NGÀY) ---
  // Chuyển ISO String từ Backend sang YYYY-MM-DD theo giờ địa phương
  const formatDateLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // --- 1. LẤY DANH SÁCH ---
  const fetchHistory = async () => {
    if (user && (user.MaKH || user.id)) {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/?skip=0&limit=100`);
        if (res.ok) {
          const data = await res.json();
          const myData = data.filter((b) => b.MaKH === (user.MaKH || user.id));
          setBookings(myData.reverse());
        }
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // --- 2. LOGIC CHI TIẾT ---
  useEffect(() => {
    const fetchModalDetails = async () => {
      if (!selectedBooking) return;
      setDetailLoading(true);
      setRoomDetail(null);
      setHotelDetail(null);

      try {
        const resRoom = await fetch(`${API_BASE_URL}/rooms/?skip=0&limit=1000`);
        const roomsData = await resRoom.json();
        const foundRoom = roomsData.find(
          (r) => r.MaPhong === selectedBooking.MaPhong
        );

        if (foundRoom) {
          setRoomDetail(foundRoom);
          try {
            const resHotel = await fetch(
              `${API_BASE_URL}/hotels/${foundRoom.MaKS}`
            );
            if (resHotel.ok) {
              const hotelData = await resHotel.json();
              setHotelDetail(hotelData);
            } else {
              setHotelDetail({
                TenKhachSan: "Khách Sạn Luxury",
                DiaChi: "Việt Nam",
              });
            }
          } catch (err) {
            setHotelDetail({
              TenKhachSan: "Khách Sạn Luxury",
              DiaChi: "Việt Nam",
            });
          }
        }
      } catch (error) {
        console.error("Lỗi modal:", error);
      } finally {
        setDetailLoading(false);
      }
    };
    fetchModalDetails();
  }, [selectedBooking]);

  const renderStatus = (status) => {
    const s = status ? String(status).toLowerCase() : "";
    if (s.includes("cancel") || s.includes("hủy")) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-full border border-red-200">
          Đã hủy
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded-full border border-green-200">
        Thành công
      </span>
    );
  };

  // --- 3. XỬ LÝ HỦY ---
  const handleCancel = async (booking) => {
    const id = booking.MaDatPhong || booking.id;
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn #${id}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Đã hủy phòng thành công!");
        setBookings(
          bookings.map((b) =>
            b.MaDatPhong === id || b.id === id
              ? { ...b, TrangThai: "Đã hủy" }
              : b
          )
        );
      } else {
        alert("Lỗi server không thể hủy.");
      }
    } catch (error) {
      alert("Lỗi kết nối.");
    }
  };

  // --- 4. LOGIC SỬA (UPDATE) ---

  // A. Mở Modal & Lấy giá phòng gốc
  const openEditModal = async (booking) => {
    setIsEditing(true);
    setCalculatingPrice(true);

    // 1. Set dữ liệu ban đầu (Dùng formatDateLocal để fix lỗi lệch ngày)
    setEditingBooking({
      ...booking,
      NgayNhanPhong: formatDateLocal(booking.NgayNhanPhong),
      NgayTraPhong: formatDateLocal(booking.NgayTraPhong),
    });

    // 2. Gọi API lấy giá phòng gốc để tính toán
    try {
      // Phải lấy lại list rooms để tìm giá phòng (Vì trong booking ko có giá gốc/đêm)
      const resRoom = await fetch(`${API_BASE_URL}/rooms/?skip=0&limit=1000`);
      const roomsData = await resRoom.json();
      const foundRoom = roomsData.find((r) => r.MaPhong === booking.MaPhong);

      if (foundRoom) {
        setEditRoomPrice(parseFloat(foundRoom.GiaPhong)); // Lưu giá/đêm
      } else {
        // Fallback: Nếu ko tìm thấy phòng, lấy tổng tiền cũ chia số đêm cũ (tương đối)
        const oldStart = new Date(booking.NgayNhanPhong);
        const oldEnd = new Date(booking.NgayTraPhong);
        const oldDays = Math.max(
          1,
          Math.ceil((oldEnd - oldStart) / (1000 * 60 * 60 * 24))
        );
        setEditRoomPrice(parseFloat(booking.TongTien) / oldDays);
      }
    } catch (error) {
      console.error("Lỗi lấy giá phòng:", error);
    } finally {
      setCalculatingPrice(false);
    }
  };

  // B. Tự động tính lại tiền khi đổi ngày
  const handleDateChange = (field, value) => {
    const newData = { ...editingBooking, [field]: value };
    setEditingBooking(newData);

    // Nếu có đủ 2 ngày -> Tính tiền
    if (newData.NgayNhanPhong && newData.NgayTraPhong) {
      const start = new Date(newData.NgayNhanPhong);
      const end = new Date(newData.NgayTraPhong);

      // Tính số đêm
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        // Tính tổng tiền mới = Số đêm * Giá phòng gốc
        const newTotal = diffDays * editRoomPrice;
        setEditingBooking((prev) => ({ ...prev, TongTien: newTotal }));
      }
    }
  };

  // C. Gửi API Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      const id = editingBooking.MaDatPhong || editingBooking.id;

      // Chuẩn bị payload: Gửi cả ngày mới VÀ tổng tiền mới
      const payload = {
        ...editingBooking,
        NgayNhanPhong: editingBooking.NgayNhanPhong,
        NgayTraPhong: editingBooking.NgayTraPhong,
        TongTien: editingBooking.TongTien, // Quan trọng: Gửi giá mới xuống
      };

      console.log("Sending Update:", payload);

      const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Cập nhật thành công! Giá phòng đã được tính lại.");
        setIsEditing(false);
        fetchHistory(); // Load lại list để thấy thay đổi
      } else {
        const err = await res.json();
        alert(`Lỗi cập nhật: ${err.detail || "Server từ chối"}`);
      }
    } catch (error) {
      alert("Lỗi hệ thống!");
    }
  };

  // Format tiền tệ
  const fmtMoney = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  if (!user)
    return <div className="p-10 text-center">Vui lòng đăng nhập...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-3xl text-primary mb-8 text-center">
          Lịch Sử Đặt Phòng
        </h1>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="animate-spin inline w-8 h-8" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center p-10 bg-white rounded shadow">
            Chưa có dữ liệu đặt phòng.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((item) => {
              const statusStr = item.TrangThai
                ? String(item.TrangThai).toLowerCase()
                : "";
              const isCancelled =
                statusStr.includes("hủy") || statusStr.includes("cancel");

              return (
                <div
                  key={item.MaDatPhong}
                  className={`bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-center transition-opacity ${
                    isCancelled ? "opacity-70 bg-gray-50" : ""
                  }`}
                >
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-lg">
                        Mã: #{item.MaDatPhong}
                      </p>
                      {renderStatus(item.TrangThai)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Ngày đặt:{" "}
                      {new Date(item.NgayDat).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <div className="text-right w-full md:w-auto">
                    <p
                      className={`text-xl font-bold ${
                        isCancelled
                          ? "text-gray-400 line-through"
                          : "text-primary"
                      }`}
                    >
                      {fmtMoney(item.TongTien)}
                    </p>

                    <div className="flex gap-2 mt-3 justify-end">
                      <button
                        onClick={() => setSelectedBooking(item)}
                        className="bg-gray-800 text-white px-3 py-2 rounded text-sm hover:bg-black flex items-center gap-1"
                      >
                        <Eye size={14} /> Chi tiết
                      </button>

                      {!isCancelled && (
                        <>
                          <button
                            onClick={() => openEditModal(item)}
                            className="border border-blue-500 text-blue-500 px-3 py-2 rounded text-sm hover:bg-blue-50 flex items-center gap-1"
                          >
                            <Edit size={14} /> Sửa
                          </button>
                          <button
                            onClick={() => handleCancel(item)}
                            className="border border-red-500 text-red-500 px-3 py-2 rounded text-sm hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Hủy
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- MODAL XEM CHI TIẾT --- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          ></div>
          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="bg-primary px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-white font-serif text-xl">
                Thông tin chi tiết
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-white hover:text-gray-300 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-6">
              {detailLoading ? (
                <div className="text-center py-10 text-gray-500">
                  <Loader2 className="animate-spin w-8 h-8 mx-auto mb-2" />
                  Đang tải...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Mã đơn</p>
                      <p className="font-bold text-lg">
                        #{selectedBooking.MaDatPhong}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase">
                        Trạng thái
                      </p>
                      <div>{renderStatus(selectedBooking.TrangThai)}</div>
                    </div>
                  </div>
                  {roomDetail ? (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-4">
                      <div className="w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            roomDetail.HinhAnh ||
                            "https://images.unsplash.com/photo-1611892440504-42a792e24d32"
                          }
                          fill
                          className="object-cover"
                          alt="Room"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2">
                          <BedDouble size={18} />{" "}
                          {roomDetail.LoaiPhong || roomDetail.TenPhong}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Mã phòng: {roomDetail.MaPhong}
                        </p>
                        <p className="text-sm text-gray-600">
                          Giá: {fmtMoney(roomDetail.GiaPhong)} / đêm
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-500 italic">
                      Không tìm thấy phòng
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                      <MapPin size={18} className="text-red-500" /> Địa điểm
                    </h4>
                    {hotelDetail ? (
                      <>
                        <p className="font-semibold">
                          {hotelDetail.TenKhachSan}
                        </p>
                        <p className="text-sm text-gray-600">
                          {hotelDetail.DiaChi}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm italic">Đang cập nhật...</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white border p-3 rounded">
                      <p className="text-gray-500">Check-in</p>
                      <p className="font-bold">
                        {new Date(
                          selectedBooking.NgayNhanPhong
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="bg-white border p-3 rounded">
                      <p className="text-gray-500">Check-out</p>
                      <p className="font-bold">
                        {new Date(
                          selectedBooking.NgayTraPhong
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t mt-4">
                    <span className="font-bold text-gray-700">
                      Tổng thanh toán
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {fmtMoney(selectedBooking.TongTien)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL SỬA (FIXED) --- */}
      {isEditing && editingBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Cập nhật ngày đặt</h3>
              <button onClick={() => setIsEditing(false)}>
                <X className="text-gray-400 hover:text-black" />
              </button>
            </div>

            {calculatingPrice ? (
              <div className="py-10 text-center text-sm text-gray-500">
                <Loader2 className="animate-spin inline w-5 h-5 mb-2" />
                <p>Đang lấy thông tin giá phòng...</p>
              </div>
            ) : (
              <form onSubmit={handleUpdateSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none"
                      value={editingBooking.NgayNhanPhong}
                      onChange={(e) =>
                        handleDateChange("NgayNhanPhong", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none"
                      value={editingBooking.NgayTraPhong}
                      onChange={(e) =>
                        handleDateChange("NgayTraPhong", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* HIỂN THỊ GIÁ MỚI */}
                <div className="bg-blue-50 p-4 rounded border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-800 font-medium">
                    <Calculator size={18} />
                    <span>Giá mới tạm tính:</span>
                  </div>
                  <div className="text-xl font-bold text-blue-700">
                    {fmtMoney(editingBooking.TongTien)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center px-4">
                  *Giá đã được tính lại dựa trên đơn giá phòng:{" "}
                  {fmtMoney(editRoomPrice)}/đêm.
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border p-3 rounded font-medium hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white p-3 rounded font-bold hover:bg-gray-800 flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Xác nhận
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
