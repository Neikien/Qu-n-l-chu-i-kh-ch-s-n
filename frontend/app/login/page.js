"use client";
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './login.css';

const LoginPage = () => {
  const { login } = useAuth(); // Lấy hàm login từ Context
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
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
      // Gọi API backend thực tế
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
        
        // Lưu token vào localStorage
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        
        // Chuẩn bị user data cho AuthContext
        const userData = {
          name: data.user?.name || formData.username,
          email: data.user?.email || '',
          avatar: data.user?.avatar || '',
          // Thêm các thông tin khác từ API nếu có
          ...data.user
        };
        
        // Lưu user vào localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Gọi hàm login từ Context để cập nhật state toàn app
        login(userData);
        
        // Thông báo thành công
        alert('Đăng nhập thành công!');
        
        // Điều hướng về trang chủ
        router.push('/');
      } else {
        // Xử lý lỗi từ server
        const errorMessage = data.detail || 
                            data.message || 
                            'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.';
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Fallback: Nếu API không hoạt động, dùng mock data (cho development)
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock login for development');
        const mockUserData = {
          name: "Khách hàng VIP",
          email: formData.username.includes('@') ? formData.username : `${formData.username}@example.com`,
          avatar: "",
          username: formData.username
        };
        
        localStorage.setItem('user', JSON.stringify(mockUserData));
        localStorage.setItem('access_token', 'mock_token_for_development');
        login(mockUserData);
        alert('Đăng nhập thành công (mock data)!');
        router.push('/');
      } else {
        setError('Không thể kết nối đến server. Vui lòng thử lại.');
      }
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
            <label htmlFor="username">Tên đăng nhập hoặc Email</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Nhập username hoặc email"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <Link href="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang đăng nhập...
              </>
            ) : 'Đăng Nhập'}
          </button>

          <div className="divider">
            <span>hoặc</span>
          </div>

          <button type="button" className="btn-social btn-google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Đăng nhập với Google
          </button>
        </form>

        <p className="auth-footer">
          Bạn chưa có tài khoản? 
          <Link href="/register" className="auth-link">
            Đăng ký ngay
          </Link>
        </p>

        <div className="auth-terms">
          <p>
            Bằng việc đăng nhập, bạn đồng ý với 
            <Link href="/terms"> Điều khoản dịch vụ </Link> 
            và 
            <Link href="/privacy"> Chính sách bảo mật </Link>
            của chúng tôi
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
