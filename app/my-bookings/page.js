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
  BedDouble,
  Loader2,
  Utensils,
  MapPin,
  PlusCircle,
  ShoppingBag,
} from "lucide-react";

const API_BASE_URL = "https://khachsan-backend-production-9810.up.railway.app";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Detail State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [roomDetail, setRoomDetail] = useState(null);
  const [hotelDetail, setHotelDetail] = useState(null);
  const [bookingServices, setBookingServices] = useState([]);

  // Menu State
  const [showMenu, setShowMenu] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);

  // Edit State (QUAN TRỌNG)
  const [isEditing, setIsEditing] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingRoomRate, setEditingRoomRate] = useState(0); // Lưu giá phòng gốc để tính lại tiền

  // --- HELPERS ---
  const fmtMoney = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const formatDateLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Tính số đêm
  const calculateNights = (start, end) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  // --- 1. LẤY DANH SÁCH BOOKING ---
  const fetchHistory = async () => {
    if (user && (user.MaKH || user.id)) {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/?skip=0&limit=100`);
        if (res.ok) {
          const data = await res.json();
          const myData = data.filter(
            (b) => String(b.MaKH) === String(user.MaKH || user.id)
          );
          setBookings(myData.reverse());
        }
      } catch (error) {
        console.error(error);
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

  // --- 2. LẤY DỊCH VỤ CHI TIẾT ---
  const refreshBookingServices = async (bookingId) => {
    try {
      const resServices = await fetch(
        `${API_BASE_URL}/service-usages/booking/${bookingId}`
      );

      if (resServices.ok) {
        const myUsages = await resServices.json();

        const resListService = await fetch(
          `${API_BASE_URL}/services/?skip=0&limit=1000`
        );
        let listServiceData = [];
        if (resListService.ok) {
          listServiceData = await resListService.json();
        }

        const enrichedServices = myUsages.map((usage) => {
          const detail = listServiceData.find(
            (s) => String(s.MaDV) === String(usage.MaDV)
          );
          return {
            ...usage,
            TenDV: detail
              ? detail.TenDV
              : usage.TenDV || `Dịch vụ #${usage.MaDV}`,
            DonGia: detail ? detail.GiaDV : 0,
            HinhAnh: detail ? detail.HinhAnh : null,
            ThanhTien:
              usage.ThanhTien || parseFloat(detail?.GiaDV || 0) * usage.SoLuong,
          };
        });
        setBookingServices(enrichedServices);
      } else {
        setBookingServices([]);
      }
    } catch (err) {
      console.error("Lỗi refresh dịch vụ:", err);
      setBookingServices([]);
    }
  };

  // --- 3. LOGIC CHI TIẾT (Detail Modal) ---
  useEffect(() => {
    const fetchModalDetails = async () => {
      if (!selectedBooking) return;
      setDetailLoading(true);
      setRoomDetail(null);
      setHotelDetail(null);
      setBookingServices([]);
      setShowMenu(false);

      try {
        // A. Lấy Phòng
        const resRoom = await fetch(`${API_BASE_URL}/rooms/?skip=0&limit=1000`);
        const roomsData = await resRoom.json();
        const foundRoom = roomsData.find(
          (r) => String(r.MaPhong) === String(selectedBooking.MaPhong)
        );

        if (foundRoom) {
          setRoomDetail(foundRoom);
          if (foundRoom.MaKS) {
            try {
              const resHotel = await fetch(
                `${API_BASE_URL}/hotels/${foundRoom.MaKS}`
              );
              if (resHotel.ok) setHotelDetail(await resHotel.json());
            } catch {}
          }
        }

        // B. Lấy Dịch vụ
        await refreshBookingServices(selectedBooking.MaDatPhong);
      } catch (error) {
        console.error(error);
      } finally {
        setDetailLoading(false);
      }
    };
    fetchModalDetails();
  }, [selectedBooking]);

  // --- 4. LOGIC GỌI MÓN (Order) ---
  const handleOpenMenu = async () => {
    setShowMenu(true);
    setMenuLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/services/?skip=0&limit=100`);
      if (res.ok) {
        setMenuList(await res.json());
      }
    } catch (err) {
      alert("Lỗi tải menu");
    } finally {
      setMenuLoading(false);
    }
  };

  const handleOrderService = async (service) => {
    try {
      const payload = {
        MaDatPhong: parseInt(selectedBooking.MaDatPhong),
        MaDV: parseInt(service.MaDV),
        SoLuong: 1,
        ThanhTien: String(service.GiaDV),
      };

      const res = await fetch(`${API_BASE_URL}/service-usages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Gọi món thành công!");

        // A. Cập nhật list dịch vụ trong Modal
        await refreshBookingServices(selectedBooking.MaDatPhong);

        // B. Cập nhật giá tổng ở list bookings bên ngoài (Optimistic UI Update)
        const addedPrice = parseFloat(service.GiaDV || 0);

        setBookings((prevBookings) =>
          prevBookings.map((b) => {
            if (String(b.MaDatPhong) === String(selectedBooking.MaDatPhong)) {
              return {
                ...b,
                TongTien: parseFloat(b.TongTien || 0) + addedPrice,
              };
            }
            return b;
          })
        );

        // C. Cập nhật luôn state selectedBooking
        setSelectedBooking((prev) => ({
          ...prev,
          TongTien: parseFloat(prev.TongTien || 0) + addedPrice,
        }));
      } else {
        let errorMsg = "Lỗi Server";
        try {
          const errorData = await res.json();
          errorMsg = errorData.detail || JSON.stringify(errorData);
        } catch (e) {}
        alert(`❌ Lỗi: ${errorMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi kết nối mạng.");
    }
  };

  // --- 5. LOGIC SỬA NGÀY (Edit Booking) ---
  const openEditModal = async (b) => {
    setIsEditing(true);
    // 1. Set thông tin cơ bản
    setEditingBooking({
      ...b,
      NgayNhanPhong: formatDateLocal(b.NgayNhanPhong),
      NgayTraPhong: formatDateLocal(b.NgayTraPhong),
    });

    // 2. Gọi API lấy giá phòng gốc của phòng này (Để tính toán lại tiền)
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${b.MaPhong}`);
      if (res.ok) {
        const roomData = await res.json();
        setEditingRoomRate(parseFloat(roomData.GiaPhong));
      }
    } catch (e) {
      console.error("Lỗi lấy giá phòng:", e);
      setEditingRoomRate(0);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // 1. Tính số đêm MỚI
    const newNights = calculateNights(
      editingBooking.NgayNhanPhong,
      editingBooking.NgayTraPhong
    );

    // 2. Tính số đêm CŨ (để bóc tách tiền dịch vụ)
    // bookings là danh sách gốc chưa sửa
    const originalBooking = bookings.find(
      (b) => b.MaDatPhong === editingBooking.MaDatPhong
    );
    const oldNights = calculateNights(
      originalBooking.NgayNhanPhong,
      originalBooking.NgayTraPhong
    );

    // 3. Tính tiền dịch vụ hiện có = Tổng cũ - (Giá phòng * Đêm cũ)
    const currentServiceFee =
      parseFloat(originalBooking.TongTien) - editingRoomRate * oldNights;

    // 4. Tính TỔNG TIỀN MỚI = (Giá phòng * Đêm Mới) + Dịch vụ cũ
    const newRoomTotal = editingRoomRate * newNights;
    const newTotalMoney = newRoomTotal + currentServiceFee;

    console.log(
      `Debug tính giá: Đêm Mới ${newNights}, Giá ${editingRoomRate}, Dịch vụ ${currentServiceFee} => Tổng ${newTotalMoney}`
    );

    try {
      const payload = {
        ...editingBooking,
        TongTien: newTotalMoney, // Cập nhật giá mới
      };

      const res = await fetch(
        `${API_BASE_URL}/bookings/${editingBooking.MaDatPhong}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert(
          `✅ Cập nhật thành công!\nTổng tiền mới: ${fmtMoney(newTotalMoney)}`
        );
        setIsEditing(false);
        fetchHistory(); // Load lại danh sách từ server
      } else {
        alert("Lỗi cập nhật booking (Server Error)");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối mạng");
    }
  };

  const handleDateChange = (f, v) =>
    setEditingBooking({ ...editingBooking, [f]: v });

  // --- 6. CÁC HÀM UI KHÁC ---
  const renderStatus = (s) => {
    const st = String(s || "").toLowerCase();
    if (st.includes("hủy") || st.includes("cancel"))
      return (
        <span className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded text-xs">
          Đã hủy
        </span>
      );
    return (
      <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">
        Thành công
      </span>
    );
  };

  const handleCancel = async (b) => {
    if (!confirm("Chắc chắn hủy đơn này?")) return;
    try {
      await fetch(`${API_BASE_URL}/bookings/${b.MaDatPhong}`, {
        method: "DELETE",
      });
      alert("Đã hủy đơn đặt phòng.");
      fetchHistory();
    } catch (e) {
      alert("Lỗi khi hủy");
    }
  };

  // Tính tổng tiền realtime cho Modal Detail
  const calculateTotalBill = () => {
    if (!selectedBooking || !roomDetail) return 0;
    // Tiền phòng
    const nights = calculateNights(
      selectedBooking.NgayNhanPhong,
      selectedBooking.NgayTraPhong
    );
    const roomTotal = parseFloat(roomDetail.GiaPhong) * nights;
    // Tiền dịch vụ
    const serviceTotal = bookingServices.reduce(
      (sum, s) => sum + (parseFloat(s.ThanhTien) || 0),
      0
    );
    return roomTotal + serviceTotal;
  };

  if (!user)
    return (
      <div className="p-20 text-center text-gray-500">
        Vui lòng đăng nhập để xem lịch sử.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl text-primary font-serif text-center mb-8">
          Lịch Sử Đặt Phòng
        </h1>
        {loading ? (
          <div className="text-center">
            <Loader2 className="animate-spin inline text-primary" size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.length === 0 && (
              <p className="text-center text-gray-500">
                Bạn chưa có đơn đặt phòng nào.
              </p>
            )}

            {bookings.map((b) => (
              <div
                key={b.MaDatPhong}
                className="bg-white p-6 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg">#{b.MaDatPhong}</p>
                    {renderStatus(b.TrangThai)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Ngày đặt: {new Date(b.NgayDat).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Check-in:{" "}
                    {new Date(b.NgayNhanPhong).toLocaleDateString("vi-VN")} -
                    Check-out:{" "}
                    {new Date(b.NgayTraPhong).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                  <p className="text-xl font-bold text-primary">
                    {fmtMoney(b.TongTien)}
                  </p>
                  <div className="flex gap-2 mt-0 md:mt-2">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm hover:bg-black flex items-center gap-1 transition"
                    >
                      <Eye size={14} /> Chi tiết
                    </button>
                    {!String(b.TrangThai).toLowerCase().includes("hủy") && (
                      <>
                        <button
                          onClick={() => openEditModal(b)}
                          className="border border-blue-200 text-blue-600 px-3 py-1.5 rounded text-sm hover:bg-blue-50 transition"
                          title="Sửa ngày"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleCancel(b)}
                          className="border border-red-200 text-red-600 px-3 py-1.5 rounded text-sm hover:bg-red-50 transition"
                          title="Hủy đơn"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL CHI TIẾT --- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="relative bg-white w-full max-w-2xl rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-primary p-4 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold text-lg">
                Chi tiết đơn #{selectedBooking.MaDatPhong}
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="hover:bg-white/20 rounded p-1 transition"
              >
                <X />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {detailLoading ? (
                <div className="text-center py-10">
                  <Loader2
                    className="animate-spin inline text-primary"
                    size={32}
                  />
                </div>
              ) : (
                <>
                  {/* THÔNG TIN PHÒNG */}
                  {roomDetail && (
                    <div className="flex gap-4 bg-blue-50 p-4 rounded border border-blue-100">
                      <div className="w-24 h-24 relative rounded overflow-hidden shrink-0 shadow-sm">
                        <Image
                          src={
                            roomDetail.HinhAnh ||
                            "https://images.unsplash.com/photo-1611892440504-42a792e24d32"
                          }
                          fill
                          className="object-cover"
                          alt="room"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 text-lg">
                          <BedDouble size={20} /> {roomDetail.TenPhong}
                        </h4>
                        <p className="text-sm font-medium mt-1">
                          Đơn giá: {fmtMoney(roomDetail.GiaPhong)} / đêm
                        </p>
                        <p className="text-sm text-gray-600">
                          Thời gian lưu trú:{" "}
                          <span className="font-bold text-black">
                            {calculateNights(
                              selectedBooking.NgayNhanPhong,
                              selectedBooking.NgayTraPhong
                            )}
                          </span>{" "}
                          đêm
                        </p>
                        {hotelDetail && (
                          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                            <MapPin size={12} /> {hotelDetail.TenKhachSan}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* DANH SÁCH DỊCH VỤ */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b font-bold text-sm text-gray-700 flex justify-between items-center">
                      <span>
                        <Utensils size={16} className="inline mr-2" /> Dịch vụ
                        đã sử dụng
                      </span>
                      {!String(selectedBooking.TrangThai)
                        .toLowerCase()
                        .includes("hủy") && (
                        <button
                          onClick={handleOpenMenu}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1 transition shadow-sm"
                        >
                          <PlusCircle size={14} /> Gọi món
                        </button>
                      )}
                    </div>

                    {bookingServices.length > 0 ? (
                      <div className="divide-y max-h-60 overflow-y-auto">
                        {bookingServices.map((s, idx) => (
                          <div
                            key={idx}
                            className="p-3 flex justify-between text-sm items-center hover:bg-gray-50"
                          >
                            <div className="flex gap-3 items-center">
                              {s.HinhAnh && (
                                <div className="w-10 h-10 relative rounded overflow-hidden border">
                                  <Image
                                    src={s.HinhAnh}
                                    fill
                                    className="object-cover"
                                    alt="s"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {s.TenDV}
                                </p>
                                <p className="text-xs text-gray-500">
                                  SL: {s.SoLuong} x {fmtMoney(s.DonGia)}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-700">
                              {fmtMoney(parseFloat(s.ThanhTien) || 0)}
                            </span>
                          </div>
                        ))}
                        <div className="p-3 bg-gray-50 flex justify-between border-t text-sm sticky bottom-0">
                          <span className="font-bold text-gray-600">
                            Tổng tiền dịch vụ:
                          </span>
                          <span className="font-bold text-primary">
                            {fmtMoney(
                              bookingServices.reduce(
                                (sum, s) =>
                                  sum + (parseFloat(s.ThanhTien) || 0),
                                0
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-gray-50">
                        <p className="text-sm text-gray-400 italic">
                          Chưa có dịch vụ nào được gọi.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* TỔNG KẾT TIỀN */}
                  <div className="bg-gray-900 text-white p-4 rounded-lg flex justify-between items-center shadow-lg">
                    <div>
                      <span className="text-gray-300 text-sm block">
                        Tổng thanh toán dự kiến
                      </span>
                      <span className="text-xs text-gray-400 font-light">
                        *Đã bao gồm tiền phòng và dịch vụ
                      </span>
                    </div>
                    <span className="font-bold text-2xl text-yellow-400 tracking-wider">
                      {fmtMoney(calculateTotalBill())}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MENU MODAL (Gọi Món) --- */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl h-[80vh] flex flex-col">
            <div className="bg-gray-900 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <ShoppingBag size={20} /> Menu Dịch Vụ
              </h3>
              <button
                onClick={() => setShowMenu(false)}
                className="hover:bg-white/20 rounded p-1 transition"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {menuLoading ? (
                <div className="text-center py-10">
                  <Loader2
                    className="animate-spin inline text-gray-400"
                    size={32}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {menuList.map((item) => (
                    <div
                      key={item.MaDV}
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3 hover:shadow-md transition group"
                    >
                      <div className="w-20 h-20 relative rounded-md overflow-hidden shrink-0 bg-gray-200">
                        <Image
                          src={
                            item.HinhAnh ||
                            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=200"
                          }
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                          alt={item.TenDV}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800 line-clamp-1">
                            {item.TenDV}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                            {item.MoTa || "Không có mô tả"}
                          </p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <span className="font-bold text-primary text-sm">
                            {fmtMoney(item.GiaDV)}
                          </span>
                          <button
                            onClick={() => handleOrderService(item)}
                            className="bg-black text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-800 active:scale-95 transition shadow-sm"
                          >
                            + Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL (Sửa Ngày) --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="font-bold text-xl mb-1">Cập nhật thời gian</h3>
            <p className="text-sm text-gray-500 mb-6">
              Thay đổi ngày nhận/trả phòng
            </p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Ngày nhận phòng
                </label>
                <input
                  type="date"
                  className="w-full border p-2 rounded focus:border-primary outline-none"
                  value={editingBooking.NgayNhanPhong}
                  onChange={(e) =>
                    handleDateChange("NgayNhanPhong", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Ngày trả phòng
                </label>
                <input
                  type="date"
                  className="w-full border p-2 rounded focus:border-primary outline-none"
                  value={editingBooking.NgayTraPhong}
                  onChange={(e) =>
                    handleDateChange("NgayTraPhong", e.target.value)
                  }
                  required
                />
              </div>

              <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 border border-blue-100">
                <p>
                  ⚠️ Lưu ý: Giá tổng sẽ được tính lại dựa trên số đêm mới và các
                  dịch vụ đã sử dụng.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-gray-300 p-2.5 rounded font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white p-2.5 rounded font-bold hover:bg-gray-800"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
