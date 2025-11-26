// components/RoomCard.jsx

import React from 'react';

const RoomCard = ({ room,onOpenDetail }) => {
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

        <p className="original-price">Từ 159 USD</p>

        <div className="current-price-block">
          <span className="price-value">{room.price} USD</span>
          <span className="price-per-night">mới đêm</span>
        </div>

        <p className="tax-fee">
          Không bao gồm phí {room.tax} USD một đêm
        </p>

        <button className="select-room-btn btn-brown">Xem giá</button>
      </div>
    </div>
  );
};

export default RoomCard;

