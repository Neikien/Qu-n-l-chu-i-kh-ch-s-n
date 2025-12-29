"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // SỬA: authAPI.login trả về data trực tiếp
      const data = await authAPI.login({ username: email, password });
      
      // SỬA: data.access_token (không phải response.data.access_token)
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        // Có thể lưu thêm user info nếu có
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }
      
      alert("Đăng nhập thành công!");
      onClose();
      window.location.reload();
    } catch (err) {
      // SỬA: err.message (không phải err.response?.data?.detail)
      setError(err.message || "Đăng nhập thất bại");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
          <p className="text-secondary text-sm mb-8 font-light">
            Access your member benefits.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 py-2 text-base text-primary outline-none focus:border-accent transition-colors placeholder:text-gray-400 font-serif"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-2 text-base text-primary outline-none focus:border-accent transition-colors placeholder:text-gray-400 font-serif"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 text-xs font-bold tracking-[2px] uppercase hover:bg-accent transition-all mt-2 disabled:opacity-50"
            >
              {loading ? "Đang đăng nhập..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center flex justify-between text-xs text-gray-400">
            <a href="#" className="hover:text-primary transition">
              Forgot Password?
            </a>
            <a href="#" className="hover:text-primary transition">
              Join Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
