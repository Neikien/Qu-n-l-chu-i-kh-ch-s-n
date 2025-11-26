// components/RoomDetailModal.js
"use client";
import React, { useState } from 'react';

const RoomDetailModal = ({ room, onClose }) => {
  if (!room) return null;

  // --- SỬA ĐỔI TẠI ĐÂY ---
  // Lấy danh sách ảnh từ dữ liệu phòng.
  // Nếu không có detailImages thì dùng tạm imageSrc làm mảng 1 phần tử để không bị lỗi.
  const images = room.detailImages && room.detailImages.length > 0
    ? room.detailImages
    : [room.imageSrc];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImage = () => {
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Header Modal */}
        <div className="modal-header">
          <h2 className="modal-title">{room.name}</h2>
          <button className="btn-close-modal" onClick={onClose}>×</button>
        </div>

        {/* Body Modal (Scrollable) */}
        <div className="modal-body">

          {/* 1. Image Slider */}
          <div className="modal-image-slider">
            <button className="slider-btn prev" onClick={prevImage}>‹</button>
            <img
                src={images[currentImgIndex]}
                alt={room.name}
                className="modal-main-image"
            />
            <button className="slider-btn next" onClick={nextImage}>›</button>

            {/* Dots */}
            <div className="slider-dots">
                {images.map((_, idx) => (
                    <span
                        key={idx}
                        className={`slider-dot ${idx === currentImgIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImgIndex(idx)}
                    ></span>
                ))}
            </div>
          </div>

          {/* 2. Mô tả ngắn */}
          <p className="modal-description">
            Phòng rộng rãi với các tiện nghi cao cấp, mang lại trải nghiệm nghỉ dưỡng tuyệt vời giữa lòng Hà Nội.
          </p>
          <hr className="modal-divider"/>

          {/* 3. Thông số cơ bản (Icons) */}
          <div className="modal-basic-info">
            <span className="info-item"><i className="fa fa-user"></i> 4 Người</span>
            <span className="dot-separator">•</span>
            <span className="info-item"><i className="fa fa-bed"></i> Giường lớn</span>
            <span className="dot-separator">•</span>
            <span className="info-item"><i className="fa fa-ruler-combined"></i> {room.area} mét vuông</span>
          </div>

          <p className="modal-sub-text">Phòng rộng {room.area} mét vuông & có Phòng Tắm riêng biệt</p>

          {/* 4. Danh sách tiện nghi chi tiết (2 Cột) */}
          <h3 className="amenities-heading">Tiện nghi phòng</h3>

          <div className="amenities-grid">
            <div className="amenities-column">
                <h4 className="amenity-cat-title">Loại Giường</h4>
                <ul className="amenity-list">
                    <li>1 giường lớn</li>
                </ul>

                <h4 className="amenity-cat-title">Hạng Phòng</h4>
                <ul className="amenity-list">
                    <li>{room.name.includes('Suite') ? 'Suite' : 'Cổ Điển'}</li>
                </ul>
            </div>

            <div className="amenities-column">
                <h4 className="amenity-cat-title">Tiện Ích Phòng Tắm</h4>
                <ul className="amenity-list">
                    <li>Bồn tắm và buồng tắm đứng riêng biệt</li>


                </ul>

                <h4 className="amenity-cat-title">Quy Định Hút Thuốc</h4>
                <ul className="amenity-list">
                    <li>Không Hút Thuốc</li>
                </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;