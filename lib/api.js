// lib/api.js - PHIÊN BẢN ĐÃ FIX LỖI THEO BACKEND

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khachsan-backend-production-9810.up.railway.app";

// Helper lấy Header có Token
const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token") || "";
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

// ======= AUTHENTICATION APIs =======

export async function login(emailOrUsername, password) {
  // Logic cắt email lấy username (Đúng ý bạn)
  const username = emailOrUsername.includes("@")
    ? emailOrUsername.split("@")[0]
    : emailOrUsername;

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Sai tên đăng nhập hoặc mật khẩu");
  }

  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);

    // ĐÃ SỬA: Gọi đúng endpoint /auth/info của Backend bạn
    try {
      const userProfile = await getProfile();
      localStorage.setItem("user", JSON.stringify(userProfile));

      // LOGIC MỚI: Vì customer.py không có /my-profile, ta tạm bỏ qua bước này
      // để tránh lỗi 404 làm gián đoạn đăng nhập.
      // Nếu sau này backend thêm endpoint đó, bạn chỉ cần bỏ comment dòng dưới.
      // await getCustomerProfile();

      return { ...data, user: userProfile };
    } catch (error) {
      console.warn("Lấy thông tin user thất bại, dùng dữ liệu tạm.");
      const fallbackUser = {
        username: username,
        fullname: username,
        email: emailOrUsername,
      };
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      return { ...data, user: fallbackUser };
    }
  }

  return data;
}

export async function register(userData) {
  const email = userData.email.trim();
  const username = email.split("@")[0];

  const backendData = {
    username: username,
    email: email,
    password: userData.password,
    fullname: userData.fullname,
  };

  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Đăng ký thất bại");
  }

  return response.json();
}

// ======= PROFILE APIs (ĐÃ SỬA THEO BACKEND) =======

export async function getProfile() {
  // Endpoint đúng theo file auth.py là /info
  const response = await fetch(`${API_URL}/auth/info`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Không thể lấy thông tin từ /auth/info");
  }

  return response.json();
}

export async function getCustomerProfile() {
  // Backend file customer.py KHÔNG CÓ endpoint /my-profile
  // Nên ta tạm thời return null để tránh lỗi 404 đỏ lòm trong console
  console.log("Backend chưa hỗ trợ lấy hồ sơ khách hàng qua Token.");
  return null;
}

// ======= CÁC API KHÁC (GIỮ NGUYÊN) =======

export async function getHotels() {
  const response = await fetch(`${API_URL}/hotels/`);
  return response.json();
}

export async function getRooms() {
  const response = await fetch(`${API_URL}/rooms/`);
  return response.json();
}

export const getRoomsByHotel = async (hotelId) => {
  const response = await fetch(`${API_URL}/rooms/?hotel_id=${hotelId}`);
  return response.json();
};

export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_URL}/bookings/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create booking");
  }
  return response.json();
};

// Export object tổng hợp
export const apiService = {
  login,
  register,
  getProfile,
  getCustomerProfile,
  getHotels,
  getRooms,
  getRoomsByHotel,
  createBooking,
};
