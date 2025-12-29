const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function login(username, password) {
  try {
    // Tạo form data cho OAuth2
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();

    // Lưu token
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function register(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Tạo authAPI object để tương thích với code cũ
export const authAPI = {
  login: (credentials) => login(credentials.username || credentials.email, credentials.password),
  register,
};

// Export riêng các hàm
export { login, register };
// Thêm vào lib/api.js
export async function getRooms(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/rooms?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch rooms');
    return response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
}

export async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}
export async function getHotels(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_URL}/hotels?${queryParams}` : `${API_URL}/hotels`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch hotels');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
}

// Tạo bookingAPI object để import dễ dàng
export const bookingAPI = {
  getRooms,
  createBooking,
  getHotels
};

// Export lại tất cả functions để có thể import riêng lẻ
export { getRooms, createBooking, getHotels };
