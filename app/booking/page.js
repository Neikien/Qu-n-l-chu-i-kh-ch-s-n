"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import CustomDatePicker from "@/components/CustomDatePicker";
import RoomListing, { initialMockRooms } from "@/components/RoomListing";
import { apiService } from "@/services/apiService";

// --- CONSTANTS ---
const HOTEL_OPTIONS = [
  { id: 1, name: "Hanoi", value: "Hà Nội" },
  { id: 2, name: "Da Nang", value: "Đà Nẵng" },
  { id: 3, name: "Nha Trang", value: "Nha Trang" },
  { id: 4, name: "Da Lat", value: "Đà Lạt" },
  { id: 5, name: "Ho Chi Minh City", value: "TP.HCM" },
];

const HOTEL_MAPPING = {
  "Hà Nội": "Melmaybe Hà Nội",
  "Đà Nẵng": "Melmaybe Đà Nẵng",
  "Nha Trang": "Melmaybe Nha Trang",
  "Đà Lạt": "Melmaybe Đà Lạt",
  "TP.HCM": "Melmaybe TP.HCM",
};

// --- HEADER COMPONENT ---
const Header = ({ onSearchUpdate, searchParams, onSearchParamsChange }) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [destination, setDestination] = useState("Hà Nội");
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [rooms, setRooms] = useState(searchParams?.rooms || 1);
  const [guests, setGuests] = useState(searchParams?.guests || 2);
  const [checkInDate, setCheckInDate] = useState(
    searchParams?.checkInDate || format(today, "dd/MM/yyyy")
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams?.checkOutDate || format(tomorrow, "dd/MM/yyyy")
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (inDate, outDate) => {
    setCheckInDate(inDate);
    setCheckOutDate(outDate);
    onSearchParamsChange({
      checkInDate: formatDateToAPI(inDate),
      checkOutDate: formatDateToAPI(outDate),
      rooms,
      guests,
    });
  };

  const formatDateToAPI = (dateStr) => {
    if (!dateStr) return format(new Date(), "yyyy-MM-dd");
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      console.log("🔍 Searching area:", destination);
      const response = await fetch(
        "https://khachsan-backend-production-9810.up.railway.app/hotels/"
      );
      if (!response.ok) throw new Error("Cannot fetch hotel list");
      const hotels = await response.json();

      const destinationLower = destination.toLowerCase();
      const selectedHotel = hotels.find(
        (h) =>
          h.TenKS.toLowerCase().includes(destinationLower) ||
          h.DiaChi.toLowerCase().includes(destinationLower) ||
          (HOTEL_MAPPING[destination] &&
            h.TenKS.includes(HOTEL_MAPPING[destination]))
      );

      if (!selectedHotel) {
        alert(`❌ No hotels found in ${destination}`);
        setLoading(false);
        return;
      }

      const roomsResponse = await fetch(
        `https://khachsan-backend-production-9810.up.railway.app/rooms/?hotel_id=${selectedHotel.MaKS}`
      );
      if (!roomsResponse.ok)
        throw new Error(`API Error: ${roomsResponse.status}`);

      const rawRoomsData = await roomsResponse.json();
      const formattedRooms = rawRoomsData.map((room) => ({
        id: room.MaPhong,
        name: room.TenPhong,
        price: room.GiaPhong,
        image: room.HinhAnh,
        desc: room.MoTa || "A luxurious retreat...",
        MaPhong: room.MaPhong,
      }));

      const hotelInfo = {
        hotelName: selectedHotel.TenKS,
        hotelAddress: selectedHotel.DiaChi,
        hotelStars: selectedHotel.SoSao,
        hotelDescription: selectedHotel.MoTa,
        hotelArea: destination,
      };

      if (onSearchUpdate) {
        onSearchUpdate(formattedRooms, hotelInfo, selectedHotel.MaKS);
      }

      alert(`✅ Found ${formattedRooms.length} rooms at ${selectedHotel.TenKS}`);
    } catch (error) {
      console.error("❌ Search error:", error);
      alert(`Error: ${error.message}`);
      if (onSearchUpdate) onSearchUpdate(initialMockRooms, null, null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-white shadow-2xl p-6 md:p-8 mt-[-80px] z-30 border-t-4 border-accent">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* DESTINATION */}
        <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 px-2">
          <label className="block text-[10px] font-bold tracking-[2px] text-gray-400 uppercase mb-2">
            Destination
          </label>
          <div className="relative">
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full text-xl font-serif text-primary bg-transparent outline-none cursor-pointer appearance-none truncate pr-4"
              disabled={loading}
            >
              {HOTEL_OPTIONS.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DATE PICKER */}
        <div
          className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 px-4 cursor-pointer relative"
          onClick={() => !loading && setShowCalendar(!showCalendar)}
        >
          <label className="block text-[10px] font-bold tracking-[2px] text-gray-400 uppercase mb-2">
            Check-in — Check-out
          </label>
          <div className="text-xl font-serif text-primary truncate flex items-center gap-2">
            <span>{checkInDate}</span>
            <span className="text-accent text-sm">to</span>
            <span>{checkOutDate}</span>
          </div>
          {showCalendar && (
            <div
              className="absolute top-full left-0 mt-4 z-50 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <CustomDatePicker
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onDateChange={handleDateChange}
              />
            </div>
          )}
        </div>

        {/* GUESTS */}
        <div
          className="w-full md:w-1/4 pb-4 md:pb-0 px-4 cursor-pointer relative"
          onClick={() => !loading && setShowGuestPopup(!showGuestPopup)}
        >
          <label className="block text-[10px] font-bold tracking-[2px] text-gray-400 uppercase mb-2">
            Rooms & Guests
          </label>
          <div className="text-xl font-serif text-primary truncate">
            {rooms} Room(s), {guests} Guest(s)
          </div>
          {showGuestPopup && (
            <div
              className="absolute top-full left-0 mt-4 w-64 bg-white shadow-xl border border-gray-100 p-5 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                <span className="text-sm font-bold text-gray-600">ROOMS</span>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRooms((r) => (r > 1 ? r - 1 : 1));
                    }}
                    className="w-6 h-6 border rounded"
                  >
                    -
                  </button>
                  <span>{rooms}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRooms((r) => r + 1);
                    }}
                    className="w-6 h-6 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">GUESTS</span>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuests((g) => (g > 1 ? g - 1 : 1));
                    }}
                    className="w-6 h-6 border rounded"
                  >
                    -
                  </button>
                  <span>{guests}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuests((g) => g + 1);
                    }}
                    className="w-6 h-6 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BUTTON */}
        <div className="w-full md:w-auto">
          <button
            className="w-full md:w-auto px-10 py-4 bg-primary text-white text-sm font-bold tracking-[2px] uppercase hover:bg-gray-800 transition-all shadow-md"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function BookingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [roomsData, setRoomsData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    checkInDate: format(new Date(), "yyyy-MM-dd"),
    checkOutDate: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
    rooms: 1,
    guests: 2,
  });

  const [selectedHotelInfo, setSelectedHotelInfo] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  const updateRooms = (roomsData, hotelInfo, hotelId) => {
    setRoomsData(roomsData || []);
    if (hotelInfo) setSelectedHotelInfo(hotelInfo);
    if (hotelId) setSelectedHotelId(hotelId);
  };

  // HÀM ĐẶT PHÒNG ĐƠN GIẢN
  const handleBookRoom = async (roomData) => {
    console.log("🔍 Bắt đầu đặt phòng:", roomData);
    
    try {
      // 1. Kiểm tra đăng nhập
      if (!user || !user.token) {
        alert("Vui lòng đăng nhập để đặt phòng!");
        router.push("/login");
        return;
      }

      // 2. Lấy MaKH (tạm dùng 10 để test)
      let MaKH = 10; // TẠM DÙNG ĐỂ TEST
      
      // Nếu muốn lấy từ customer profile:
      // const customer = await apiService.getCustomerProfile();
      // if (customer?.MaKH) MaKH = customer.MaKH;

      // 3. Chuẩn bị booking data CHỈ 4 TRƯỜNG BẮT BUỘC
      const bookingData = {
        MaKH: MaKH,
        MaPhong: roomData.MaPhong || roomData.id,
        NgayNhanPhong: searchParams.checkInDate,
        NgayTraPhong: searchParams.checkOutDate
        // KHÔNG gửi: TrangThai, NgayDat, TongTien, SoNguoi, SoPhong
      };

      console.log("📤 Gửi booking:", bookingData);

      // 4. Gọi API đặt phòng
      const result = await apiService.createBooking(bookingData);
      
      console.log("✅ Booking thành công:", result);
      
      alert(`✅ Đặt phòng thành công! Mã: ${result.MaDatPhong}`);
      router.push(`/booking/confirmation/${result.MaDatPhong}`);
      
    } catch (error) {
      console.error("❌ Lỗi:", error);
      alert(`❌ Lỗi: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[50vh] w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5 z-20">
          <p className="text-xs md:text-sm font-bold tracking-[4px] uppercase mb-4 animate-fade-in-up">
            Discover Your Next Stay
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 animate-fade-in-up delay-100">
            Book Your Getaway
          </h1>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-16 mb-20">
        <Header
          onSearchUpdate={updateRooms}
          searchParams={searchParams}
          onSearchParamsChange={(params) => setSearchParams(params)}
        />
      </div>

      <main className="max-w-[1320px] mx-auto px-5 pb-24">
        <div className="mb-10 text-xs font-bold tracking-widest text-gray-400 uppercase">
          <a href="/" className="hover:text-primary transition-colors">
            Home
          </a>
          <span className="mx-2">&gt;</span>
          <span className="text-primary">Booking</span>
        </div>

        <div className="min-h-[400px]">
          <RoomListing
            rooms={roomsData}
            onBookRoom={handleBookRoom}
            searchParams={searchParams}
            hotelInfo={selectedHotelInfo}
            hotelId={selectedHotelId}
          />
        </div>
      </main>
    </div>
  );
}
