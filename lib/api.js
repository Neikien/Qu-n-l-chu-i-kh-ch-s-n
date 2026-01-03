const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khachsan-backend-production-9810.up.railway.app";

// Helper lấy Header có Token
// Cập nhật: Cho phép truyền token trực tiếp vào để tránh độ trễ của LocalStorage
const getAuthHeaders = (tokenOverride = null) => {
  if (typeof window === "undefined") return {};

  // Ưu tiên lấy token được truyền vào, nếu không có mới tìm trong localStorage
  const token = tokenOverride || localStorage.getItem("access_token") || "";

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

// ======= AUTHENTICATION APIs =======

export async function login(emailOrUsername, password) {
  const username = emailOrUsername.includes("@")
    ? emailOrUsername.split("@")[0]
    : emailOrUsername;

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password");

  console.log(`📡 Đang gọi API Login...`);

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
    // 1. Lưu token vào Storage (để dùng cho lần sau F5)
    localStorage.setItem("access_token", data.access_token);

    // 2. Gọi lấy thông tin User
    // QUAN TRỌNG: Truyền thẳng access_token vào hàm getProfile
    // để đảm bảo header có token ngay lập tức (Khắc phục lỗi 401)
    try {
      const userProfile = await getProfile(data.access_token);

      console.log("✅ Lấy thông tin User thành công:", userProfile);
      localStorage.setItem("user", JSON.stringify(userProfile));

      return { ...data, user: userProfile };
    } catch (error) {
      console.error("❌ Lỗi 401/404 khi lấy profile:", error);

      // Chỉ khi thực sự không lấy được mới dùng tạm username
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
 * Cập nhật: Nhận tham số token tùy chọn
 */
export async function getProfile(token = null) {
  // Truyền token vào getAuthHeaders
  const headers = getAuthHeaders(token);

  // Debug xem token có được gửi đi không
  // console.log("Gửi request /auth/info với header:", headers);

  const response = await fetch(`${API_URL}/auth/info`, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    // Ném lỗi để login catch được
    throw new Error(`Lỗi lấy profile: ${response.status}`);
  }

  return response.json();
}

export async function getCustomerProfile() {
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
