// components/RoomCard.jsx
import React, { useState } from 'react';

// Hàm định dạng tiền tệ
const formatCurrency = (amount, currencyCode) => {
  const locale = currencyCode === 'VND' ? 'vi-VN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(amount);
};

const RoomCard = ({ room, onOpenDetail, currentCurrency, bookingDates }) => {
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Định dạng lại các giá trị tiền tệ
  const formattedPrice = formatCurrency(room.price, currentCurrency);
  const formattedTax = formatCurrency(room.tax, currentCurrency);

  // Hàm xử lý đặt phòng
  const handleBookRoom = async () => {
    // Kiểm tra user đã đăng nhập chưa
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Vui lòng đăng nhập để đặt phòng!');
      return;
    }

    // Kiểm tra có thông tin booking dates không
    if (!bookingDates || !bookingDates.checkIn || !bookingDates.checkOut) {
      alert('Vui lòng chọn ngày check-in và check-out!');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      // Tạo booking data
      const bookingData = {
        room_id: room.id || room.MaPH || 1, // Dựa vào cấu trực backend
        check_in_date: bookingDates.checkIn, // Format: YYYY-MM-DD
        check_out_date: bookingDates.checkOut,
        guests: bookingDates.guests || 2,
        rooms: bookingDates.rooms || 1,
        total_price: room.price,
        tax: room.tax
      };

      // Gọi API đặt phòng
      const response = await fetch('http://localhost:8000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        setBookingSuccess(true);
        alert('Đặt phòng thành công! Mã đặt phòng: ' + (data.booking_id || data.id));
        // Có thể chuyển hướng đến trang booking confirmation
      } else {
        setBookingError(data.detail || 'Đặt phòng thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Xử lý click nút "Xem giá" / "Đặt phòng"
  const handleActionButton = () => {
    const token = localStorage.getItem('access_token');
    
    if (token && bookingDates) {
      // Nếu đã đăng nhập và có booking dates -> đặt phòng
      handleBookRoom();
    } else {
      // Nếu chưa đăng nhập hoặc chưa có dates -> mở modal chi tiết
      onOpenDetail();
    }
  };

  // Xác định button text và class
  const getButtonConfig = () => {
    const token = localStorage.getItem('access_token');
    
    if (bookingSuccess) {
      return { text: '✅ Đã đặt', className: 'select-room-btn btn-success', disabled: true };
    }
    
    if (bookingLoading) {
      return { text: 'Đang xử lý...', className: 'select-room-btn btn-loading', disabled: true };
    }
    
    if (token && bookingDates) {
      return { text: 'Đặt phòng ngay', className: 'select-room-btn btn-book', disabled: false };
    }
    
    return { text: 'Xem giá', className: 'select-room-btn btn-brown', disabled: false };
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="room-card room-card-v2">
      {/* 1. Phần Hình ảnh */}
      <div className="room-image-placeholder">
        <img
          src={room.imageSrc}
          alt={`Hình ảnh ${room.name}`}
          width={300}
          height={200}
          className="room-image"
        />
        <div className="image-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* 2. Phần Chi tiết Phòng */}
      <div className="room-details room-details-v2">
        <h3 className="room-title">{room.name}</h3>
        <p className="room-meta">
          <span className="room-capacity">
            <i className="fa fa-user"></i> {room.remaining} |
          </span>
          <span className="room-area">
            <i className="fa fa-bed"></i> {room.area} mét vuông
          </span>
        </p>
        <button
          className="detail-link-text"
          onClick={onOpenDetail}
        >
          Chi tiết phòng
        </button>
      </div>

      {/* 3. Phần Giá (Pricing) */}
      <div className="room-pricing room-pricing-v2">
        <span className="member-label">GIẢM GIÁ CHO HỘI VIÊN</span>

        <div className="remaining-alert">
          ⚡ Chỉ còn lại {room.remaining} phòng
        </div>

        <p className="original-price">Từ {currentCurrency === 'USD' ? '159 USD' : '4.000.000 VND'}</p>

        <div className="current-price-block">
          <span className="price-value">{formattedPrice}</span>
          <span className="price-per-night">mỗi đêm</span>
        </div>

        <p className="tax-fee">
          Không bao gồm phí {formattedTax} một đêm
        </p>

        {/* Error message */}
        {bookingError && (
          <div className="booking-error">
            {bookingError}
          </div>
        )}

        {/* Action button */}
        <button
          className={buttonConfig.className}
          onClick={handleActionButton}
          disabled={buttonConfig.disabled}
        >
          {buttonConfig.text}
        </button>

        {/* Booking info */}
        {bookingDates && (
          <div className="booking-info">
            <small>
              {bookingDates.checkIn} → {bookingDates.checkOut}
              {bookingDates.guests && ` • ${bookingDates.guests} khách`}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
