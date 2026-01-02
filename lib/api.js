const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://khachsan-backend-production-9810.up.railway.app';

// ======= AUTHENTICATION APIs =======
export async function login(username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('grant_type', 'password');
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: formData.toString(),
  });
  
  if (!response.ok) {
    throw new Error('Sai tên đăng nhập hoặc mật khẩu');
  }
  
  const data = await response.json();
  
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }
  
  return data;
}

export async function register(userData) {
  const email = userData.email.trim();
  const username = email.split('@')[0];
  
  const backendData = {
    username: username,
    email: email,
    password: userData.password,
    fullname: userData.fullname
  };
  
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(backendData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Đăng ký thất bại: ' + errorText);
  }
  
  return response.json();
}

// ======= PROFILE & CUSTOMER APIs =======
export async function getProfile() {
  const token = localStorage.getItem('access_token') || '';
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Không thể lấy thông tin profile');
  }
  
  return response.json();
}

export async function getCustomerProfile() {
  const token = localStorage.getItem('access_token') || '';
  const response = await fetch(`${API_URL}/customers/my-profile`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Không thể lấy thông tin khách hàng');
  }
  
  return response.json();
}

// FIXED: Hàm saveCustomerProfile - Lưu MaKH vào localStorage
export async function saveCustomerProfile(customerData) {
  const token = localStorage.getItem('access_token') || '';
  const response = await fetch(`${API_URL}/customers/`, {  // Sửa endpoint: /customers/ thay vì /customers/my-profile
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(customerData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Lưu thông tin thất bại: ' + errorText);
  }
  
  const result = await response.json();
  console.log('✅ API trả về:', result);
  
  // QUAN TRỌNG: Lưu MaKH vào localStorage
  if (result.MaKH) {
    const oldProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const newProfile = {
      ...oldProfile,
      ...customerData,
      MaKH: result.MaKH
    };
    
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    console.log('✅ Đã lưu profile với MaKH:', newProfile);
  } else {
    console.warn('⚠️ API không trả về MaKH:', result);
  }
  
  return result;
}

// Create customer (legacy - giữ lại cho tương thích)
export async function createCustomer(customerData) {
  return saveCustomerProfile(customerData); // Gọi hàm đã sửa
}

// Get customer by ID
export const getCustomerById = async (customerId, token) => {
  const response = await fetch(`${API_URL}/customers/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${token || localStorage.getItem('access_token') || ''}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch customer');
  }
  
  return response.json();
};

// ======= HOTEL APIs =======
export async function getHotels(skip = 0, limit = 100) {
  const response = await fetch(`${API_URL}/hotels/?skip=${skip}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch hotels');
  return response.json();
}

export const getHotelById = async (hotelId) => {
  const response = await fetch(`${API_URL}/hotels/${hotelId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch hotel');
  }
  
  return response.json();
};

// Search hotels by name/area
export const searchHotels = async (query = '') => {
  const hotels = await getHotels();
  
  if (query) {
    const queryLower = query.toLowerCase();
    return hotels.filter(hotel => 
      hotel.TenKS.toLowerCase().includes(queryLower) ||
      hotel.DiaChi.toLowerCase().includes(queryLower)
    );
  }
  
  return hotels;
};

// ======= ROOM APIs =======
export async function getRooms(skip = 0, limit = 100) {
  const response = await fetch(`${API_URL}/rooms/?skip=${skip}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch rooms');
  return response.json();
}

export const getRoomById = async (roomId) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch room');
  }
  
  return response.json();
};

// Get rooms by hotel ID
export const getRoomsByHotel = async (hotelId) => {
  const response = await fetch(`${API_URL}/rooms/?hotel_id=${hotelId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch rooms for hotel ${hotelId}`);
  }
  
  return response.json();
};

// Search rooms
export const searchRooms = async (params = {}) => {
  const { hotelName, hotelId, skip = 0, limit = 100 } = params;
  let url = `${API_URL}/rooms/?`;
  
  const queryParams = new URLSearchParams();
  if (hotelName) queryParams.append('hotel_name', hotelName);
  if (hotelId) queryParams.append('hotel_id', hotelId);
  queryParams.append('skip', skip);
  queryParams.append('limit', limit);
  
  url += queryParams.toString();
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to search rooms');
  }
  
  return response.json();
};

// ======= BOOKING APIs =======
export const createBooking = async (bookingData) => {
  const token = localStorage.getItem('access_token') || '';
  const response = await fetch(`${API_URL}/bookings/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create booking');
  }
  
  return response.json();
};

export const getBookings = async (skip = 0, limit = 100) => {
  const token = localStorage.getItem('access_token') || '';
  const response = await fetch(
    `${API_URL}/bookings/?skip=${skip}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  
  return response.json();
};

export const getBookingById = async (bookingId) => {
  const token = localStorage.getItem('access_token') || '';
  const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch booking');
  }
  
  return response.json();
};

export const cancelBooking = async (bookingId) => {
  const token = localStorage.getItem('access_token') || '';
  const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to cancel booking');
  }
  
  return response.json();
};

// ======= UTILITY FUNCTIONS =======
// Hàm kiểm tra và lấy MaKH từ localStorage
export const getCustomerId = () => {
  const profileStr = localStorage.getItem('userProfile');
  if (!profileStr) return null;
  
  try {
    const profile = JSON.parse(profileStr);
    return profile.MaKH || null;
  } catch (error) {
    console.error('Error parsing userProfile:', error);
    return null;
  }
};

// Hàm cập nhật profile trong localStorage
export const updateLocalProfile = (updates) => {
  const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const newProfile = { ...currentProfile, ...updates };
  localStorage.setItem('userProfile', JSON.stringify(newProfile));
  return newProfile;
};

// ======= EXPORT ALL =======
export { 
  login, 
  register, 
  getHotels, 
  getRooms, 
  createCustomer,
  getProfile,
  getCustomerProfile,
  saveCustomerProfile,
  getCustomerId,
  updateLocalProfile

};
