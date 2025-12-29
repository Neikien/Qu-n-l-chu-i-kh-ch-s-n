// app/register/page.js
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../login/login.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error khi user nhập
    setSuccess(''); // Clear success message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Gọi API đăng ký
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email.split('@')[0], // Tạo username từ email
          password: formData.password,
          email: formData.email,
          fullname: formData.fullName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
        
        // Tự động đăng nhập sau khi đăng ký (tùy chọn)
        // Hoặc chuyển đến trang login sau 2 giây
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.detail || 'Đăng ký thất bại. Email có thể đã được sử dụng.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Tạo tài khoản mới</h2>
        <p className="auth-subtitle">Trải nghiệm kỳ nghỉ tuyệt vời cùng chúng tôi</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

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
              minLength={6}
            />
            <small className="password-hint">(Ít nhất 6 ký tự)</small>
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
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
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </p>

        <div className="api-info">
          <small>API: http://localhost:8000/auth/signup</small>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
