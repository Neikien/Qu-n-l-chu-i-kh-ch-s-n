// components/RoomListing.jsx
"use client";
import React, { useState, useEffect } from 'react';
import RoomCard from './RoomCard';
import RoomDetailModal from './RoomDetailModal';

const RoomListing = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const EXCHANGE_RATE = 26385;

  // 1. Fetch rooms từ API
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      // TODO: Cần biết API endpoint lấy rooms
      // Tạm thời dùng mock data, sau này thay bằng API call thật
      const response = await fetch('http://localhost:8000/rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Giả sử API trả về array của rooms
        // Nếu API chưa có, tạm dùng mock data
        if (Array.isArray(data) && data.length > 0) {
          setRooms(data);
        } else {
          // Fallback: dùng mock data nếu API chưa có
          setRooms(getMockRooms());
        }
      } else {
        // Fallback: dùng mock data nếu API lỗi
        console.warn('API rooms chưa sẵn sàng, dùng mock data');
        setRooms(getMockRooms());
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Không thể tải danh sách phòng. Vui lòng thử lại.');
      // Fallback: dùng mock data
      setRooms(getMockRooms());
    } finally {
      setLoading(false);
    }
  };

  // Mock data function (tạm thời)
  const getMockRooms = () => {
    return [
      {
        id: 1,
        name: 'Phòng Cổ Điển Giường King',
        area: 46,
        price: 143,
        tax: 7.13,
        remaining: 3,
        imageSrc: 'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797077-4x3?wid=1280&fit=constrain&resmode=bisharp',
        detailImages: [
          'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797077-4x3?wid=1280&fit=constrain&resmode=bisharp',
          'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830980397-4x3?wid=800&fit=constrain&resmode=bisharp',
          'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830980397-4x3?wid=800&fit=constrain&resmode=bisharp'
        ]
      },
      // ... thêm các room khác từ mock data cũ
    ];
  };

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

  // 3. Tính toán giá theo currency
  const calculatePrice = (priceUSD, taxUSD) => {
    if (currency === 'VND') {
      return {
        price: Math.round(priceUSD * EXCHANGE_RATE),
        tax: Math.round(taxUSD * EXCHANGE_RATE)
      };
    }
    return { price: priceUSD, tax: taxUSD };
  };

  return (
    <div className="hotel-page-container">
      {/* --- Header Khách sạn Tĩnh --- */}
      <h1 className="hotel-name">InterContinental Hanoi Landmark72</h1>
      <p className="hotel-address">
        Keangnam Hanoi Landmark Tower, Cau Giay, Hanoi Vietnam
      </p>

      {/* --- Thông tin Tóm tắt (Đánh giá & Tiện nghi - Đã sửa đẹp hơn) --- */}
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
        <select
          className="currency-select"
          onChange={(e) => setCurrency(e.target.value)}
          value={currency}
        >
          <option value="USD">USD</option>
          <option value="VND">VND</option>
        </select>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="loading-state">
          <p>Đang tải danh sách phòng...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchRooms} className="retry-btn">Thử lại</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="found-rooms">Đã tìm thấy {rooms.length} phòng</p>

          {/* --- Danh Sách Phòng --- */}
          <div className="rooms-container">
            {rooms.map((room) => {
              const { price, tax } = calculatePrice(room.price, room.tax);
              
              return (
                <RoomCard
                  key={room.id || room.name}
                  room={{
                    ...room,
                    price: price,
                    tax: tax,
                  }}
                  currentCurrency={currency}
                  onOpenDetail={() => setSelectedRoom(room)}
                />
              );
            })}
          </div>
        </>
      )}

      {/* --- Render Modal nếu có phòng được chọn --- */}
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
