"use client";
import React, { useState, useEffect } from 'react';
import RoomCard from './RoomCard';
import RoomDetailModal from './RoomDetailModal';
import { getRooms, getRoomsByHotel, searchRooms } from '@/lib/api'; // Import API
import { apiService } from '../services/apiService';
const EXCHANGE_RATE = 26385;

// Tiện nghi khách sạn (cố định)
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

// Mock rates cho từng loại phòng
const getRoomRates = (roomType) => {
  const ratesMap = {
    'Phòng Đơn': [
      {
        title: 'Mức giá tốt nhất',
        features: ['Không hoàn tiền', 'Trả trước'],
        price: 143,
        tax: 7.13,
      },
      {
        title: 'Mức giá tốt nhất bao gồm bữa sáng',
        features: ['Không hoàn tiền', 'Trả trước', 'Bao gồm ăn sáng'],
        price: 165,
        tax: 8.25,
      }
    ],
    'Phòng Đôi': [
      {
        title: 'Mức giá tốt nhất',
        features: ['Không hoàn tiền', 'Trả trước'],
        price: 180,
        tax: 9.00,
      },
      {
        title: 'Mức giá tốt nhất bao gồm bữa sáng',
        features: ['Không hoàn tiền', 'Trả trước', 'Bao gồm ăn sáng'],
        price: 210,
        tax: 10.50,
      }
    ],
    'Phòng VIP': [
      {
        title: 'Mức giá tốt nhất',
        features: ['Không hoàn tiền', 'Trả trước'],
        price: 300,
        tax: 15.00,
      },
      {
        title: 'Mức giá tốt nhất bao gồm bữa sáng',
        features: ['Không hoàn tiền', 'Trả trước', 'Bao gồm ăn sáng'],
        price: 350,
        tax: 17.50,
      }
    ]
  };
  
  return ratesMap[roomType] || ratesMap['Phòng Đơn'];
};

// Chuyển đổi dữ liệu backend sang format frontend
const transformBackendRoom = (room, hotelInfo) => {
  // Lấy giá từ backend (chuỗi "1800000.00")
  const backendPrice = parseFloat(room.GiaPhong || '0');
  
  // Tính USD (giả sử 1 USD = 23,000 VND)
  const priceUSD = Math.round(backendPrice / 23000);
  const taxUSD = Math.round(priceUSD * 0.05); // Thuế 5%
  
  // Tính số phòng còn lại dựa trên tình trạng
  const remaining = room.TinhTrang === 'Trống' ? Math.floor(Math.random() * 5) + 1 : 0;
  
  // Tạo hình ảnh dựa trên loại phòng
  const imageMap = {
    'Phòng Đơn': 'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797058-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'Phòng Đôi': 'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830776194-4x3?wid=1280&fit=constrain&resmode=bisharp',
    'Phòng VIP': 'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830959431-4x3?wid=1280&fit=constrain&resmode=bisharp'
  };
  
  return {
    // Dữ liệu từ backend
    MaPhong: room.MaPhong,
    MaKS: room.MaKS,
    LoaiPhong: room.LoaiPhong,
    TinhTrang: room.TinhTrang,
    GiaPhong: room.GiaPhong, // Giữ nguyên cho API booking
    
    // Dữ liệu cho frontend
    name: `${room.LoaiPhong} - ${hotelInfo?.hotelName || 'InterContinental'}`,
    area: room.LoaiPhong === 'Phòng VIP' ? 138 : 
          room.LoaiPhong === 'Phòng Đôi' ? 56 : 46,
    price: priceUSD,
    tax: taxUSD,
    remaining: remaining,
    imageSrc: imageMap[room.LoaiPhong] || imageMap['Phòng Đơn'],
    detailImages: [
      imageMap[room.LoaiPhong] || imageMap['Phòng Đơn'],
      'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-5386797412-4x3?wid=1280&fit=constrain&resmode=bisharp',
      'https://digital.ihg.com/is/image/ihg/intercontinental-hanoi-8830980397-4x3?wid=800&fit=constrain&resmode=bisharp'
    ],
    rates: getRoomRates(room.LoaiPhong),
    
    // Thông tin khách sạn từ props
    hotelName: hotelInfo?.hotelName,
    hotelAddress: hotelInfo?.hotelAddress,
    hotelStars: hotelInfo?.hotelStars,
    hotelDescription: hotelInfo?.hotelDescription,
    hotelArea: hotelInfo?.hotelArea
  };
};

const RoomListing = ({ 
  rooms = [], 
  onBookRoom, 
  searchParams, 
  hotelInfo,
  hotelId, // Thêm prop hotelId để tự động fetch phòng
  autoFetch = true // Tự động fetch phòng khi có hotelId
}) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [transformedRooms, setTransformedRooms] = useState([]);
  const [loading, setLoading] = useState(autoFetch && hotelId ? true : false);
  const [error, setError] = useState(null);

  // CALLBACK API: Tự động fetch phòng khi có hotelId
  useEffect(() => {
    const fetchRoomsFromAPI = async () => {
      if (!autoFetch || !hotelId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`📡 Fetching rooms for hotel ID: ${hotelId}`);
        
        // Gọi API lấy phòng theo hotelId
        const roomsData = await getRoomsByHotel(hotelId);
        console.log(`✅ Fetched ${roomsData.length} rooms from API`);
        
        // Transform dữ liệu
        const transformed = roomsData.map(room => transformBackendRoom(room, hotelInfo));
        setTransformedRooms(transformed);
        
      } catch (error) {
        console.error('❌ Error fetching rooms:', error);
        setError(error.message);
        
        // Fallback: dùng rooms từ props nếu có
        if (rooms.length > 0) {
          const transformed = rooms.map(room => transformBackendRoom(room, hotelInfo));
          setTransformedRooms(transformed);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsFromAPI();
  }, [hotelId, autoFetch, hotelInfo, rooms]);

  // Transform backend data khi rooms props thay đổi (nếu không autoFetch)
  useEffect(() => {
    if (!autoFetch && rooms && rooms.length > 0) {
      console.log('🔧 Transforming rooms from props:', rooms);
      const transformed = rooms.map(room => transformBackendRoom(room, hotelInfo));
      setTransformedRooms(transformed);
      console.log('✅ Transformed rooms:', transformed);
    }
  }, [rooms, hotelInfo, autoFetch]);

  // Hiển thị thông tin khách sạn nếu có
  const showHotelInfo = hotelInfo && hotelInfo.hotelName;

  // Hàm reload rooms (callback từ parent)
  const handleReloadRooms = async () => {
    if (hotelId) {
      setLoading(true);
      try {
        const roomsData = await getRoomsByHotel(hotelId);
        const transformed = roomsData.map(room => transformBackendRoom(room, hotelInfo));
        setTransformedRooms(transformed);
      } catch (error) {
        console.error('Error reloading rooms:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="hotel-page-container">
      {/* --- Header Khách Sạn (lấy từ backend) --- */}
      {showHotelInfo ? (
        <>
          <div className="hotel-header">
            <h1 className="hotel-name">{hotelInfo.hotelName}</h1>
            <div className="hotel-actions">
              <button 
                onClick={handleReloadRooms}
                className="reload-btn"
                disabled={loading}
              >
                {loading ? '🔄 Đang tải...' : '🔄 Tải lại phòng'}
              </button>
              <select 
                className="currency-select"
                onChange={(e) => setCurrency(e.target.value)}
                value={currency}
                disabled={loading}
              >
                <option value="USD">USD</option>
                <option value="VND">VND</option>
              </select>
            </div>
          </div>
          
          <p className="hotel-address">
            📍 {hotelInfo.hotelAddress}
            {hotelInfo.hotelArea && <span> • Khu vực: {hotelInfo.hotelArea}</span>}
          </p>
          
          <div className="hotel-rating">
            <span className="rating-stars">
              {'★'.repeat(hotelInfo.hotelStars || 5)}
            </span>
            <span className="rating-score">{(hotelInfo.hotelStars || 5).toFixed(1)}</span>
            <a href="#" className="review-count">Xem đánh giá</a>
          </div>
          
          {hotelInfo.hotelDescription && (
            <p className="hotel-description">{hotelInfo.hotelDescription}</p>
          )}
        </>
      ) : (
        <>
          <h1 className="hotel-name">InterContinental Hanoi Landmark72</h1>
          <p className="hotel-address">
            Keangnam Hanoi Landmark Tower, Cau Giay, Hanoi Vietnam
          </p>
        </>
      )}

      {/* --- Thông tin Tóm tắt (Đánh giá & Tiện nghi) --- */}
      <div className="summary-info">
        <div className="rating-block">
          <span className="rating-score">4,7</span>
          <a href="#" className="review-count">781 đánh giá</a>
        </div>

        <div className="amenities-grid-container">
          {amenitiesData.map((item, index) => (
            <div key={index} className="amenity-item">
              <i className={`fa ${item.icon} amenity-icon`}></i>
              <span className="amenity-text">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="additional-info-container">
          <a href="#" className="additional-info-link">Thông tin bổ sung</a>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* --- Phần Chọn Phòng --- */}
      <h2 className="room-selection-heading">Chọn phòng của bạn</h2>
      
      <p className="found-rooms">
        {loading ? (
          '🔄 Đang tải danh sách phòng từ server...'
        ) : transformedRooms.length > 0 ? (
          `🏨 Đã tìm thấy ${transformedRooms.length} phòng tại ${hotelInfo?.hotelName || 'khách sạn'}`
        ) : (
          "🔍 Chưa có dữ liệu phòng. Vui lòng chọn khách sạn và nhấn TÌM KIẾM."
        )}
      </p>

      <div className="rooms-container">
        {loading ? (
          <div className="loading-rooms">
            <div className="spinner"></div>
            <p>Đang tải danh sách phòng từ API...</p>
          </div>
        ) : transformedRooms.length > 0 ? (
          transformedRooms.map((room, index) => {
            let displayedPrice = room.price;
            let displayedTax = room.tax;

            if (currency === 'VND') {
              displayedPrice = room.price * EXCHANGE_RATE;
              displayedTax = room.tax * EXCHANGE_RATE;
            }

            return (
              <RoomCard
                key={room.MaPhong || index}
                room={{
                  ...room,
                  price: displayedPrice,
                  tax: displayedTax,
                  originalPrice: room.price, // Giữ giá gốc USD
                }}
                currentCurrency={currency}
                onOpenDetail={() => setSelectedRoom(room)}
                onBookRoom={() => onBookRoom && onBookRoom(room)}
                searchParams={searchParams}
              />
            );
          })
        ) : (
          <div className="no-rooms">
            <p>Không có phòng nào phù hợp với yêu cầu của bạn. Vui lòng thử lại với ngày khác.</p>
            {hotelId && (
              <button 
                onClick={handleReloadRooms}
                className="retry-btn"
              >
                🔄 Thử lại
              </button>
            )}
          </div>
        )}
      </div>

      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          currentCurrency={currency}
          exchangeRate={EXCHANGE_RATE}
          onBookNow={() => {
            if (onBookRoom) {
              onBookRoom(selectedRoom);
              setSelectedRoom(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default RoomListing;

// Export biến initialMockRooms cho trường hợp backup
export const initialMockRooms = [];
