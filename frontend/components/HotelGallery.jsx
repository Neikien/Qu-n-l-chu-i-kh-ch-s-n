// ./components/HotelGallery.jsx
"use client";
import React from 'react';

// Dữ liệu ảnh mô phỏng từ các ảnh bạn đã gửi
const MOCK_GALLERY_IMAGES = [
  { src: 'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5379482061-4x3?wid=940&fit=constrain&resmode=bisharp', alt: 'Khách sạn InterContinental Hà Nội Landmark 72' }, // Tải ảnh này vào public/images/
  { src: 'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8831054182-4x3?wid=940&fit=constrain&resmode=bisharp', alt: 'Nội thất phòng khách sạn' },
  { src: 'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-6518976275-4x3?wid=940&fit=constrain&resmode=bisharp', alt: 'Khách nhìn ra cảnh quan' },
  { src: 'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-6864221890-4x3?wid=940&fit=constrain&resmode=bisharp', alt: 'Bàn ăn và đầu bếp' },
  { src: 'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-6503559295-4x3?wid=940&fit=constrain&resmode=bisharp', alt: 'Phòng hội nghị' },
];

// NOTE: Vì bạn đang dùng Next.js, bạn nên dùng Component <Image> nếu có.
// Nếu không, hãy dùng thẻ <img> HTML thuần như bên dưới.
const HotelGallery = () => {
  // Ba ảnh lớn bên trái và hai hàng ảnh nhỏ bên phải
  const heroImage = MOCK_GALLERY_IMAGES[0];
  const rightColumnImages = MOCK_GALLERY_IMAGES.slice(1);

  return (
    <div className="hotel-gallery-block">
      <div className="gallery-main-image">
        {/* Ảnh chính (to nhất, bên trái) */}
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className="main-image"
        />
      </div>

      <div className="gallery-secondary-grid">
        {/* Các ảnh phụ (bên phải) */}
        {rightColumnImages.map((image, index) => (
          <div key={index} className="secondary-image-container">
            <img
              src={image.src}
              alt={image.alt}
              className="secondary-image"
            />
            {/* Nút Xem tất cả ảnh (chỉ hiển thị trên ảnh cuối cùng) */}
            {index === rightColumnImages.length - 1 && (
              <button className="btn-view-all">Xem tất cả ảnh</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelGallery;