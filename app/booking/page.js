"use client";
// --- page.tsx (Chỉ thay thế component Header) ---
import React, { useState } from 'react';
import { format } from 'date-fns';
import HotelGallery from './components/HotelGallery';
import CustomDatePicker from './components/CustomDatePicker';
import RoomListing from './components/RoomListing';
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
const Header = () => {

  // 1. Khai báo State cho các trường nhập liệu
  // Khai báo biến today và tomorrow
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
        // hoặc để logic đóng trong một nút "Xác nhận" nếu có.
    };
  // NOTE: Việc chọn lịch sẽ cần một thư viện Date Picker chuyên dụng,
  // ở đây chúng ta chỉ mô phỏng trường nhập liệu ngày.

  return (
    <header className="uhf_headerFooter">
      {/* --- TOP UTILITY BAR (Không thay đổi) --- */}
      <div className="top-utility-bar">
        <div className="top-utility-content">
          <span className="contact">📞 00 812 8317 6253 | Quý vị cần giúp đỡ?</span>
          <div className="auth-links">
            <span>Tiếng Việt</span>
            <button className="btn-signin">Đăng nhập</button>
            <button className="btn-join">Tham gia miễn phí</button>
            <button className="btn-book-now">ĐẶT NGAY</button>
          </div>
        </div>
      </div>

      {/* --- MAIN NAV BAR --- */}
      <div className="main-nav-bar">
        <div className="search-widget-container">

          {/* Logo */}
          <div className="logo-container">
            <img
              src="https://img2.teletype.in/files/57/54/57541865-7050-4c41-96d2-ac9c0fac64ce.png"
              alt="InterContinental Hotels & Resorts"
              className="logo"
            />
          </div>

          {/* Thanh tìm kiếm chi tiết */}
          <div className="search-form-bar">

            {/* 1. NƠI GỌI ĐẾN (INPUT FIELD) */}
            <div className="search-field field-location">
              <span className="field-label">NƠI GỌI ĐẾN</span>
              <input
                type="text"
                placeholder="Ví dụ: Hanoi Landmark72..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)} // 👈 THAY ĐỔI TẠI ĐÂY
              />
            </div>

            {/* 2. 1 ĐÊM (Mô phỏng Date Picker) */}
            <div
                            className="search-field field-date"
                            onClick={() => setShowCalendar(!showCalendar)} // 👈 Bật/Tắt Lịch
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
            {/* 3. PHÒNG & KHÁCH (Tương tác Popup) */}
            <div
              className="search-field field-guests"
              onClick={() => setShowGuestPopup(!showGuestPopup)} // 👈 Mở/Đóng Popup
            >
              <span className="field-label">PHÒNG & KHÁCH</span>
              <div className="guest-select">
                {rooms} phòng, {guests} khách ▼
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
                <option>Gói Bữa Sáng</option>
              </select>
            </div>

            <button className="btn-tim-kiem-v2">TÌM KIẾM</button>
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

export default function HomePage() {
  return (
    <div>
      {/* 1. Phần Header & Thanh điều hướng */}
      <Header /> 
      <HotelGallery />
      {/* 2. Nội dung chính của trang (Phần chọn phòng) */}
      <main className="main-content">
        <RoomListing />
      </main>
      
      {/* 3. Footer */}
      <Footer />
      
      {/* LƯU Ý: Nếu bạn sử dụng App Router của Next.js (thư mục `app`), 
        Header và Footer nên được đặt trong `app/layout.tsx` để hiển thị trên tất cả các trang.
      */}
    </div>
  );
}

// Thêm CSS cơ bản cho Header/Footer vào file `styles/globals.css`