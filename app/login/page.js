real login
"use client";
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { login } from '@/lib/api';  // Import từ lib/api
import './login.css';

const LoginPage = () => {
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Dùng hàm login từ lib/api.js
      const result = await login(formData.userName, formData.password);
      
      console.log('Login thành công:', result);
      
      // Tạo user object
      const user = {
        name: formData.userName,
        userName: formData.userName,
        avatar: "https://i.pravatar.cc/150?u=" + formData.userName,
        role: "VIP Member",
        token: result.access_token
      };

      // Gọi login từ AuthContext
      authLogin(user);
      
      alert("✅ Đăng nhập thành công!");
      
    } catch (error) {
      console.error('Login error:', error);
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
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
              type="text"
              name="userName"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              placeholder="testuser123"
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
              placeholder="123456"
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
