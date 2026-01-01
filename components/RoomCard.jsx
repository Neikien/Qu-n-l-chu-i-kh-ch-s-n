import React, { useState } from 'react';
import TaxDetailModal from './TaxDetailModal';

const formatCurrency = (amount, currencyCode) => {
    const locale = currencyCode === 'VND' ? 'vi-VN' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
    }).format(amount);
};

const RoomCard = ({ room, onOpenDetail, currentCurrency }) => {
  const [showRates, setShowRates] = useState(false);

  // CHỖ THIẾU QUAN TRỌNG NHẤT:
  const [selectedRateForTax, setSelectedRateForTax] = useState(null);

  const formattedPrice = formatCurrency(room.price, currentCurrency);

  return (
    <div className="room-card room-card-v2">
      <div className="room-main-content">
        {/* HÌNH ẢNH */}
        <div className="room-image-placeholder">
          <img src={room.imageSrc} alt={room.name} className="room-image" />
        </div>

        {/* THÔNG TIN PHÒNG */}
        <div className="room-details room-details-v2">
          <h3 className="room-title">{room.name}</h3>
          <p className="room-meta">
            <span><i className="fa fa-user"></i> {room.remaining} khách | </span>
            <span><i className="fa fa-expand"></i> {room.area} m²</span>
          </p>
          <button className="detail-link-text" onClick={onOpenDetail}>
              Chi tiết phòng
          </button>
        </div>

        {/* CỘT GIÁ BAN ĐẦU */}
        <div className="room-pricing-initial">
          <span className="member-label">GIẢM GIÁ HỘI VIÊN</span>
          <div className="current-price-block">
            <span className="price-value">{formattedPrice}</span>
            <span className="price-per-night">Mỗi đêm</span>
          </div>
          <button
            className={`select-room-btn ${showRates ? 'active' : ''}`}
            onClick={() => setShowRates(!showRates)}
          >
            {/* Thêm icon mũi tên và màu vàng như bạn muốn ở CSS */}
            <span>{showRates ? 'Đóng lại' : 'Xem giá'}</span>
            <i className={`fa fa-chevron-down arrow-icon ${showRates ? 'rotate' : ''}`}></i>
          </button>
        </div>
      </div>

      {/* BẢNG 2 CỘT HIỆN RA KHI ẤN XEM GIÁ */}
      {showRates && (
        <div className="rates-expansion-panel fade-in">
          <div className="rates-grid">
            {room.rates && room.rates.map((rate, idx) => {
              // Lưu ý: Tỷ giá nên lấy từ prop hoặc context thay vì viết cứng số
              const exchangeRate = 26385;
              const ratePrice = currentCurrency === 'VND' ? rate.price * exchangeRate : rate.price;

              return (
                <div key={idx} className="rate-column">
                  <div className="rate-header">
                    <h4 className="rate-option-title">{rate.title}</h4>
                    <ul className="rate-feature-list">
                      {rate.features.map((f, i) => <li key={i}>✓ {f}</li>)}
                    </ul>
                  </div>

                  <div className="rate-footer">
                    <div className="rate-price-row">
                      <span className="rate-price-amt">{formatCurrency(ratePrice, currentCurrency)}</span>
                      <button
                        className="info-icon-btn"
                        onClick={() => setSelectedRateForTax({...rate, price: ratePrice})} // Truyền giá đã đổi vào modal
                      >ⓘ</button>
                    </div>
                    <p className="rate-subtext">Mỗi đêm</p>
                    <button className="btn-select-rate">Chọn phòng</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT THUẾ */}
      <TaxDetailModal
        isOpen={!!selectedRateForTax}
        onClose={() => setSelectedRateForTax(null)}
        rate={selectedRateForTax}
        currency={currentCurrency}
      />
    </div>
  );
};

export default RoomCard;