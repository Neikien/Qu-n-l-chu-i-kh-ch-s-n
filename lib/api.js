const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khachsan-backend-production-9810.up.railway.app";

// Helper để lấy Header có Token nhanh
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token") || "";
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

// ======= AUTHENTICATION APIs =======

export async function login(username, password) {
  // 1. Gửi request lấy Token
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password"); // Backend OAuth2 thường yêu cầu cái này

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

  // 2. Lưu Token
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);

    // 3. QUAN TRỌNG: Lấy luôn thông tin user để lưu vào localStorage
    // Giúp UI hiển thị tên ngay mà không cần reload
    try {
      const userProfile = await getProfile(); // Gọi hàm getProfile ở dưới
      localStorage.setItem("user", JSON.stringify(userProfile));

      // Thử lấy thêm thông tin Customer (MaKH) nếu có
      try {
        const customerProfile = await getCustomerProfile();
        if (customerProfile) {
          const fullProfile = { ...userProfile, ...customerProfile };
          localStorage.setItem("userProfile", JSON.stringify(fullProfile));
        }
      } catch (err) {
        console.warn("User này chưa có hồ sơ khách hàng");
      }

      return { ...data, user: userProfile }; // Trả về cả token và user info
    } catch (error) {
      console.error("Lỗi lấy thông tin user sau khi login:", error);
    }
  }

  return data;
}

export async function register(userData) {
  const email = userData.email.trim();
  // Tạo username từ email nếu không có
  const username = userData.username || email.split("@")[0];

  const backendData = {
    username: username,
    email: email,
    password: userData.password,
    fullname: userData.fullname,
    // phone: userData.phone // Bỏ comment nếu backend cần
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
    // Xử lý thông báo lỗi đẹp hơn
    if (errorText.includes("already exists"))
      throw new Error("Email hoặc tên đăng nhập đã tồn tại");
    throw new Error("Đăng ký thất bại: " + errorText);
  }

  return response.json();
}

// ======= PROFILE & CUSTOMER APIs =======

export async function getProfile() {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Không thể lấy thông tin profile");
  }

  return response.json();
}

export async function getCustomerProfile() {
  const response = await fetch(`${API_URL}/customers/my-profile`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) return null; // Chưa có hồ sơ khách hàng
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

  // Lưu MaKH vào localStorage để dùng cho Booking
  if (result.MaKH) {
    const oldProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const newProfile = {
      ...oldProfile,
      ...customerData,
      MaKH: result.MaKH,
    };
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
  }

  return result;
}

export async function createCustomer(customerData) {
  return saveCustomerProfile(customerData);
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
    { headers: getAuthHeaders() }
  );
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

// ======= UTILITY =======

export const getCustomerId = () => {
  const profileStr = localStorage.getItem("userProfile");
  if (!profileStr) return null;
  try {
    const profile = JSON.parse(profileStr);
    return profile.MaKH || null;
  } catch (error) {
    return null;
  }
};

// ======= EXPORT OBJECT CHO TƯƠNG THÍCH VỚI COMPONENT =======
// Đây là phần quan trọng để sửa lỗi "apiService is not defined"
export const apiService = {
  login,
  register,
  getProfile,
  getCustomerProfile,
  saveCustomerProfile,
  createCustomer,
  getHotels,
  getHotelById,
  getRooms,
  getRoomById,
  searchRooms,
  createBooking,
  getBookings,
  getCustomerId,
};
