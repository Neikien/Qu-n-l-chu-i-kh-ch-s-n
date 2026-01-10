const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khachsan-backend-production-9810.up.railway.app";

// Helper lấy Header chuẩn xác
const getAuthHeaders = (tokenOverride = null) => {
  let token = tokenOverride;
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  token = token ? token.trim() : "";

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
    localStorage.setItem("access_token", data.access_token);

    try {
      console.log("🔑 Login OK. Đang lấy thông tin User...");
      const userProfile = await getProfile(data.access_token);

      console.log("✅ Lấy User thành công:", userProfile);
      localStorage.setItem("user", JSON.stringify(userProfile));

      // Tự động tạo hoặc lấy customer profile
      try {
        await getOrCreateCustomerProfile(data.access_token);
      } catch (customerError) {
        console.warn("⚠️ Có thể chưa có customer profile:", customerError.message);
      }

      return { ...data, user: userProfile };
    } catch (error) {
      console.error("❌ Lỗi xác thực Token:", error.message);
      
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

// ======= USER PROFILE APIs =======

export async function getProfile(token = null) {
  const headers = getAuthHeaders(token);

  const response = await fetch(`${API_URL}/auth/info`, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401) throw new Error("Token không hợp lệ hoặc hết hạn");
    throw new Error(`Lỗi Server: ${status}`);
  }

  return response.json();
}

export async function updateUserProfile(userData) {
  const response = await fetch(`${API_URL}/auth/update`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Cập nhật thông tin thất bại");
  }

  return response.json();
}

// ======= CUSTOMER PROFILE APIs =======

// Lấy danh sách customer profiles (thường dành cho admin)
export async function getCustomers() {
  const response = await fetch(`${API_URL}/customers/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Lỗi lấy danh sách customers: ${response.status}`);
  }

  return response.json();
}

// Lấy customer profile của user hiện tại
export async function getCustomerProfile() {
  try {
    // Đầu tiên lấy user info để biết user_id
    const userInfo = await getProfile();
    
    // Lấy tất cả customers và tìm customer của user hiện tại
    const customers = await getCustomers();
    
    // Tìm customer có user_id trùng với user hiện tại
    const customer = customers.find(c => c.user_id === userInfo.id);
    
    if (!customer) {
      // Nếu không tìm thấy, trả về null
      return null;
    }
    
    return customer;
  } catch (error) {
    console.error("Lỗi lấy customer profile:", error);
    return null;
  }
}

// Hoặc nếu backend hỗ trợ API riêng cho customer của user hiện tại:
// (Có thể bạn cần tạo thêm endpoint /customers/me)
export async function getMyCustomerProfile() {
  const response = await fetch(`${API_URL}/customers/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Chưa có customer profile
    }
    throw new Error(`Lỗi lấy customer profile: ${response.status}`);
  }

  return response.json();
}

// Tạo mới customer profile
export async function createCustomerProfile(customerData) {
  const response = await fetch(`${API_URL}/customers/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Tạo customer profile thất bại");
  }

  return response.json();
}

// Cập nhật customer profile
export async function updateCustomerProfile(customerId, customerData) {
  const response = await fetch(`${API_URL}/customers/${customerId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Cập nhật customer profile thất bại");
  }

  return response.json();
}

// Hàm tiện ích: tự động lấy hoặc tạo customer profile
export async function getOrCreateCustomerProfile(token = null) {
  try {
    // Thử lấy customer profile hiện tại
    let customer = await getCustomerProfile();
    
    if (!customer) {
      // Lấy thông tin user để tạo customer
      const userInfo = await getProfile(token);
      
      // Tạo customer profile mặc định từ user info
      const defaultCustomerData = {
        user_id: userInfo.id,
        full_name: userInfo.fullname || userInfo.username,
        email: userInfo.email,
        phone: "", // Cần người dùng cập nhật sau
        address: "", // Cần người dùng cập nhật sau
        identification_number: "", // Cần người dùng cập nhật sau
      };
      
      customer = await createCustomerProfile(defaultCustomerData);
    }
    
    return customer;
  } catch (error) {
    console.error("Lỗi trong getOrCreateCustomerProfile:", error);
    throw error;
  }
}

// Kiểm tra xem user đã có customer profile chưa
export async function checkCustomerProfileExists() {
  const customer = await getCustomerProfile();
  return customer !== null;
}

// ======= BOOKING APIs =======

export const createBooking = async (bookingData) => {
  // Kiểm tra xem user đã có customer profile chưa
  const hasCustomerProfile = await checkCustomerProfileExists();
  
  if (!hasCustomerProfile) {
    throw new Error("Vui lòng cập nhật thông tin cá nhân (customer profile) trước khi đặt phòng");
  }

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
    
    // Kiểm tra xem lỗi có liên quan đến customer profile không
    if (errorData.detail && errorData.detail.toLowerCase().includes("customer")) {
      throw new Error("Vui lòng hoàn thiện thông tin cá nhân trước khi đặt phòng");
    }
    
    throw new Error(errorData.detail || "Đặt phòng thất bại");
  }
  
  return response.json();
};

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

// Lấy danh sách bookings
export async function getBookings() {
  const response = await fetch(`${API_URL}/bookings/`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

// Lấy booking cụ thể
export async function getBooking(bookingId) {
  const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

// ======= SERVICE APIs =======

export async function getServices() {
  const response = await fetch(`${API_URL}/services/`);
  return response.json();
}

// ======= CHATBOT API =======

export async function askChatbot(question) {
  const response = await fetch(`${API_URL}/chatbot/ask/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Lỗi chatbot");
  }

  return response.json();
}

// ======= EXPORT API SERVICE =======

export const apiService = {
  login,
  register,
  getProfile,
  updateUserProfile,
  getCustomerProfile,
  createCustomerProfile,
  updateCustomerProfile,
  getOrCreateCustomerProfile,
  checkCustomerProfileExists,
  getCustomers,
  getHotels,
  getRooms,
  getRoomsByHotel,
  createBooking,
  getBookings,
  getBooking,
  getServices,
  askChatbot,
};
