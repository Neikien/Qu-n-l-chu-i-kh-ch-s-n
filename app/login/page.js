"use client";
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import './login.css';

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const [error, setError] = useState(""); // Thêm state để hiện lỗi

  const handleSubmit = async (e) => {
    e.preventDefault();

    // KIỂM TRA THEO USERNAME (Không dùng email nữa)
    if (formData.userName === "admin" && formData.password === "123456") {
      const mockUser = {
        name: "Nguyễn Văn Admin",
        userName: formData.userName, // Đổi email thành userName
        avatar: "https://i.pravatar.cc/150?u=admin",
        role: "VIP Member"
      };

      login(mockUser);
      alert("Đăng nhập thành công!");
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng! (Gợi ý: admin / 123456)");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Chào mừng trở lại</h2>
        {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text" // Chuyển từ type="username" (không hợp lệ) sang "text"
              name="userName"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-auth">Đăng Nhập</button>
        </form>
        <p className="auth-footer">Bạn chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;