"use client";
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import './login.css';

const LoginPage = () => {
  const { login } = useAuth(); // Lấy hàm login từ Context
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Giả lập gọi API backend
    // const res = await fetch('YOUR_API_URL/login', ...);
    // const data = await res.json();

    // Giả sử data trả về thành công:
    const mockUserData = {
      name: "Khách hàng VIP",
      email: formData.email,
      avatar: ""
    };

    // QUAN TRỌNG: Gọi login để lưu vào localStorage và State
    login(mockUserData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Chào mừng trở lại</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <button type="submit" className="btn-auth">Đăng Nhập</button>
        </form>
        <p className="auth-footer">Bạn chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;