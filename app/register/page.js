"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        fullname: formData.fullname,
        phone: "",
      };

      await register(userData); // Giả sử register trả về promise
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login");
    } catch (error) {
      alert("Đăng ký thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-900">
      {/* 1. BACKGROUND IMAGE (Full màn hình, tối màu) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop"
          alt="Luxury Hotel Background"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 2. REGISTER CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl p-8 md:p-12 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[3px] uppercase text-gray-500 mb-2">
            IHG One Rewards
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 font-light">
            Begin your journey to exceptional stays.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-amber-600 transition-colors">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              placeholder="e.g. Nguyen Van A"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-amber-600 focus:placeholder-gray-500"
            />
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-amber-600 transition-colors">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-amber-600 focus:placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-amber-600 transition-colors">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-amber-600 focus:placeholder-gray-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-amber-600 transition-colors">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-amber-600 focus:placeholder-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-gray-900 text-white py-4 text-xs font-bold uppercase tracking-[2px] hover:bg-amber-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Join Now"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            Already a member?{" "}
            <Link
              href="/login"
              className="font-bold text-gray-900 hover:text-amber-600 transition-colors uppercase tracking-wider text-xs border-b border-transparent hover:border-amber-600 pb-0.5"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
