import React, { useState } from 'react';
import TaxDetailModal from './TaxDetailModal';
import { apiService } from '../services/apiService';
import { useRouter } from 'next/router'; // Nếu dùng Next.js
// Hoặc: import { useNavigate } from 'react-router-dom'; // Nếu dùng React Router

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
  onBookRoom, // Callback đặt phòng từ parent
  searchParams,
  showProfileAlert // Thêm prop để hiển thị thông báo
}) => {
  const [showRates, setShowRates] = useState(false);
  const [selectedRateForTax, setSelectedRateForTax] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // Modal yêu cầu cập nhật profile
  
  // Nếu dùng Next.js
  // const router = useRouter();
  // Nếu dùng React Router
  // const navigate = useNavigate();

  const formattedPrice = formatCurrency(room.price, currentCurrency);

  // HÀM KIỂM TRA PROFILE TRƯỚC KHI ĐẶT
  const checkProfileBeforeBooking = async () => {
    try {
      // Kiểm tra xem user đã đăng nhập chưa
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Vui lòng đăng nhập để đặt phòng');
        // Chuyển hướng đến trang login
        // router.push('/login');
        return false;
      }

      // Kiểm tra customer profile
      const hasProfile = await apiService.checkCustomerProfileExists();
      
      if (!hasProfile) {
        // Hiển thị modal yêu cầu cập nhật profile
        setShowProfileModal(true);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Lỗi kiểm tra profile:', error);
      return false;
    }
  };

  // HÀM XỬ LÝ ĐẶT PHÒNG (ĐÃ CẬP NHẬT)
  const handleBookNow = async (e, rate = null) => {
    e.stopPropagation();
    
    if (!onBookRoom) {
      console.error('Không có callback onBookRoom');
      return;
    }

    // Kiểm tra profile trước
    const canBook = await checkProfileBeforeBooking();
    if (!canBook) {
      return;
    }

    setBookingLoading(true);
    
    try {
      // Tạo booking object với thông tin đầy đủ
      const bookingData = {
        room: {
          ...room,
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
      // Hiển thị thông báo lỗi cụ thể
      if (error.message.includes('customer profile') || error.message.includes('thông tin cá nhân')) {
        setShowProfileModal(true);
      } else {
        alert('Lỗi khi đặt phòng: ' + error.message);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // HÀM CHUYỂN HƯỚNG ĐẾN TRANG CẬP NHẬT PROFILE
  const handleUpdateProfile = () => {
    setShowProfileModal(false);
    // Chuyển hướng đến trang cập nhật profile
    // router.push('/update-profile');
    // Hoặc mở modal cập nhật profile
    if (showProfileAlert) {
      showProfileAlert();
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
          
          {/* NÚT ĐẶT PHÒNG */}
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
                    
                    {/* NÚT ĐẶT PHÒNG CHO TỪNG RATE */}
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

      {/* MODAL YÊU CẦU CẬP NHẬT PROFILE */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cần cập nhật thông tin cá nhân</h3>
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Để đặt phòng, bạn cần cập nhật đầy đủ thông tin cá nhân (customer profile).</p>
              <p>Thông tin này bao gồm:</p>
              <ul>
                <li>Số điện thoại</li>
                <li>Địa chỉ</li>
                <li>Số CMND/CCCD</li>
                <li>Thông tin liên hệ khác</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowProfileModal(false)}>
                Để sau
              </button>
              <button className="btn-primary" onClick={handleUpdateProfile}>
                Cập nhật ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Thêm CSS cho modal
const styles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
  color: #666;
}

.modal-body ul {
  margin: 10px 0;
  padding-left: 20px;
}

.modal-body li {
  margin-bottom: 5px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary:hover {
  background: #545b62;
}
`;

// Thêm styles vào head nếu cần
// Hoặc đưa vào file CSS riêng

export default RoomCard;
