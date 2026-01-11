const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khachsan-backend-production-9810.up.railway.app";

// Helper lấy Header chuẩn
const getAuthHeaders = (tokenOverride = null) => {
  let token = tokenOverride;
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  // 🔥 XỬ LÝ TOKEN: Xóa dấu ngoặc kép nếu có, xóa khoảng trắng thừa
  const cleanToken = token ? String(token).replace(/"/g, "").trim() : "";

  return {
    Authorization: `Bearer ${cleanToken}`,
    Accept: "application/json",
  };
};

// --- 1. LOGIN ---
export async function login(emailOrUsername, password) {
  // Phòng thủ: Nếu lỡ truyền object, tự lấy string
  let safeUsername = emailOrUsername || "";
  if (typeof safeUsername === "object")
    safeUsername = safeUsername.email || safeUsername.username || "";
  const username = String(safeUsername).trim();

  let safePassword = password;
  if (!safePassword && typeof emailOrUsername === "object")
    safePassword = emailOrUsername.password || "";

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", safePassword || "");
  formData.append("grant_type", "password");

  console.log("🔐 [API] Đang Login:", username);

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
    // Lưu token ngay lập tức
    localStorage.setItem("access_token", data.access_token);

    // Gọi getProfile để lấy info user
    try {
      const userProfile = await getProfile(data.access_token);
      return { ...data, user: userProfile };
    } catch (error) {
      console.warn(
        "⚠️ Login thành công nhưng không lấy được Profile:",
        error.message
      );
      // Trả về user rỗng để không crash app
      return { ...data, user: { email: username } };
    }
  }
  return data;
}

// --- 2. GET PROFILE (ĐÃ FIX LỖI 401) ---
export async function getProfile(token = null) {
  // Ưu tiên token truyền vào, nếu không có thì lấy từ localStorage
  let finalToken = token;
  if (!finalToken && typeof window !== "undefined") {
    finalToken = localStorage.getItem("access_token");
  }

  // 🔥 CLEAN TOKEN: Đảm bảo không dính ngoặc kép hay khoảng trắng
  const cleanToken = finalToken
    ? String(finalToken).replace(/"/g, "").trim()
    : "";

  if (!cleanToken) {
    throw new Error("Không tìm thấy Token để xác thực");
  }

  // Debug log để bạn kiểm tra (F12)
  console.log(
    "🔍 [API] getProfile với Token:",
    cleanToken.substring(0, 10) + "..."
  );

  const headers = {
    Authorization: `Bearer ${cleanToken}`,
    Accept: "application/json",
  };

  const response = await fetch(`${API_URL}/auth/info`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401)
      throw new Error("Token hết hạn hoặc không hợp lệ (401)");
    throw new Error(`Lỗi Server lấy Profile: ${status}`);
  }

  return response.json();
}

// --- 3. REGISTER (Giữ nguyên logic chuẩn) ---
export async function register(userData) {
  console.log("🚀 [API] Bắt đầu Đăng ký...");

  const email = String(userData.Email || "").trim();
  const password = userData.MatKhau || "";
  const fullname = userData.HoTen || "";
  const username = email;

  // B1: Tạo User
  const userPayload = { username, password, email, fullname };

  const signupResponse = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userPayload),
  });

  if (!signupResponse.ok) {
    const err = await signupResponse.json().catch(() => ({}));
    if (signupResponse.status !== 400 && signupResponse.status !== 409) {
      throw new Error(err.detail || "Đăng ký thất bại");
    }
    console.warn("⚠️ User đã tồn tại, chuyển sang Login...");
  }

  // B2: Login
  const loginData = await login(email, password);
  const token = loginData.access_token;
  // Lấy ID: Ưu tiên id, sau đó đến user_id, MaKH
  const userId =
    loginData.user?.id || loginData.user?.user_id || loginData.user?.MaKH;

  if (!userId) throw new Error("Không lấy được ID người dùng.");

  // B3: Customer
  console.log("📝 [API] Đồng bộ Customer...");
  const customerPayload = {
    user_id: userId,
    HoTen: fullname,
    Email: email,
    SoDienThoai: userData.SDT,
    DiaChi: userData.DiaChi,
    CCCD: userData.CCCD,
  };

  // Check & Update/Create
  let existingID = null;
  try {
    const customers = await getCustomers();
    const found = customers.find((c) => c.user_id === userId);
    if (found) existingID = found.id || found.MaKH;
  } catch (e) {}

  const method = existingID ? "PUT" : "POST";
  const url = existingID
    ? `${API_URL}/customers/${existingID}`
    : `${API_URL}/customers/`;

  await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerPayload),
  });

  return loginData;
}

// --- Các hàm khác ---
export async function getCustomers() {
  const response = await fetch(`${API_URL}/customers/`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

// ... (Giữ nguyên các hàm getHotels, getRooms... của bạn)

export const apiService = {
  login,
  register,
  getProfile,
  getCustomers,
  // ... export các hàm khác
};
