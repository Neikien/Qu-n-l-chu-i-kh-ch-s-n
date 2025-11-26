// components/RoomListing.js
"use client";
import React, { useState } from 'react';
import RoomCard from './RoomCard';
import RoomDetailModal from './RoomDetailModal';
const mockRooms = [
  {
    name: 'Phòng Cổ Điển Giường King',
    area: 46,
    price: 143,
    tax: 7.13,
    remaining: 3,
    imageSrc:'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797077-4x3?wid=1280&fit=constrain&resmode=bisharp' ,
    detailImages: [
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797077-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830980397-4x3?wid=800&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830980397-4x3?wid=800&fit=constrain&resmode=bisharp'
    ]
  },
  {
    name: 'Phòng Cổ Điển 2 Giường Đơn',
    area: 46,
    price: 143,
    tax: 7.13,
    remaining: 4,
    imageSrc:'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797058-4x3?wid=1280&fit=constrain&resmode=bisharp',
    detailImages: [
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797058-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830980397-4x3?wid=800&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797009-4x3?wid=1280&fit=constrain&resmode=bisharp'
    ]
  },
  {
    name: 'Phòng Cổ Điển',
    area: 46,
    price: 143,
    tax: 7.13,
    remaining: 5,
    imageSrc:'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797058-4x3?wid=1280&fit=constrain&resmode=bisharp',
    detailImages: [
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797058-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797412-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797009-4x3?wid=1280&fit=constrain&resmode=bisharp'

    ]
  },
  {
    name: 'Phòng Cao Cấp Giường King',
    area: 56,
    price: 171,
    tax: 8.55,
    remaining: 2,
    imageSrc:'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830776194-4x3?wid=1280&fit=constrain&resmode=bisharp',
    detailImages: [
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830776194-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797412-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830980397-4x3?wid=800&fit=constrain&resmode=bisharp'
    ]
  },
  {
    name: 'Phòng Ambassador Suite',
    area: 138,
    price: 665,
    tax: 33.25,
    remaining: 1,
    imageSrc:'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8809984339-4x3?wid=1280&fit=constrain&resmode=bisharp',
    detailImages: [
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8809984339-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797009-4x3?wid=800&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797412-4x3?wid=1280&fit=constrain&resmode=bisharp'
    ]
  },
  {
    name: 'Phòng Tổng Thống',
    area: 348,
    price: 2518,
    tax: 125.88,
    remaining: 1,
    imageSrc:'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830959431-4x3?wid=1280&fit=constrain&resmode=bisharp',
    detailImages: [
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830959431-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797412-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830980397-4x3?wid=800&fit=constrain&resmode=bisharp'
    ]
  },
];

const RoomListing = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  return (
    <div className="hotel-page-container">
      {/* --- Header Khách sạn Tĩnh --- */}
      <h1 className="hotel-name">InterContinental Hanoi Landmark72</h1>
      <p className="hotel-address">
        Keangnam Hanoi Landmark Tower, Cau Giay, Hanoi Vietnam
      </p>

      {/* --- Thông tin Tóm tắt (Đánh giá & Tiện nghi) --- */}
      <div className="summary-info">
        <div className="rating-block">
          <span className="rating-score">4,7</span>
          <span className="review-count">779 đánh giá</span>
        </div>
        <div className="amenities-list">
          <span>🏨 1 Nhóm</span>
          <span>💪 Hoạt động chăm sóc sức khỏe</span>
          <span>👧 Hoạt động cho trẻ em</span>
          <span>🏋️ Trung tâm thể dục</span>
          <span>🍽️ Nhà hàng của khách sạn</span>
          <span>🅿️ Bao gồm đậu xe</span>
          <span>💼 Trung tâm dịch vụ doanh nhân</span>
          <span>🌐 Internet không dây</span>
          <span>🐾 Không cho mang theo thú cưng</span>
        </div>
        <p className="additional-info-link">Thông tin bổ sung</p>
      </div>

      {/* --- Phần Chọn Phòng --- */}
      <h2 className="room-selection-heading">Chọn phòng của bạn</h2>

      <div className="ihg-rewards-banner">
        <span className="ihg-logo">IHG ONE REWARDS</span>
        <span className="ihg-points">Đặt tối 7.000 điểm</span>
      </div>

      <div className="room-filters">
        <button className="filter-btn active">Loại giường</button>
        <button className="filter-btn">Tiện nghi</button>
        <select className="currency-select">
          <option>USD</option>
          <option>VND</option>
        </select>
        <button className="filter-btn">Gói</button>
        <button className="action-btn">Tiền</button>
        <button className="action-btn">Điểm + Tiền mặt</button>
        <button className="action-btn">Điểm</button>
      </div>

      <p className="found-rooms">Đã tìm thấy {mockRooms.length} phòng</p>

      {/* --- Danh Sách Phòng (Component Lặp lại) --- */}
      {/* --- Danh Sách Phòng --- */}
      <div className="rooms-container">
        {mockRooms.map((room, index) => (
          <RoomCard
            key={index}
            room={room}
            // Truyền hàm mở modal xuống RoomCard
            onOpenDetail={() => setSelectedRoom(room)}
          />
        ))}
      </div>

      {/* --- Render Modal nếu có phòng được chọn --- */}
      {selectedRoom && (
        <RoomDetailModal
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
        />
      )}

    </div>
  );
};

export default RoomListing;
