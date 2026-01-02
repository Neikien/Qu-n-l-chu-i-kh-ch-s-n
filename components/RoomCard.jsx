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

const RoomCard = ({ 
  room, 
  onOpenDetail, 
  currentCurrency, 
  onBookRoom, // THÊM CALLBACK ĐẶT PHÒNG
  searchParams // THÊM searchParams để lấy ngày đặt
}) => {
  const [showRates, setShowRates] = useState(false);
  const [selectedRateForTax, setSelectedRateForTax] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false); // Loading cho đặt phòng

  const formattedPrice = formatCurrency(room.price, currentCurrency);

  // HÀM XỬ LÝ ĐẶT PHÒNG
  const handleBookNow = async (e, rate = null) => {
    e.stopPropagation();
    
    if (!onBookRoom) {
      console.error('Không có callback onBookRoom');
      return;
    }

    setBookingLoading(true);
    
    try {
      // Tạo booking object với thông tin đầy đủ
      const bookingData = {
        room: {
          ...room,
          // Nếu có chọn rate cụ thể, dùng giá từ rate
          selectedRate: rate || room.rates?.[0],
          selectedRatePrice: rate ? rate.price : room.price,
          selectedRateTitle: rate ? rate.title : 'Mức giá tốt nhất'
        },
        searchParams: searchParams || {
          checkInDate: new Date().toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          rooms: 1,
          guests: 2
        }
      };
      
      console.log('📤 Gửi booking data từ RoomCard:', bookingData);
      
      // Gọi callback đặt phòng
      await onBookRoom(bookingData);
      
      console.log('✅ Đã gửi yêu cầu đặt phòng');
      
    } catch (error) {
      console.error('❌ Lỗi khi đặt phòng từ RoomCard:', error);
      alert('Lỗi khi đặt phòng: ' + error.message);
    } finally {
      setBookingLoading(false);
    }
  };

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
          
          {/* THÊM NÚT ĐẶT PHÒNG Ở ĐÂY */}
          <button
            className="book-now-btn"
            onClick={(e) => handleBookNow(e)}
            disabled={bookingLoading}
          >
            {bookingLoading ? 'ĐANG XỬ LÝ...' : 'ĐẶT NGAY'}
          </button>
          
          <button
            className={`select-room-btn ${showRates ? 'active' : ''}`}
            onClick={() => setShowRates(!showRates)}
          >
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
                        onClick={() => setSelectedRateForTax({...rate, price: ratePrice})}
                      >ⓘ</button>
                    </div>
                    <p className="rate-subtext">Mỗi đêm</p>
                    
                    {/* THÊM NÚT ĐẶT PHÒNG CHO TỪNG RATE */}
                    <button 
                      className="btn-select-rate"
                      onClick={(e) => handleBookNow(e, rate)}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? 'ĐANG XỬ LÝ...' : 'ĐẶT PHÒNG'}
                    </button>
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
        onBookNow={() => {
          if (selectedRateForTax) {
            handleBookNow({ stopPropagation: () => {} }, selectedRateForTax);
          }
        }}
      />
    </div>
  );
};

export default RoomCard;