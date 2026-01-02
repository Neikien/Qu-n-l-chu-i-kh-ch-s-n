"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import HotelGallery from '@/components/HotelGallery';
import CustomDatePicker from '@/components/CustomDatePicker';
import RoomListing, { initialMockRooms } from '@/components/RoomListing';

// Danh sách khách sạn theo khu vực
const HOTEL_OPTIONS = [
  { id: 1, name: 'Hà Nội', value: 'Hà Nội' },
  { id: 2, name: 'Đà Nẵng', value: 'Đà Nẵng' },
  { id: 3, name: 'Nha Trang', value: 'Nha Trang' },
  { id: 4, name: 'Đà Lạt', value: 'Đà Lạt' },
  { id: 5, name: 'TP.HCM', value: 'TP.HCM' }
];

// Mapping khách sạn thực tế từ backend
const HOTEL_MAPPING = {
  'Hà Nội': 'Melmaybe Hà Nội',
  'Đà Nẵng': 'Melmaybe Đà Nẵng',
  'Nha Trang': 'Melmaybe Nha Trang',
  'Đà Lạt': 'Melmaybe Đà Lạt',
  'TP.HCM': 'Melmaybe TP.HCM'
};

// --- COMPONENT HEADER ---
const Header = ({ onSearchUpdate, searchParams, onSearchParamsChange }) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  const [destination, setDestination] = useState('Hà Nội');
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [rooms, setRooms] = useState(searchParams?.rooms || 1);
  const [guests, setGuests] = useState(searchParams?.guests || 2);
  const [checkInDate, setCheckInDate] = useState(
    searchParams?.checkInDate || format(today, 'dd/MM/yyyy')
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams?.checkOutDate || format(tomorrow, 'dd/MM/yyyy')
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (inDate, outDate) => {
    setCheckInDate(inDate);
    setCheckOutDate(outDate);
    onSearchParamsChange({
      checkInDate: formatDateToAPI(inDate),
      checkOutDate: formatDateToAPI(outDate),
      rooms,
      guests
    });
  };

  const formatDateToAPI = (dateStr) => {
    if (!dateStr) return format(new Date(), 'yyyy-MM-dd');
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 Tìm kiếm ở khu vực:', destination);
      
      // 1. Lấy tất cả khách sạn từ backend
      const response = await fetch('http://localhost:8000/hotels/');
      if (!response.ok) throw new Error('Không thể lấy danh sách khách sạn');
      
      const hotels = await response.json();
      console.log('📋 Tất cả khách sạn:', hotels);
      
      // 2. Tìm khách sạn theo khu vực
      const destinationLower = destination.toLowerCase();
      const selectedHotel = hotels.find(h => 
        h.TenKS.toLowerCase().includes(destinationLower) ||
        h.DiaChi.toLowerCase().includes(destinationLower) ||
        (HOTEL_MAPPING[destination] && h.TenKS.includes(HOTEL_MAPPING[destination]))
      );
      
      if (!selectedHotel) {
        alert(`❌ Không tìm thấy khách sạn ở ${destination}`);
        setLoading(false);
        return;
      }
      
      console.log('🏨 Khách sạn tìm thấy:', selectedHotel);
      
      // 3. Lấy phòng theo MaKS
      const roomsResponse = await fetch(
        `http://localhost:8000/rooms/?hotel_id=${selectedHotel.MaKS}`
      );
      
      if (!roomsResponse.ok) {
        throw new Error(`Lỗi API: ${roomsResponse.status}`);
      }
      
      const roomsData = await roomsResponse.json();
      
      console.log(`📦 ${roomsData.length} phòng của ${selectedHotel.TenKS}:`, roomsData);
      
      // 4. Tạo hotelInfo object
      const hotelInfo = {
        hotelName: selectedHotel.TenKS,
        hotelAddress: selectedHotel.DiaChi,
        hotelStars: selectedHotel.SoSao,
        hotelDescription: selectedHotel.MoTa,
        hotelArea: destination
      };
      
      // 5. Gọi callback với đầy đủ tham số
      if (onSearchUpdate) {
        onSearchUpdate(roomsData, hotelInfo, selectedHotel.MaKS);
      }
      
      // 6. Alert thành công
      alert(`✅ Đã tìm thấy ${roomsData.length} phòng tại ${selectedHotel.TenKS}`);
      
    } catch (error) {
      console.error("❌ Lỗi khi tìm kiếm:", error);
      alert(`Lỗi: ${error.message}`);
      
      // Fallback: dùng mock data
      if (onSearchUpdate) {
        onSearchUpdate(initialMockRooms, null, null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onSearchParamsChange({
      checkInDate: formatDateToAPI(checkInDate),
      checkOutDate: formatDateToAPI(checkOutDate),
      rooms,
      guests
    });
  }, [rooms, guests]);

  return (
    <header className="uhf_headerFooter booking-search-bar">
      <div className="main-nav-bar">
        <div className="search-widget-container">
          <div className="search-form-bar">
            <div className="search-field field-location">
              <span className="field-label">NƠI GỌI ĐẾN</span>
              <select 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="location-select"
                disabled={loading}
              >
                {HOTEL_OPTIONS.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="search-field field-date"
              onClick={() => !loading && setShowCalendar(!showCalendar)}
            >
              <span className="field-label">1 ĐÊM</span>
              <div className="date-range-display">
                {checkInDate} → {checkOutDate}
              </div>
              {showCalendar && (
                <CustomDatePicker
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  onDateChange={handleDateChange}
                />
              )}
            </div>

            <div
              className="search-field field-guests"
              onClick={() => !loading && setShowGuestPopup(!showGuestPopup)}
            >
              <span className="field-label">PHÒNG & KHÁCH</span>
              <div className="guest-select">
                {rooms} phòng, {guests} khách ▼
              </div>
              {showGuestPopup && (
                <div className="guest-popup">
                  <div className="guest-option">
                    <span>Phòng:</span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setRooms(r => r > 1 ? r - 1 : 1);
                      }}
                      disabled={loading}
                    >-</button>
                    <span>{rooms}</span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setRooms(r => r + 1);
                      }}
                      disabled={loading}
                    >+</button>
                  </div>
                  <div className="guest-option">
                    <span>Khách:</span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setGuests(g => g > 1 ? g - 1 : 1);
                      }}
                      disabled={loading}
                    >-</button>
                    <span>{guests}</span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setGuests(g => g + 1);
                      }}
                      disabled={loading}
                    >+</button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="btn-tim-kiem-v2" 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'ĐANG TÌM...' : 'TÌM KIẾM'}
            </button>
          </div>

          <div className="breadcrumb-nav">
            <a href="#">Trang chủ</a> &gt; <a href="#">Chọn một khách sạn</a> &gt; Chọn phòng
          </div>
        </div>
      </div>
    </header>
  );
};

export default function BookingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [roomsData, setRoomsData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    checkInDate: format(new Date(), 'yyyy-MM-dd'),
    checkOutDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
    rooms: 1,
    guests: 2
  });
  
  const [selectedHotelInfo, setSelectedHotelInfo] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  const updateRooms = (roomsData, hotelInfo, hotelId) => {
    console.log('📥 Nhận dữ liệu từ Header:', {
      rooms: roomsData?.length,
      hotelInfo,
      hotelId
    });
    
    setRoomsData(roomsData || []);
    
    if (hotelInfo) {
      setSelectedHotelInfo(hotelInfo);
    }
    
    if (hotelId) {
      setSelectedHotelId(hotelId);
    }
    
    console.log('✅ Đã cập nhật state:', {
      roomsDataLength: roomsData?.length,
      hotelInfo,
      hotelId
    });
  };

  const handleBookRoom = async (room) => {
    console.log('Đặt phòng:', room);
    
    if (!user || !user.token) {
      alert('Vui lòng đăng nhập để đặt phòng!');
      router.push('/login');
      return;
    }
    
    const profile = localStorage.getItem('userProfile');
    if (!profile) {
      alert('Vui lòng hoàn thiện thông tin cá nhân trong trang Profile!');
      router.push('/profile');
      return;
    }
    
    const customerProfile = JSON.parse(profile);
    if (!customerProfile.MaKH) {
      alert('Vui lòng lưu thông tin cá nhân để có mã khách hàng!');
      router.push('/profile');
      return;
    }
    
    const bookingData = {
      MaKH: customerProfile.MaKH,
      MaPhong: room.MaPhong,
      NgayNhanPhong: searchParams.checkInDate,
      NgayTraPhong: searchParams.checkOutDate
    };
    
    console.log('Gửi booking data:', bookingData);
    
    try {
      const response = await fetch('http://localhost:8000/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const bookingResult = await response.json();
      console.log('Booking thành công:', bookingResult);
      
      alert(`✅ Đặt phòng thành công!\nMã booking: ${bookingResult.MaDatPhong}`);
      
      router.push(`/booking/confirmation/${bookingResult.MaDatPhong}`);
      
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error);
      alert(`❌ Lỗi đặt phòng: ${error.message}`);
    }
  };

  const handleSearchParamsChange = (params) => {
    setSearchParams(params);
  };

  return (
    <div className="booking-page-container">
      <div className="booking-hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content text-center">
          <p className="text-white uppercase tracking-[0.2em] text-sm mb-4 font-medium">
            Discover Your Next Stay
          </p>
          <h1 className="text-white font-serif text-6xl md:text-7xl font-normal tracking-wide">
            Book Your Getaway
          </h1>
        </div>
      </div>

      <div className="search-bar-container relative z-20 -mt-16 px-4 sm:px-8 lg:px-16">
        <Header 
          onSearchUpdate={updateRooms}
          searchParams={searchParams}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>

      <main className="main-content max-w-[1320px] mx-auto px-5 py-12">
        <div className="breadcrumb-nav mb-8 text-sm text-gray-500">
          <a href="#">Trang chủ</a> &gt; <span>Đặt phòng</span>
        </div>
        
        <RoomListing 
          rooms={roomsData} 
          onBookRoom={handleBookRoom}
          searchParams={searchParams}
          hotelInfo={selectedHotelInfo}
          hotelId={selectedHotelId}
          autoFetch={false}
        />
      </main>

      <footer className="footer bg-gray-100 py-8 text-center">
        <p>Hải Đăng Luxury Hotel - Managed by InterContinental</p>
      </footer>
    </div>
  );
}
