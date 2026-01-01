// components/RoomCard.jsx

import React from 'react';

// Hàm định dạng tiền tệ (Sử dụng Intl.NumberFormat cho chuẩn quốc tế)
const formatCurrency = (amount, currencyCode) => {
    // Nếu là USD, dùng chuẩn USD. Nếu là VND, dùng chuẩn Việt Nam.
    const locale = currencyCode === 'VND' ? 'vi-VN' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0, // Bỏ số thập phân (vì VND thường là số nguyên)
    }).format(amount);
};
const RoomCard = ({ room,onOpenDetail, currentCurrency }) => {
  // Định dạng lại các giá trị tiền tệ
  const formattedPrice = formatCurrency(room.price, currentCurrency);
  const formattedTax = formatCurrency(room.tax, currentCurrency);
  return (
    // Dùng class 'flex' để căn chỉnh nội dung
    <div className="room-card room-card-v2">

      {/* 1. Phần Hình ảnh */}
      <div className="room-image-placeholder">
        {/* Dùng thẻ <img> HTML thuần nếu chưa cấu hình Next/Image */}
        <img
          src={room.imageSrc}
          alt={`Hình ảnh ${room.name}`}
          width={300}
          height={200}
          className="room-image"
        />
        {/* Thêm các chấm trượt ảnh (chỉ là giả lập) */}
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
          {/* Sửa lại icon và ký hiệu */}
          <span className="room-capacity">
            <i className="fa fa-user"></i> {room.remaining} |
          </span>
          <span className="room-area">
            <i className="fa fa-bed"></i> {room.area} mét vuông
          </span>
        </p>
        <button
            className="detail-link-text"
            onClick={onOpenDetail} // Gọi hàm mở modal khi click
        >
            Chi tiết phòng
        </button>
      </div>

      {/* 3. Phần Giá (Pricing) */}
      <div className="room-pricing room-pricing-v2">

        <span className="member-label">GIẢM GIÁ CHO HỘI VIÊN</span>

        {/* Giả lập thông báo còn phòng  */}
        <div className="remaining-alert">
            ⚡ Chỉ còn lại {room.remaining} phòng
        </div>

        {/* Giá gốc: Chỉ cần hiển thị thông báo, không cần tính toán */}
        <p className="original-price">Từ {currentCurrency === 'USD' ? '159 USD' : '4.000.000 VND'}</p>

        <div className="current-price-block">
          {/* SỬA: Hiển thị giá trị đã được định dạng */}
          <span className="price-value">{formattedPrice}</span>
          <span className="price-per-night">mỗi đêm</span>
        </div>

        <p className="tax-fee">
          Không bao gồm phí {formattedTax} một đêm
        </p>

        <button className="select-room-btn btn-brown"> Xem giá </button>
      </div>
    </div>
  );
};

export default RoomCard;

