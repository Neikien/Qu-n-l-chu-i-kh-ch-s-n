"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api"; // Đảm bảo đường dẫn đúng tới file api.js của bạn

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading để tránh giật giao diện
  const router = useRouter();

  // 1. KHỞI TẠO: Kiểm tra đăng nhập khi F5 trang
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (token) {
          // Cách 1: Lấy từ localStorage cho nhanh (nếu api.js đã lưu)
          const savedUser = localStorage.getItem("user");

          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            // Cách 2: Nếu localStorage mất user nhưng còn token -> Gọi API lấy lại
            try {
              const profile = await apiService.getProfile();
              setUser(profile);
              localStorage.setItem("user", JSON.stringify(profile)); // Lưu lại cho lần sau
            } catch (err) {
              // Token hết hạn hoặc lỗi -> Logout
              console.error("Token invalid:", err);
              logout();
            }
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 2. HÀM LOGIN: Gọi API -> Cập nhật State
  const login = async (username, password) => {
    try {
      // Gọi hàm login bên api.js (Hàm này đã xử lý việc lưu token vào localStorage)
      const data = await apiService.login(username, password);

      // Quan trọng: Cập nhật state 'user' ngay lập tức để Header đổi giao diện
      if (data.user) {
        setUser(data.user);
      } else {
        // Fallback: Nếu api login không trả về user, gọi thêm 1 bước lấy profile
        const profile = await apiService.getProfile();
        setUser(profile);
      }

      return true;
    } catch (error) {
      throw error; // Ném lỗi ra để LoginModal bắt được và hiện thông báo đỏ
    }
  };

  // 3. HÀM LOGOUT
  const logout = () => {
    // Xóa sạch dữ liệu
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");

    setUser(null);
    router.push("/login"); // Chuyển về trang login hoặc trang chủ
    router.refresh(); // Refresh để đảm bảo các component server cập nhật (nếu cần)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Chỉ render con khi đã check xong auth để tránh nháy giao diện */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
