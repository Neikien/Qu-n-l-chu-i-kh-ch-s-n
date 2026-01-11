"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { useRouter } from "next/navigation";

// 1. Tạo Context
const AuthContext = createContext();

// 2. Export Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load user từ localStorage khi F5 trang
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Lỗi parse user storage", e);
        }
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log("🔒 [AUTH] Đang gọi API Login chuẩn...");

      // 1. Gọi API Login -> Nhận Token
      const data = await apiService.login({ email, password });

      if (!data || !data.access_token) {
        throw new Error("Không nhận được access_token từ server");
      }

      console.log("🔑 [AUTH] Có Token, đang lấy Profile...");

      // 2. Dùng Token để lấy thông tin chi tiết User (Profile)
      // (Nếu apiService.getProfile bị lỗi 500/404, nó sẽ throw error tại đây để bạn debug)
      const userProfile = await apiService.getProfile(data.access_token);

      console.log("👤 [AUTH] Raw Profile từ Backend:", userProfile);

      // 3. Map dữ liệu chuẩn hóa
      const userInfo = {
        token: data.access_token,
        email: userProfile.email || userProfile.Email || email,
        name:
          userProfile.fullname ||
          userProfile.HoTen ||
          userProfile.TenKH ||
          "User",
        // Quan trọng: Map đúng ID để lưu vào booking
        MaKH: userProfile.MaKH || userProfile.user_id || userProfile.id,
      };

      console.log("✅ [AUTH] User Info Final:", userInfo);

      // 4. Lưu vào State & LocalStorage
      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("token", userInfo.token);

      return true;
    } catch (error) {
      console.error("❌ [AUTH] Login Failed:", error);
      throw error; // Ném lỗi ra để UI hiển thị thông báo
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Export Hook
export function useAuth() {
  return useContext(AuthContext);
}
