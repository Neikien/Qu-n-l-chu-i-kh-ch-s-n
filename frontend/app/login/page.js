"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataEncoded = new URLSearchParams();
      formDataEncoded.append('username', formData.username);
      formDataEncoded.append('password', formData.password);

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
        
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user || {}));
        }
        
        alert('Đăng nhập thành công!');
        router.push('/');
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
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              placeholder="Nhập username"
              value={formData.username}
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
      </div>
    </div>
  );
};

export default LoginPage;
