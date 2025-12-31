"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import './profile.css';

const ProfilePage = () => {
  const { user } = useAuth();

  // Khởi tạo state khớp với các cột trong Database của bạn
  const [formData, setFormData] = useState({
    HoTen: '',
    SoDienThoai: '',
    Email: '',
    CCCD: '',
    DiaChi: ''
  });

  // Tự động điền email/tên nếu đã có từ lúc đăng nhập/context
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        HoTen: user.name || '',
        Email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dữ liệu gửi lên Database:", formData);

    // Tại đây bạn sẽ gọi API để Lưu vào database (Ví dụ: axios.post('/api/update-profile', formData))
    alert("Cập nhật thông tin thành công!");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Thông Tin Khách Hàng</h2>
        <p className="profile-subtitle">Vui lòng hoàn thiện thông tin để phục vụ việc đặt phòng</p>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Họ và Tên</label>
            <input type="text" name="HoTen" value={formData.HoTen} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số Điện Thoại</label>
              <input type="tel" name="SoDienThoai" value={formData.SoDienThoai} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="Email" value={formData.Email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Số CCCD / Passport</label>
            <input type="text" name="CCCD" value={formData.CCCD} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Địa Chỉ</label>
            <textarea name="DiaChi" value={formData.DiaChi} onChange={handleChange} rows="3" required />
          </div>

          <button type="submit" className="btn-save">Lưu Thông Tin</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;