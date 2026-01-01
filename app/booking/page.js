"use client";
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import HotelGallery from '@/components/HotelGallery';
import CustomDatePicker from '@/components/CustomDatePicker';
import RoomListing, { initialMockRooms } from '@/components/RoomListing';
// Hàm xử lý logic tăng/giảm khách/phòng
const handleGuestClick = (e, type, operation, rooms, guests, setRooms, setGuests) => {
    e.stopPropagation();
    if (type === 'rooms') {
        setRooms(r => operation === '+' ? r + 1 : (r > 1 ? r - 1 : 1));
    } else {
        setGuests(g => operation === '+' ? g + 1 : (g > 1 ? g - 1 : 1));
    }
};
// --- COMPONENT HEADER CÓ TƯƠNG TÁC ---
const Header = ({ onSearchUpdate }) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [destination, setDestination] = useState('Intercontinental Hanoi Landmark');
  const [showGuestPopup, setShowGuestPopup] = useState(false); // State cho popup khách
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [checkInDate, setCheckInDate] = useState(format(today, 'dd/MM/yyyy'));
  const [checkOutDate, setCheckOutDate] = useState(format(tomorrow, 'dd/MM/yyyy'));
  const [showCalendar, setShowCalendar] = useState(false); // State quản lý hiển thị lịch
    // Hàm xử lý việc chọn ngày từ DatePicker
    const handleDateChange = (inDate, outDate) => {
        setCheckInDate(inDate);
        setCheckOutDate(outDate);
        // Lưu ý: KHÔNG đóng lịch ở đây. Để người dùng tự đóng bằng cách click ra ngoài

    };
  // NOTE: Việc chọn lịch sẽ cần một thư viện Date Picker chuyên dụng,
  // ở đây chúng ta chỉ mô phỏng trường nhập liệu ngày.
  const handleSearch = async () => {
    // 1. Tạo object chứa thông tin khách muốn tìm
    const searchParams = {
      location: destination,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: guests,
      roomCount: rooms
    };

    // 2. Gọi API đến Backend
    try {
      // Thay URL này bằng API thật của bạn khi có backend
      const response = await fetch(`https://api.yourhotel.com/rooms/search?location=${destination}`);
      const data = await response.json();

      // 3. Truyền dữ liệu mới nhận được về component cha (RoomListing)
      onSearchUpdate(data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  return (
    <header className="uhf_headerFooter booking-search-bar">
      <div className="main-nav-bar">
        <div className="search-widget-container">
          <div className="search-form-bar">
            <div className="search-field field-location">
              <span className="field-label">NƠI GỌI ĐẾN</span>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>

            {/* Ngày tháng */}
            <div
                            className="search-field field-date"
                            onClick={() => setShowCalendar(!showCalendar)} //Bật/Tắt Lịch
                        >
                            <span className="field-label">1 ĐÊM</span>
                            <div className="date-range-display">
                                {checkInDate} → {checkOutDate}
                            </div>

                            {/* Cửa sổ Lịch thực tế */}
                            {showCalendar && (
                                <CustomDatePicker
                                    checkInDate={checkInDate}
                                    checkOutDate={checkOutDate}
                                    onDateChange={handleDateChange}
                                />
                            )}
                        </div>
            {/* 3. PHÒNG & KHÁCH */}
            <div
              className="search-field field-guests"
              onClick={() => setShowGuestPopup(!showGuestPopup)} // 👈 Mở/Đóng Popup
            >
              <span className="field-label">PHÒNG & KHÁCH</span>
              <div className="guest-select">
                {rooms} phòng, {guests} khách   ▼
              </div>

              {/* Popup Tùy chỉnh số khách (JSX) */}
              {showGuestPopup && (
                <div className="guest-popup">
                  <div className="guest-option">
                    <span>Phòng:</span>
                    <button onClick={(e) => { e.stopPropagation(); setRooms(r => r > 1 ? r - 1 : 1) }}>-</button>
                    <span>{rooms}</span>
                    <button onClick={(e) => { e.stopPropagation(); setRooms(r => r + 1) }}>+</button>
                  </div>
                  <div className="guest-option">
                    <span>Khách:</span>
                    <button onClick={(e) => { e.stopPropagation(); setGuests(g => g > 1 ? g - 1 : 1) }}>-</button>
                    <span>{guests}</span>
                    <button onClick={(e) => { e.stopPropagation(); setGuests(g => g + 1) }}>+</button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. TÙY CHỌN MỨC GIÁ */}
            <div className="search-field field-price">
              <span className="field-label">TÙY CHỌN MỨC GIÁ</span>
              <select className="price-select" defaultValue="Best Available">
                <option>Best Available</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            <button className="btn-tim-kiem-v2" onClick={handleSearch}>TÌM KIẾM</button>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="breadcrumb-nav">
            <a href="#">Trang chủ</a> &gt; <a href="#">Chọn một khách sạn</a> &gt; Chọn phòng
          </div>

        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="footer">
    {/* Nội dung footer tĩnh nếu cần */}
    <p>Hải Đăng Luxury Hotel</p>
  </footer>
);
export default function BookingPage() {
  // Nên để dữ liệu mặc định là mảng rỗng hoặc mockRooms cũ để lúc mới vào trang không bị trống
  const [roomsData, setRoomsData] = useState(initialMockRooms);
  const updateRooms = (newData) => {
    // Khi gọi API thành công, dữ liệu mock sẽ bị thay thế bởi newData từ Backend
    setRoomsData(newData);
  };
  return (
   <div className="booking-page-container">
      {/* === PHẦN HERO BANNER MỚI (Ảnh nền + Chữ to) === */}
      <div className="booking-hero-section">
        {/* Lớp phủ màu đen mờ để chữ dễ đọc hơn */}
        <div className="hero-overlay"></div>

        <div className="hero-content text-center">
          <p className="text-white uppercase tracking-[0.2em] text-sm mb-4 font-medium">
            Discover Your Next Stay
          </p>
          {/* Tiêu đề chính lớn (Sử dụng font Playfair từ layout.js) */}
          <h1 className="text-white font-serif text-6xl md:text-7xl font-normal tracking-wide">
            Book Your Getaway
          </h1>
        </div>
      </div>

      {/* === THANH TÌM KIẾM (Header cũ) === */}
      {/* Đặt trong một container để căn chỉnh đè lên ảnh */}
      <div className="search-bar-container relative z-20 -mt-16 px-4 sm:px-8 lg:px-16">
         <Header onSearchUpdate={updateRooms} />
      </div>


      <main className="main-content max-w-[1320px] mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav mb-8 text-sm text-gray-500">
            <a href="#">Trang chủ</a> &gt; <span>Đặt phòng</span>
        </div>
        <RoomListing rooms={roomsData} />
      </main>

      <footer className="footer bg-gray-100 py-8 text-center">
        <p>Hải Đăng Luxury Hotel - Managed by InterContinental</p>
      </footer>
    </div>
  );
}