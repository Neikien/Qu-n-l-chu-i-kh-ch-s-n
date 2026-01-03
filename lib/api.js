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
  // 1. Xử lý username: Backend so sánh với cột 'username', nên ta phải cắt email
  const username = emailOrUsername.includes("@")
    ? emailOrUsername.split("@")[0]
    : emailOrUsername;

  // 2. Chuẩn bị Form Data cho OAuth2PasswordRequestForm
  const formData = new URLSearchParams();
  formData.append("username", username); // Key BẮT BUỘC là 'username'
  formData.append("password", password);
  formData.append("grant_type", "password"); // FastAPI yêu cầu

  console.log(`📡 Đang gọi API Login: POST ${API_URL}/auth/login`);
  console.log("📦 Dữ liệu gửi đi:", formData.toString());

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // BẮT BUỘC
      Accept: "application/json",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("❌ Lỗi Backend:", errorData);
    throw new Error(errorData.detail || "Sai tên đăng nhập hoặc mật khẩu");
  }

  const data = await response.json();

  // 3. Xử lý sau khi có Token
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);

    // Gọi API lấy thông tin User
    try {
      const userProfile = await getProfile();
      localStorage.setItem("user", JSON.stringify(userProfile));
      return { ...data, user: userProfile };
    } catch (error) {
      console.warn("⚠️ Không lấy được profile, dùng dữ liệu tạm.");
      // Fallback: Tạo user giả để Header không bị lỗi
      const fallbackUser = {
        id: 0,
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

/**
 * ĐÃ SỬA CHÍNH XÁC THEO FILE AUTH.PY:
 * Router define là @router.get('/info') -> URL là /auth/info
 */
export async function getProfile() {
  const response = await fetch(`${API_URL}/auth/info`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Lỗi lấy profile: ${response.status}`);
  }

  return response.json();
}

export async function getCustomerProfile() {
  // File customer.py của bạn KHÔNG có endpoint lấy profile theo token
  // Trả về null để tránh lỗi 404
  return null;
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

// Object tổng hợp để dùng trong các component
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
