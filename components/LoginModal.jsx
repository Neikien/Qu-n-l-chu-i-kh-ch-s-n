"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext"; // Đảm bảo đường dẫn tới AuthContext chính xác

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const { login } = useAuth(); // Lấy hàm login từ Context để đồng bộ trạng thái toàn app

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Chặn cuộn trang khi mở Modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset lỗi và dữ liệu khi đóng/mở lại modal
  useEffect(() => {
    if (!isOpen) {
      setError("");
      setFormData({ email: "", password: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Cập nhật dữ liệu khi người dùng gõ phím
  // Bắt buộc các thẻ input phải có thuộc tính 'name'
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Xóa thông báo lỗi khi đang gõ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Gọi hàm login từ AuthContext.
      // Hàm này sẽ tự động gọi api.js để cắt chuỗi email lấy username gửi lên backend
      await login(formData.email, formData.password);

      alert("Welcome back!");
      onClose(); // Đóng modal sau khi thành công
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Email hoặc mật khẩu không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Lớp nền đen mờ (Backdrop) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Hộp Modal Chính - Layout 2 cột sang trọng */}
      <div className="relative w-[95%] lg:w-[900px] h-[600px] bg-white shadow-2xl flex overflow-hidden animate-fade-in-up">
        {/* Nút đóng (X) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 w-10 h-10 flex items-center justify-center bg-white/80 rounded-full hover:bg-primary hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* CỘT TRÁI: ẢNH (Chỉ hiện trên màn hình lớn) */}
        <div className="hidden lg:block w-1/2 relative h-full">
          <Image
            src="https://phuquoc.regenthotels.com/sites/rpq/files/styles/height_1400/public/homepage/shutterstock_1446827465_1%20%281%29_0.jpg?itok=ZSXjz5zI"
            alt="Login Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="font-serif text-3xl">Welcome Back</h3>
            <p className="text-xs tracking-[2px] opacity-90 uppercase mt-2">
              InterContinental Life
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
        <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative bg-white">
          <h2 className="font-serif text-3xl text-primary mb-2">Sign In</h2>
          <p className="text-secondary text-sm mb-8 font-light">
            Access your member benefits.
          </p>

          {/* Hiển thị lỗi nếu đăng nhập thất bại */}
          {error && (
            <div className="mb-4 p-2 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email" // QUAN TRỌNG: Phải khớp với key trong formData
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border-b border-gray-300 py-2 text-base text-primary outline-none focus:border-accent transition-colors placeholder:text-gray-400 font-serif bg-transparent"
              />
            </div>
            <div>
              <input
                type="password"
                name="password" // QUAN TRỌNG: Phải khớp với key trong formData
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border-b border-gray-300 py-2 text-base text-primary outline-none focus:border-accent transition-colors placeholder:text-gray-400 font-serif bg-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 text-xs font-bold tracking-[2px] uppercase hover:bg-accent transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center flex justify-between text-xs text-gray-400">
            <Link
              href="/forgot-password"
              onClick={onClose}
              className="hover:text-primary transition"
            >
              Forgot Password?
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="hover:text-primary transition font-bold text-primary"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
