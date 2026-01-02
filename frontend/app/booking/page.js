"use client";
import React, { useState } from 'react';
import { format } from 'date-fns';
import HotelGallery from '@/components/HotelGallery';
import CustomDatePicker from '@/components/CustomDatePicker';
import RoomListing, { initialMockRooms } from '@/components/RoomListing';

// --- COMPONENT HEADER CÓ TƯƠNG TÁC ---
const Header = ({ onSearchUpdate }) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [destination, setDestination] = useState('Intercontinental Hanoi Landmark');
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [checkInDate, setCheckInDate] = useState(format(today, 'dd/MM/yyyy'));
  const [checkOutDate, setCheckOutDate] = useState(format(tomorrow, 'dd/MM/yyyy'));
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (inDate, outDate) => {
    setCheckInDate(inDate);
    setCheckOutDate(outDate);
  };

  const handleSearch = async () => {
    const searchParams = {
      location: destination,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: guests,
      roomCount: rooms
    };

    try {
      // Gọi API thật của backend
      const response = await fetch(`http://localhost:8000/rooms/?hotel_name=${encodeURIComponent(destination)}`);
      const data = await response.json();

      // Nếu không có dữ liệu, lấy tất cả phòng
      const roomsData = data.length > 0 ? data : await fetch('http://localhost:8000/rooms/').then(r => r.json());
      
      onSearchUpdate(roomsData);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      // Fallback: dùng mock data
      onSearchUpdate(initialMockRooms);
    }
  };

  return (
    <header className="booking-search-bar">
      <div className="main-nav-bar">
        <div className="search-widget-container">
          <div className="search-form-bar">
            {/* Logo từ bản 1 */}
            <div className="logo-container">
              <img
                src="https://img2.teletype.in/files/57/54/57541865-7050-4c41-96d2-ac9c0fac64ce.png"
                alt="InterContinental Hotels & Resorts"
                className="logo"
              />
            </div>

            <div className="search-field field-location">
              <span className="field-label">NƠI GỌI ĐẾN</span>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
              />
            </div>

            <div
              className="search-field field-date"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <span className="field-label">1 ĐÊM</span>
              <div className="date-range-display">
                {checkInDate} → {checkOutDate}
              </div>
              {showCalendar && (
                <CustomDatePicker
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  onDateChange={handleDateChange}
                />
              )}
            </div>

            <div
              className="search-field field-guests"
              onClick={() => setShowGuestPopup(!showGuestPopup)}
            >
              <span className="field-label">PHÒNG & KHÁCH</span>
              <div className="guest-select">
                {rooms} phòng, {guests} khách ▼
              </div>
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

          <div className="breadcrumb-nav">
            <a href="#">Trang chủ</a> &gt; <a href="#">Chọn một khách sạn</a> &gt; Chọn phòng
          </div>
        </div>
      </div>
    </header>
  );
};

export default function BookingPage() {
  const [roomsData, setRoomsData] = useState(initialMockRooms);
  const updateRooms = (newData) => {
    setRoomsData(newData);
  };

  return (
    <div className="booking-page-container">
      {/* Hero Banner từ bản 2 */}
      <div className="booking-hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content text-center">
          <p className="text-white uppercase tracking-[0.2em] text-sm mb-4 font-medium">
            Discover Your Next Stay
          </p>
          <h1 className="text-white font-serif text-6xl md:text-7xl font-normal tracking-wide">
            Book Your Getaway
          </h1>
        </div>
      </div>

      {/* Search Bar đè lên hero */}
      <div className="search-bar-container relative z-20 -mt-16 px-4 sm:px-8 lg:px-16">
        <Header onSearchUpdate={updateRooms} />
      </div>

      <main className="main-content max-w-[1320px] mx-auto px-5 py-12">
        <div className="breadcrumb-nav mb-8 text-sm text-gray-500">
          <a href="#">Trang chủ</a> &gt; <span>Đặt phòng</span>
        </div>
        
        {/* Hotel Gallery từ bản 1 */}
        <HotelGallery />
        
        <RoomListing rooms={roomsData} />
      </main>

      <footer className="footer bg-gray-100 py-8 text-center">
        <p>Hải Đăng Luxury Hotel - Managed by InterContinental</p>
      </footer>
    </div>
  );
}