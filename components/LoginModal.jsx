"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext"; // <--- 1. QUAN TRỌNG: Import useAuth

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();

  // 2. QUAN TRỌNG: Lấy hàm login từ Context
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setFormData({ email: "", password: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 3. QUAN TRỌNG: Dùng hàm login của Context (KHÔNG DÙNG apiService Ở ĐÂY)
      // Hàm này sẽ tự động cập nhật State và Header cho bạn
      await login(formData.email, formData.password);

      alert("Đăng nhập thành công!");

      onClose(); // Đóng modal
      // Không cần reload trang nữa vì React sẽ tự cập nhật giao diện
    } catch (err) {
      console.error(err);
      setError(err.message || "Email hoặc mật khẩu không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-[95%] lg:w-[900px] h-[600px] bg-white shadow-2xl flex overflow-hidden animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 w-10 h-10 flex items-center justify-center bg-white/80 rounded-full hover:bg-primary hover:text-white transition-colors"
        >
          ✕
        </button>

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

        <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative bg-white">
          <h2 className="font-serif text-3xl text-primary mb-2">Sign In</h2>
          <p className="text-secondary text-sm mb-6 font-light">
            Access your member benefits.
          </p>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
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
                name="password"
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
