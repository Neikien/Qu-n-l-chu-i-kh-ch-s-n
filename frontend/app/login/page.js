// app/login/page.js
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error khi user nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Gọi API đăng nhập - OAuth2 format
      const formDataEncoded = new URLSearchParams();
      formDataEncoded.append('username', formData.email); // Backend dùng 'username' field
      formDataEncoded.append('password', formData.password);
      formDataEncoded.append('grant_type', 'password');

      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataEncoded.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        
        // Lưu token vào localStorage
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user || {}));
        }
        
        // Chuyển hướng sau khi đăng nhập thành công
        alert('Đăng nhập thành công!');
        router.push('/'); // Về trang chủ
      } else {
        setError(data.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Chào mừng trở lại</h2>
        <p className="auth-subtitle">Đăng nhập để quản lý đặt phòng của bạn</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="vidu@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <p className="auth-footer">
          Bạn chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
        </p>

        <div className="api-info">
          <small>API: http://localhost:8000/auth/login</small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
