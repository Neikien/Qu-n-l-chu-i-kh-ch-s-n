const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khachsan-backend-production-9810.up.railway.app";

// Helper lấy Token
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
  // BƯỚC QUAN TRỌNG: Cắt lấy phần trước dấu @ để làm username
  const username = emailOrUsername.includes("@")
    ? emailOrUsername.split("@")[0]
    : emailOrUsername;

  console.log("📡 Gửi username lên backend:", username);

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

    // Sau khi có token, cố gắng lấy profile
    try {
      const userProfile = await getProfile();
      localStorage.setItem("user", JSON.stringify(userProfile));
      return { ...data, user: userProfile };
    } catch (error) {
      console.error(
        "⚠️ Đăng nhập được nhưng không lấy được profile (404):",
        error
      );
      // Vẫn trả về data để UI không bị treo
      return data;
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

  if (!response.ok) throw new Error("Đăng ký thất bại");
  return response.json();
}

// ======= PROFILE APIs =======

export async function getProfile() {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("404: Không tìm thấy endpoint /auth/me");
  return response.json();
}

export async function getCustomerProfile() {
  const response = await fetch(`${API_URL}/customers/my-profile`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) return null;
  return response.json();
}

// ======= ROOM & HOTEL APIs =======

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

export const apiService = {
  login,
  register,
  getProfile,
  getCustomerProfile,
  getHotels,
  getRooms,
  getRoomsByHotel,
};
