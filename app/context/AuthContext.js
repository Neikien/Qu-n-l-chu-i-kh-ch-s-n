"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { useRouter } from "next/navigation";

// 1. Tạo Context
const AuthContext = createContext();

// 2. Export Provider (Đây là cái mà layout.js đang tìm kiếm)
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
      // Gọi apiService.login (Hàm này đã có logic cứu nguy ở bước trước)
      const data = await apiService.login({ email, password });

      let userInfo = null;

      // TRƯỜNG HỢP 1: LOGIN CỨU NGUY (Bypass)
      if (data.user_bypass) {
        const u = data.user_bypass;
        userInfo = {
          token: data.access_token,
          email: u.Email || u.email || email,
          name: u.HoTen || u.fullname || email,
          // Lấy MaKH chính xác để đặt phòng
          MaKH: u.MaKH || u.id || u.user_id,
        };
      }
      // TRƯỜNG HỢP 2: LOGIN CHUẨN (Dự phòng)
      else {
        const userProfile = await apiService.getProfile(data.access_token);
        const finalProfile = userProfile || { id: 1, fullname: "User" };

        userInfo = {
          token: data.access_token,
          email: email,
          name: finalProfile.fullname || finalProfile.HoTen || email,
          MaKH:
            finalProfile.user_id || finalProfile.id || finalProfile.MaKH || 1,
        };
      }

      console.log("✅ [AUTH] User Info set to Context:", userInfo);

      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("token", userInfo.token);

      return true;
    } catch (error) {
      console.error("Login Failed:", error);
      throw error;
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

// 3. Export Hook để dùng trong các trang khác
export function useAuth() {
  return useContext(AuthContext);
}
