"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import '../login/login.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '', // Đổi email thành username để khớp DB
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }
    // Dữ liệu này bây giờ đã sẵn sàng để gửi lên API Backend (chỉ chứa username)
    console.log('Dữ liệu gửi lên Database:', {
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password
    });
    alert("Đăng ký thành công với tên đăng nhập: " + formData.username);
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
              name="fullName"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text" // Dùng text cho username
              name="username" // Name phải khớp với key trong useState
              placeholder="nguyenvana"
              value={formData.username}
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
            />
          </div>

          <button type="submit" className="btn-auth">Đăng Ký</button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;