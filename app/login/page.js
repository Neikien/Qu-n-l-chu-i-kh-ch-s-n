"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* CỘT TRÁI: ẢNH NGHỆ THUẬT (Ẩn trên mobile) */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        {/* Lớp phủ đen mờ để chữ nổi bật nếu cần */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="absolute bottom-10 left-10 text-white p-10">
          <h2 className="font-serif text-4xl mb-4">Welcome Back</h2>
          <p className="text-sm font-light tracking-wider opacity-90">
            INTERCONTINENTAL HOTELS & RESORTS
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-10 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          {/* Logo / Home Link */}
          <Link href="/" className="block mb-12 text-center lg:text-left">
            <span className="font-serif text-2xl font-bold text-primary tracking-widest uppercase">
              InterContinental
            </span>
          </Link>

          <h1 className="font-serif text-4xl text-primary mb-2">Sign In</h1>
          <p className="text-secondary text-sm mb-10">
            Access your account and manage your bookings.
          </p>

          {/* Form */}
          <form className="space-y-8">
            {/* Email Input (Style gạch chân sang trọng) */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2 uppercase">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full border-b border-gray-300 py-2 text-lg text-primary outline-none focus:border-accent transition-all placeholder:text-gray-200 font-serif"
              />
            </div>

            {/* Password Input */}
            <div className="group">
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase">
                  Password
                </label>
                <a href="#" className="text-xs text-accent hover:underline">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border-b border-gray-300 py-2 text-lg text-primary outline-none focus:border-accent transition-all placeholder:text-gray-200 font-serif"
              />
            </div>

            {/* Button */}
            <button
              type="button"
              className="w-full bg-primary text-white py-4 text-xs font-bold tracking-[2px] uppercase hover:bg-accent transition-all mt-4"
            >
              Sign In
            </button>
          </form>

          {/* Footer Form */}
          <div className="mt-10 text-center text-sm text-secondary">
            <p>
              Don't have an account?{" "}
              <a href="#" className="text-accent font-bold hover:underline">
                Join Now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
