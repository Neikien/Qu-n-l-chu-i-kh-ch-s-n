"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import CustomDatePicker from "@/components/CustomDatePicker";
import RoomListing, { initialMockRooms } from "@/components/RoomListing";
import { apiService } from "@/services/apiService"; // ← Thêm import

// --- CONSTANTS --- (giữ nguyên)

// --- HEADER COMPONENT --- (giữ nguyên)

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
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  const updateRooms = (roomsData, hotelInfo, hotelId) => {
    setRoomsData(roomsData || []);
    if (hotelInfo) setSelectedHotelInfo(hotelInfo);
    if (hotelId) setSelectedHotelId(hotelId);
  };

  // HÀM KIỂM TRA VÀ LẤY CUSTOMER PROFILE
  const checkAndGetCustomerProfile = async () => {
    try {
      if (!user || !user.token) {
        throw new Error("Vui lòng đăng nhập để đặt phòng");
      }

      // 1. Kiểm tra xem đã có customer profile chưa
      const hasProfile = await apiService.checkCustomerProfileExists();
      
      if (!hasProfile) {
        throw new Error("Vui lòng cập nhật thông tin cá nhân trước khi đặt phòng");
      }

      // 2. Lấy customer profile thực tế
      const customerProfile = await apiService.getCustomerProfile();
      
      if (!customerProfile || !customerProfile.MaKH) {
        throw new Error("Không tìm thấy thông tin khách hàng. Vui lòng cập nhật profile");
      }

      return customerProfile;
    } catch (error) {
      console.error("❌ Lỗi kiểm tra profile:", error);
      throw error;
    }
  };

  // HÀM TẠO BOOKING MỚI - SỬA LẠI HOÀN TOÀN
  const handleBookRoom = async (roomData) => {
    console.log("🔍 Bắt đầu đặt phòng với:", roomData);
    
    try {
      setIsCheckingProfile(true);

      // 1. Kiểm tra đăng nhập
      if (!user || !user.token) {
        alert("Vui lòng đăng nhập để đặt phòng!");
        router.push("/login");
        return;
      }

      // 2. Kiểm tra và lấy customer profile
      let customerProfile;
      try {
        customerProfile = await checkAndGetCustomerProfile();
        console.log("✅ Customer profile:", customerProfile);
      } catch (profileError) {
        console.error("❌ Lỗi profile:", profileError.message);
        
        const shouldUpdate = confirm(
          `${profileError.message}\n\nBạn có muốn cập nhật thông tin ngay bây giờ?`
        );
        
        if (shouldUpdate) {
          router.push("/profile");
        }
        return;
      }

      // 3. Chuẩn bị booking data theo đúng API
      const bookingData = {
        MaKH: customerProfile.MaKH,
        MaPhong: roomData.MaPhong || roomData.id, // Dùng MaPhong từ roomData
        NgayNhanPhong: searchParams.checkInDate,
        NgayTraPhong: searchParams.checkOutDate,
        SoNguoi: searchParams.guests,
        SoPhong: searchParams.rooms,
        // Thêm các trường khác nếu API cần
        TongTien: roomData.price || roomData.selectedRatePrice || 0,
        GhiChu: `Đặt phòng ${roomData.name || roomData.TenPhong}`
      };

      console.log("📤 Booking data gửi đi:", bookingData);

      // 4. Gọi API đặt phòng
      const response = await fetch(
        "https://khachsan-backend-production-9810.up.railway.app/bookings/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        // Xử lý lỗi đặc biệt
        if (response.status === 400 && errorData.detail) {
          if (errorData.detail.includes("customer") || errorData.detail.includes("profile")) {
            throw new Error("Vui lòng cập nhật đầy đủ thông tin cá nhân: " + errorData.detail);
          }
        }
        
        throw new Error(
          errorData.detail || `Lỗi đặt phòng: ${response.status}`
        );
      }

      const bookingResult = await response.json();
      console.log("✅ Booking thành công:", bookingResult);
      
      alert(`✅ Đặt phòng thành công!\nMã đặt phòng: ${bookingResult.MaDatPhong}`);
      router.push(`/booking/confirmation/${bookingResult.MaDatPhong}`);
      
    } catch (error) {
      console.error("❌ Lỗi đặt phòng:", error);
      
      // Hiển thị thông báo thân thiện
      if (error.message.includes("Vui lòng cập nhật")) {
        alert(error.message);
        const updateNow = confirm("Bạn có muốn cập nhật thông tin ngay không?");
        if (updateNow) {
          router.push("/profile");
        }
      } else {
        alert(`❌ Đặt phòng thất bại: ${error.message}`);
      }
    } finally {
      setIsCheckingProfile(false);
    }
  };

  // THÊM HÀM ĐỂ TẠO CUSTOMER PROFILE TỰ ĐỘNG
  const createDefaultCustomerProfile = async () => {
    try {
      if (!user) return null;
      
      const defaultProfile = {
        user_id: user.id,
        full_name: user.fullname || user.username,
        email: user.email,
        phone: "",
        address: "",
        identification_number: "",
      };
      
      return await apiService.createCustomerProfile(defaultProfile);
    } catch (error) {
      console.error("Lỗi tạo profile mặc định:", error);
      return null;
    }
  };

  // KIỂM TRA KHI USER THAY ĐỔI
  useEffect(() => {
    const checkUserProfile = async () => {
      if (user && user.token) {
        try {
          const hasProfile = await apiService.checkCustomerProfileExists();
          if (!hasProfile) {
            console.log("👤 User chưa có customer profile, có thể tạo mặc định");
            // Có thể tự động tạo ở đây nếu muốn
          }
        } catch (error) {
          console.warn("Không thể kiểm tra customer profile:", error);
        }
      }
    };
    
    checkUserProfile();
  }, [user]);

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
          
          {/* THÊM THÔNG BÁO NẾU ĐANG KIỂM TRA */}
          {isCheckingProfile && (
            <div className="mt-4 p-3 bg-blue-500/80 rounded-lg">
              <p className="text-sm">
                <span className="animate-spin inline-block mr-2">⟳</span>
                Đang kiểm tra thông tin...
              </p>
            </div>
          )}
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
