"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api';
import '../login/login.css';

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
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
        phone: ""
      };

      const result = await register(userData);
      
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      
      router.push('/login');
      
    } catch (error) {
      alert("Đăng ký thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Tạo tài khoản mới</h2>
        <p className="auth-subtitle">Trải nghiệm kỳ nghỉ tuyệt vời cùng chúng tôi</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullname"
              placeholder="Nguyễn Văn A"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
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
              minLength={6}
            />
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
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn-auth"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;