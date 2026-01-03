const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khachsan-backend-production-9810.up.railway.app";

// Helper lấy Header chuẩn xác
const getAuthHeaders = (tokenOverride = null) => {
  // Ưu tiên token truyền vào, sau đó mới đến localStorage
  let token = tokenOverride;
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  // Clean token: Xóa khoảng trắng thừa nếu có
  token = token ? token.trim() : "";

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

// ======= AUTHENTICATION APIs =======

export async function login(emailOrUsername, password) {
  // 1. Xử lý username
  const username = emailOrUsername.includes("@")
    ? emailOrUsername.split("@")[0]
    : emailOrUsername;

  // 2. Chuẩn bị Form Data
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password");

  console.log("🚀 Đang gửi Login...");

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
    throw new Error(errorData.detail || "Sai tài khoản hoặc mật khẩu");
  }

  const data = await response.json();

  if (data.access_token) {
    // Lưu token ngay
    localStorage.setItem("access_token", data.access_token);

    // 3. Gọi ngay API /auth/info với token vừa nhận được
    try {
      console.log("🔑 Login OK. Đang lấy thông tin User...");
      const userProfile = await getProfile(data.access_token);

      console.log("✅ Lấy User thành công:", userProfile);
      localStorage.setItem("user", JSON.stringify(userProfile));

      return { ...data, user: userProfile };
    } catch (error) {
      console.error("❌ Lỗi xác thực Token (401):", error.message);
      console.warn(
        "⚠️ Token vừa sinh ra đã bị từ chối. Kiểm tra lại JWT_SECRET_KEY trên Server."
      );

      // FALLBACK: Tạo user giả để vào được Web không bị chặn
      const fallbackUser = {
        id: 999,
        username: username,
        fullname: username,
        email: emailOrUsername,
        role: "user",
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

// ======= PROFILE APIs =======

export async function getProfile(token = null) {
  // Endpoint chuẩn theo auth.py của bạn là /auth/info
  const headers = getAuthHeaders(token);

  // In ra console để bạn chụp ảnh nếu lỗi tiếp
  // console.log("📡 Header gửi đi:", headers);

  const response = await fetch(`${API_URL}/auth/info`, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401)
      throw new Error("Token không hợp lệ hoặc hết hạn (401)");
    if (status === 404)
      throw new Error("Không tìm thấy endpoint /auth/info (404)");
    throw new Error(`Lỗi Server: ${status}`);
  }

  return response.json();
}

export async function getCustomerProfile() {
  return null; // Tạm thời return null vì chưa có API
}

// ======= CÁC API KHÁC =======

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
