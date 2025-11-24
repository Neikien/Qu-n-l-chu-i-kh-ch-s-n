"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function LoginModal({ isOpen, onClose }) {
  // Chặn cuộn trang khi mở Modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Lớp nền đen mờ (Backdrop) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} // Bấm ra ngoài thì đóng
      ></div>

      {/* Hộp Modal Chính */}
      <div className="relative w-[95%] lg:w-[900px] h-[600px] bg-white shadow-2xl flex overflow-hidden animate-fade-in-up">
        {/* Nút đóng (X) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 w-10 h-10 flex items-center justify-center bg-white/80 rounded-full hover:bg-primary hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* CỘT TRÁI: ẢNH (Chỉ hiện trên máy tính) */}
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

        {/* CỘT PHẢI: FORM */}
        <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative bg-white">
          <h2 className="font-serif text-3xl text-primary mb-2">Sign In</h2>
          <p className="text-secondary text-sm mb-8 font-light">
            Access your member benefits.
          </p>

          <form className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border-b border-gray-300 py-2 text-base text-primary outline-none focus:border-accent transition-colors placeholder:text-gray-400 font-serif"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full border-b border-gray-300 py-2 text-base text-primary outline-none focus:border-accent transition-colors placeholder:text-gray-400 font-serif"
              />
            </div>

            <button
              type="button"
              className="w-full bg-primary text-white py-4 text-xs font-bold tracking-[2px] uppercase hover:bg-accent transition-all mt-2"
            >
              Sign In
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
