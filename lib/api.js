const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khachsan-backend-production-9810.up.railway.app";

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

export async function login(emailOrUsername, password) {
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
    throw new Error(errorData.detail || "Sai tài khoản hoặc mật khẩu");
  }

  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);

    try {
      const userProfile = await getProfile(data.access_token);
      localStorage.setItem("user", JSON.stringify(userProfile));

      try {
        await getOrCreateCustomerProfile(data.access_token);
      } catch (customerError) {
        console.warn("Có thể chưa có customer profile:", customerError.message);
      }

      return { ...data, user: userProfile };
    } catch (error) {
      console.error("Lỗi xác thực Token:", error.message);
      
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

export async function getCustomerProfile() {
  try {
    const userInfo = await getProfile();
    const customers = await getCustomers();
    const customer = customers.find(c => c.user_id === userInfo.id);
    
    if (!customer) {
      return null;
    }
    
    return customer;
  } catch (error) {
    console.error("Lỗi lấy customer profile:", error);
    return null;
  }
}

export async function getMyCustomerProfile() {
  const response = await fetch(`${API_URL}/customers/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Lỗi lấy customer profile: ${response.status}`);
  }

  return response.json();
}

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

export async function getOrCreateCustomerProfile(token = null) {
  try {
    let customer = await getCustomerProfile();
    
    if (!customer) {
      const userInfo = await getProfile(token);
      
      const defaultCustomerData = {
        user_id: userInfo.id,
        full_name: userInfo.fullname || userInfo.username,
        email: userInfo.email,
        phone: "",
        address: "",
        identification_number: "",
      };
      
      customer = await createCustomerProfile(defaultCustomerData);
    }
    
    return customer;
  } catch (error) {
    console.error("Lỗi trong getOrCreateCustomerProfile:", error);
    throw error;
  }
}

export async function checkCustomerProfileExists() {
  const customer = await getCustomerProfile();
  return customer !== null;
}

export const createBooking = async (bookingData) => {
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
    
    if (errorData.detail && errorData.detail.toLowerCase().includes("customer")) {
      throw new Error("Vui lòng hoàn thiện thông tin cá nhân trước khi đặt phòng");
    }
    
    throw new Error(errorData.detail || "Đặt phòng thất bại");
  }
  
  return response.json();
};

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

export async function getBookings() {
  const response = await fetch(`${API_URL}/bookings/`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getBooking(bookingId) {
  const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getServices() {
  const response = await fetch(`${API_URL}/services/`);
  return response.json();
}

export async function askChatbot(question) {
  const response = await fetch(`${API_URL}/chatbot/ask`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: question }),
  });

  if (!response.ok) {
    throw new Error("Lỗi chatbot");
  }

  return response.json();
}

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
