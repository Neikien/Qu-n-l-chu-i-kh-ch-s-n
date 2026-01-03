const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khachsan-backend-production-9810.up.railway.app";

// Helper để lấy Header có Token
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

// ======= AUTHENTICATION APIs =======

/**
 * Hàm Đăng nhập:
 * Tự động xử lý nếu user nhập email thì cắt lấy username trước dấu @
 */
export async function login(emailOrUsername, password) {
  // Xử lý username: Cắt bỏ phần @gmail.com nếu có
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
    throw new Error("Sai tên đăng nhập hoặc mật khẩu");
  }

  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);

    // Sau khi có token, lấy ngay thông tin profile để cập nhật Context
    try {
      const userProfile = await getProfile();
      localStorage.setItem("user", JSON.stringify(userProfile));

      // Thử lấy thêm MaKH nếu đã có profile khách hàng
      try {
        const customerProfile = await getCustomerProfile();
        if (customerProfile) {
          const fullProfile = { ...userProfile, ...customerProfile };
          localStorage.setItem("userProfile", JSON.stringify(fullProfile));
        }
      } catch (e) {
        console.log("Người dùng chưa tạo hồ sơ khách hàng.");
      }

      return { ...data, user: userProfile };
    } catch (error) {
      console.error("Lỗi đồng bộ profile:", error);
      return data;
    }
  }

  return data;
}

export async function register(userData) {
  const email = userData.email.trim();
  const username = email.split("@")[0]; // Đồng bộ cách lấy username

  const backendData = {
    username: username,
    email: email,
    password: userData.password,
    fullname: userData.fullname,
  };

  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(backendData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Đăng ký thất bại: " + errorText);
  }

  return response.json();
}

// ======= PROFILE & CUSTOMER APIs =======

export async function getProfile() {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Không thể lấy thông tin profile");
  return response.json();
}

export async function getCustomerProfile() {
  const response = await fetch(`${API_URL}/customers/my-profile`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Không thể lấy thông tin khách hàng");
  }
  return response.json();
}

export async function saveCustomerProfile(customerData) {
  const response = await fetch(`${API_URL}/customers/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Lưu thông tin thất bại: " + errorText);
  }

  const result = await response.json();
  if (result.MaKH) {
    const oldProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    localStorage.setItem(
      "userProfile",
      JSON.stringify({ ...oldProfile, ...customerData, MaKH: result.MaKH })
    );
  }
  return result;
}

// ======= HOTEL & ROOM APIs =======

export async function getHotels(skip = 0, limit = 100) {
  const response = await fetch(
    `${API_URL}/hotels/?skip=${skip}&limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch hotels");
  return response.json();
}

export const getHotelById = async (hotelId) => {
  const response = await fetch(`${API_URL}/hotels/${hotelId}`);
  if (!response.ok) throw new Error("Failed to fetch hotel");
  return response.json();
};

export async function getRooms(skip = 0, limit = 100) {
  const response = await fetch(`${API_URL}/rooms/?skip=${skip}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch rooms");
  return response.json();
}

export const getRoomsByHotel = async (hotelId) => {
  const response = await fetch(`${API_URL}/rooms/?hotel_id=${hotelId}`);
  if (!response.ok)
    throw new Error(`Failed to fetch rooms for hotel ${hotelId}`);
  return response.json();
};

export const getRoomById = async (roomId) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}`);
  if (!response.ok) throw new Error("Failed to fetch room");
  return response.json();
};

export const searchRooms = async (params = {}) => {
  const { hotelName, hotelId, skip = 0, limit = 100 } = params;
  let url = `${API_URL}/rooms/?`;
  const queryParams = new URLSearchParams();
  if (hotelName) queryParams.append("hotel_name", hotelName);
  if (hotelId) queryParams.append("hotel_id", hotelId);
  queryParams.append("skip", skip);
  queryParams.append("limit", limit);

  const response = await fetch(url + queryParams.toString());
  if (!response.ok) throw new Error("Failed to search rooms");
  return response.json();
};

// ======= BOOKING APIs =======

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

export const getBookings = async (skip = 0, limit = 100) => {
  const response = await fetch(
    `${API_URL}/bookings/?skip=${skip}&limit=${limit}`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

// ======= EXPORT AGGREGATOR =======

export const apiService = {
  login,
  register,
  getProfile,
  getCustomerProfile,
  saveCustomerProfile,
  getHotels,
  getHotelById,
  getRooms,
  getRoomsByHotel,
  getRoomById,
  searchRooms,
  createBooking,
  getBookings,
};
