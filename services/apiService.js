// services/apiService.js - THÊM CÁC HÀM SAU
const BASE_URL = "https://khachsan-backend-production-9810.up.railway.app";

// Helper lấy token và headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

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
  },

  // === THÊM CÁC HÀM MỚI ===
  async getProfile() {
    const res = await fetch(`${BASE_URL}/auth/info`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async getCustomers() {
    const res = await fetch(`${BASE_URL}/customers/`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async checkCustomerProfileExists() {
    try {
      const customers = await this.getCustomers();
      const userProfile = await this.getProfile();
      
      // Tìm customer có user_id trùng với user hiện tại
      const customer = customers.find(c => c.user_id === userProfile.id);
      return !!customer; // true nếu có, false nếu không
    } catch (error) {
      console.error("Lỗi kiểm tra profile:", error);
      return false;
    }
  },

  async getCustomerProfile() {
    try {
      const customers = await this.getCustomers();
      const userProfile = await this.getProfile();
      return customers.find(c => c.user_id === userProfile.id);
    } catch (error) {
      console.error("Lỗi lấy customer profile:", error);
      return null;
    }
  }
};
