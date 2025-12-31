// components/RoomListing.js
"use client";
import React, { useState } from 'react';
import RoomCard from './RoomCard';
import RoomDetailModal from './RoomDetailModal';
export const initialMockRooms = [
  {
    name: 'Phòng Cổ Điển Giường King',
    area: 46,
    price: 143,
    tax: 7.13,
    remaining: 3,
    imageSrc:'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797077-4x3?wid=1280&fit=constrain&resmode=bisharp',
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
const RoomListing = ({ rooms = [] }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const EXCHANGE_RATE = 26385;

  // 2. Dữ liệu tiện nghi với class Icon (FontAwesome)
  const amenitiesData = [
    { icon: 'fa-swimmer', text: '1 Nhóm' },
    { icon: 'fa-spa', text: 'Hoạt động chăm sóc sức khỏe' },
    { icon: 'fa-rocket', text: 'Hoạt động cho trẻ em' },
    { icon: 'fa-dumbbell', text: 'Trung tâm thể dục' },
    { icon: 'fa-utensils', text: 'Nhà hàng của khách sạn' },
    { icon: 'fa-parking', text: 'Bao gồm đậu xe' },
    { icon: 'fa-desktop', text: 'Trung tâm dịch vụ doanh nhân' },
    { icon: 'fa-wifi', text: 'Internet không dây' },
    { icon: 'fa-paw', text: 'Không cho mang theo thú cưng' },
  ];

  return (
    <div className="hotel-page-container">
      {/* --- Header Khách sạn Tĩnh --- */}
      <h1 className="hotel-name">InterContinental Hanoi Landmark72</h1>
      <p className="hotel-address">
        Keangnam Hanoi Landmark Tower, Cau Giay, Hanoi Vietnam
      </p>

      {/* --- Thông tin Tóm tắt (Đánh giá & Tiện nghi) --- */}
      <div className="summary-info">
        {/* Phần đánh giá */}
        <div className="rating-block">
          <span className="rating-score">4,7</span>
          <a href="#" className="review-count">781 đánh giá</a>
        </div>

        {/* Phần danh sách tiện nghi dạng lưới (Dùng map để render) */}
        <div className="amenities-grid-container">
            {amenitiesData.map((item, index) => (
                <div key={index} className="amenity-item">
                    <i className={`fa ${item.icon} amenity-icon`}></i>
                    <span className="amenity-text">{item.text}</span>
                </div>
            ))}
        </div>

        {/* Link thông tin bổ sung */}
        <div className="additional-info-container">
            <a href="#" className="additional-info-link">Thông tin bổ sung</a>
        </div>
      </div>

      {/* --- Phần Chọn Phòng --- */}
      <h2 className="room-selection-heading">Chọn phòng của bạn</h2>
      <div className="room-filters">
        <button className="filter-btn">Loại giường</button>
        <button className="filter-btn">Tiện nghi</button>
        <select className="currency-select"
        onChange={(e) => setCurrency(e.target.value)}
        value={currency}
    >
          <option value ="USD">USD</option>
          <option value = "VND">VND</option>
        </select>
      </div>

      <p className="found-rooms">
        {rooms.length > 0 ? `Đã tìm thấy ${rooms.length} phòng` : "Đang tìm phòng trống..."}
      </p>

      <div className="rooms-container">
        {rooms.length > 0 ? (
          rooms.map((room, index) => {
            let displayedPrice = room.price;
            let displayedTax = room.tax;

            if (currency === 'VND') {
              displayedPrice = room.price * EXCHANGE_RATE;
              displayedTax = room.tax * EXCHANGE_RATE;
            }

            return (
              <RoomCard
                key={room.id || index} // Ưu tiên dùng id từ backend
                room={{
                  ...room,
                  price: displayedPrice,
                  tax: displayedTax,
                }}
                currentCurrency={currency}
                onOpenDetail={() => setSelectedRoom(room)}
              />
            );
          })
        ) : (
          <div className="no-rooms">
            <p>Không có phòng nào phù hợp với yêu cầu của bạn. Vui lòng thử lại với ngày khác.</p>
          </div>
        )}
      </div>

      {selectedRoom && (
        <RoomDetailModal
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
            currentCurrency={currency}
            exchangeRate={EXCHANGE_RATE}
        />
      )}
    </div>
  );
};

export default RoomListing;