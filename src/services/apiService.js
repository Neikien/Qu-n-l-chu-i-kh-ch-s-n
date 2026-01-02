// Chỉ 1 file này gọi API
const BASE_URL = "https://khachsan-backend-production-9810.up.railway.app";

export const apiService = {
  async login(username, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    return await res.json();
  },

  async getHotels() {
    const res = await fetch(`${BASE_URL}/hotels`);
    return await res.json();
  },

  async createBooking(data) {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  }
};
