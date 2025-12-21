import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Auth API
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/signup', userData),
  getProfile: () => API.get('/auth/me'),
};

// Hotel API
export const hotelAPI = {
  getHotels: () => API.get('/hotels'),
  getHotelById: (id) => API.get(`/hotels/${id}`),
};

// Booking API
export const bookingAPI = {
  createBooking: (data) => API.post('/bookings', data),
  getBookings: () => API.get('/bookings'),
};