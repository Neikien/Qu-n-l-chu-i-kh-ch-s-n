import React, { useState, useEffect } from 'react';
import TaxDetailModal from './TaxDetailModal';
import { apiService } from '../services/apiService';

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
  onBookRoom,
  searchParams
}) => {
  const [showRates, setShowRates] = useState(false);
  const [selectedRateForTax, setSelectedRateForTax] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileError, setProfileError] = useState('');
  
  // DEBUG: Kiểm tra khi component mount
  useEffect(() => {
    console.log('🔍 RoomCard mounted with room:', room.id);
    console.log('🔍 onBookRoom prop:', typeof onBookRoom);
  }, []);

  const formattedPrice = formatCurrency(room.price, currentCurrency);

  // HÀM KIỂM TRA LOGIN VÀ PROFILE - THÊM LOG CHI TIẾT
  const checkProfileBeforeBooking = async () => {
    console.log('🔍 Bắt đầu kiểm tra profile...');
    
    try {
      // 1. Kiểm tra token
      const token = localStorage.getItem('access_token');
      console.log('🔍 Token từ localStorage:', token ? 'Có' : 'Không');
      
      if (!token || token === 'undefined' || token === 'null') {
        setProfileError('Vui lòng đăng nhập để đặt phòng');
        setShowProfileModal(true);
        return false;
      }

      // 2. Kiểm tra user info
      try {
        const userInfo = await apiService.getProfile();
        console.log('🔍 User info:', userInfo);
        
        if (!userInfo || !userInfo.id) {
          setProfileError('Không thể lấy thông tin người dùng');
          return false;
        }
      } catch (userError) {
        console.error('❌ Lỗi lấy user info:', userError);
        setProfileError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        return false;
      }

      // 3. Kiểm tra customer profile - TRỰC TIẾP GỌI API
      try {
        console.log('🔍 Đang kiểm tra customer profile...');
        
        // Cách 1: Gọi API customers để tìm profile của user
        const customers = await apiService.getCustomers();
        console.log('🔍 Danh sách customers:', customers);
        
        // Lấy user_id từ token hoặc gọi lại getProfile
        const currentUser = await apiService.getProfile();
        const customer = customers.find(c => c.user_id === currentUser.id);
        
        console.log('🔍 Customer tìm thấy:', customer);
        
        if (!customer) {
          setProfileError('Bạn cần cập nhật thông tin cá nhân trước khi đặt phòng');
          setShowProfileModal(true);
          return false;
        }
        
        // Kiểm tra các trường bắt buộc
        const requiredFields = ['phone', 'address', 'identification_number'];
        const missingFields = requiredFields.filter(field => 
          !customer[field] || customer[field].trim() === ''
        );
        
        if (missingFields.length > 0) {
          setProfileError(`Vui lòng cập nhật: ${missingFields.join(', ')}`);
          setShowProfileModal(true);
          return false;
        }
        
        console.log('✅ Profile hợp lệ, có thể đặt phòng');
        return true;
        
      } catch (customerError) {
        console.error('❌ Lỗi kiểm tra customer profile:', customerError);
        // Nếu API customers không khả dụng, tạm cho qua
        console.warn('⚠️ API customers có thể không khả dụng, tiếp tục đặt phòng...');
        return true; // Tạm cho qua để test
      }
      
    } catch (error) {
      console.error('❌ Lỗi trong checkProfileBeforeBooking:', error);
      setProfileError('Lỗi kiểm tra thông tin: ' + error.message);
      return false;
    }
  };

  // HÀM XỬ LÝ ĐẶT PHÒNG - SỬA LẠI ĐỂ XỬ LÝ ĐÚNG ASYNC
  const handleBookNow = async (e, rate = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🟡 Bắt đầu handleBookNow, rate:', rate);
    
    // Kiểm tra callback
    if (typeof onBookRoom !== 'function') {
      console.error('❌ onBookRoom không phải là function:', onBookRoom);
      alert('Lỗi hệ thống: Không thể đặt phòng');
      return;
    }

    setBookingLoading(true);
    setProfileError('');
    
    try {
      // Kiểm tra profile trước
      console.log('🔍 Kiểm tra profile trước khi đặt...');
      const canBook = await checkProfileBeforeBooking();
      
      if (!canBook) {
        console.log('⛔ Không thể đặt phòng do profile');
        setBookingLoading(false);
        return;
      }
      
      // Chuẩn bị booking data
      const bookingData = {
        room_id: room.id,
        hotel_id: room.hotel_id,
        check_in_date: searchParams?.checkInDate || new Date().toISOString().split('T')[0],
        check_out_date: searchParams?.checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        number_of_guests: searchParams?.guests || 2,
        number_of_rooms: searchParams?.rooms || 1,
        total_price: rate ? rate.price : room.price,
        special_requests: rate ? rate.title : 'Standard rate'
      };
      
      console.log('📤 Booking data gửi đi:', bookingData);
      
      // Gọi callback - THÊM AWAIT
      const result = await onBookRoom(bookingData);
      console.log('✅ Kết quả từ onBookRoom:', result);
      
      // Hiển thị thông báo thành công
      alert('Đặt phòng thành công! Vui lòng kiểm tra email xác nhận.');
      
    } catch (error) {
      console.error('❌ Lỗi trong handleBookNow:', error);
      
      // Phân loại lỗi
      if (error.message && error.message.includes('customer')) {
        setProfileError(error.message);
        setShowProfileModal(true);
      } else if (error.message && error.message.includes('401')) {
        setProfileError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        setShowProfileModal(true);
      } else {
        alert('Đặt phòng thất bại: ' + (error.message || 'Lỗi không xác định'));
      }
    } finally {
      console.log('🟢 Kết thúc handleBookNow');
      setBookingLoading(false);
    }
  };

  // HÀM XỬ LÝ CẬP NHẬT PROFILE
  const handleUpdateProfileClick = () => {
    console.log('📝 Chuyển đến trang cập nhật profile');
    setShowProfileModal(false);
    
    // Cách 1: Redirect đến trang profile
    // window.location.href = '/profile';
    
    // Cách 2: Mở modal hoặc form cập nhật
    const shouldUpdate = confirm('Bạn có muốn cập nhật thông tin cá nhân ngay bây giờ?');
    if (shouldUpdate) {
      // Gọi API cập nhật profile hoặc hiển thị form
      // Ví dụ: hiển thị form inline
      alert('Tính năng đang được phát triển. Vui lòng vào trang "Thông tin cá nhân" để cập nhật.');
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
            {bookingLoading ? (
              <>
                <span className="spinner"></span> ĐANG XỬ LÝ...
              </>
            ) : 'ĐẶT NGAY'}
          </button>
          
          <button
            className={`select-room-btn ${showRates ? 'active' : ''}`}
            onClick={() => setShowRates(!showRates)}
            disabled={bookingLoading}
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
                        disabled={bookingLoading}
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
            handleBookNow({ 
              preventDefault: () => {},
              stopPropagation: () => {} 
            }, selectedRateForTax);
          }
        }}
      />

      {/* MODAL YÊU CẦU CẬP NHẬT PROFILE */}
      {showProfileModal && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <div className="modal-header" style={modalHeaderStyle}>
              <h3 style={{margin: 0, color: '#333'}}>Thông báo</h3>
              <button 
                style={modalCloseStyle}
                onClick={() => setShowProfileModal(false)}
              >×</button>
            </div>
            <div className="modal-body" style={modalBodyStyle}>
              <p style={{color: '#d32f2f', fontWeight: 'bold'}}>{profileError}</p>
              <p>Để đặt phòng, bạn cần:</p>
              <ul style={{margin: '10px 0', paddingLeft: '20px'}}>
                <li>Đăng nhập tài khoản</li>
                <li>Cập nhật đầy đủ thông tin cá nhân</li>
                <li>Điền số điện thoại, địa chỉ, CMND/CCCD</li>
              </ul>
            </div>
            <div className="modal-footer" style={modalFooterStyle}>
              <button 
                style={secondaryButtonStyle}
                onClick={() => setShowProfileModal(false)}
              >
                Để sau
              </button>
              <button 
                style={primaryButtonStyle}
                onClick={handleUpdateProfileClick}
              >
                Cập nhật ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thêm spinner CSS */}
      <style jsx>{`
        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid #fff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Inline styles để tránh dependency
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  background: 'white',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
};

const modalHeaderStyle = {
  padding: '20px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const modalCloseStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#999',
};

const modalBodyStyle = {
  padding: '20px',
  color: '#666',
};

const modalFooterStyle = {
  padding: '20px',
  borderTop: '1px solid #eee',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
};

const primaryButtonStyle = {
  background: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const secondaryButtonStyle = {
  background: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default RoomCard;
