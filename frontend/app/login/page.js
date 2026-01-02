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
  const [loading, setLoading] = useState(false); // THIẾU trong bản mới

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // THÊM: Bật loading

    try {
      // Dùng hàm login từ lib/api.js
      const result = await login(formData.userName, formData.password);
      
      console.log('Login thành công:', result);
      
      // Tạo user object - THÊM email và customer_id
      const user = {
        name: formData.userName,
        userName: formData.userName,
        email: formData.userName.includes('@') ? formData.userName : `${formData.userName}@gmail.com`,
        avatar: "https://i.pravatar.cc/150?u=" + formData.userName,
        role: "VIP Member",
        token: result.access_token,
        customer_id: null // Sẽ cập nhật sau khi tạo KH
      };

      // Gọi login từ AuthContext
      authLogin(user);
      
      alert("✅ Đăng nhập thành công!");
      
      // THÊM: Tự động chuyển hướng
      window.location.href = '/profile';
      
    } catch (error) {
      console.error('Login error:', error);
      // CẢI THIỆN: Xử lý lỗi chi tiết hơn
      let errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng!";
      if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!";
      } else if (error.message.includes('401')) {
        errorMessage = "Sai tài khoản hoặc mật khẩu!";
      }
      setError(errorMessage);
    } finally {
      setLoading(false); // THÊM: Tắt loading
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Chào mừng trở lại</h2>
        
        {/* CẢI THIỆN: Hiển thị lỗi đẹp hơn */}
        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="testuser123"
              required
              disabled={loading} // THÊM: Disable khi loading
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="123456"
              required
              disabled={loading} // THÊM: Disable khi loading
            />
          </div>
          
          {/* CẢI THIỆN: Nút có loading */}
          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang đăng nhập...
              </>
            ) : 'Đăng Nhập'}
          </button>
        </form>
        
        {/* CẢI THIỆN: Thêm link quên mật khẩu */}
        <div className="auth-footer-links">
          <p>Bạn chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link></p>
          <p><Link href="/forgot-password">Quên mật khẩu?</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;