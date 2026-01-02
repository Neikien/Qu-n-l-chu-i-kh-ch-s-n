// src/config/api.js
const API_CONFIG = {
  BASE_URL: "https://khachsan-backend-production-9810.up.railway.app",
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      PROFILE: "/auth/profile"
    },
    HOTELS: "/hotels",
    ROOMS: "/rooms",
    BOOKINGS: "/bookings"
  }
};

export default API_CONFIG;
