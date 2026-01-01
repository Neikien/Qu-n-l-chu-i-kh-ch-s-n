"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import './profile.css';

const ProfilePage = () => {
  const { user } = useAuth();

  // State quản lý chế độ Sửa/Xem
  const [isEditing, setIsEditing] = useState(false);

  // State dữ liệu form
  const [formData, setFormData] = useState({
    HoTen: '',
    SoDienThoai: '',
    Email: '',
    CCCD: '',
    DiaChi: ''
  });

  // Load dữ liệu khi vào trang
  useEffect(() => {
    // 1. Ưu tiên lấy từ LocalStorage (Dữ liệu đã lưu trước đó)
    const savedData = localStorage.getItem('userProfile');

    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else if (user) {
      // 2. Nếu chưa có gì, lấy từ thông tin đăng nhập ban đầu
      setFormData(prev => ({
        ...prev,
        HoTen: user.name || '',
        Email: user.email || user.userName || '' // Fallback nếu login bằng username
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Lưu vào LocalStorage (Giả lập lưu xuống Database)
    localStorage.setItem('userProfile', JSON.stringify(formData));

    // Tắt chế độ sửa
    setIsEditing(false);

    alert("✅ Đã lưu thông tin thành công!");
  };

  const handleEdit = () => {
    setIsEditing(true); // Bật chế độ sửa
  };

  const handleCancel = () => {
    // Nếu hủy, load lại dữ liệu cũ từ LocalStorage
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
        setFormData(JSON.parse(savedData));
    }
    setIsEditing(false); // Tắt chế độ sửa
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
            <h2 className="profile-title">Hồ Sơ Của Tôi</h2>

            {/* Nút Sửa (Hình cái bút) - Chỉ hiện khi KHÔNG ở chế độ sửa */}
            {!isEditing && (
                <button onClick={handleEdit} className="btn-icon-edit" title="Chỉnh sửa thông tin">
                    ✏️ Sửa
                </button>
            )}
        </div>

        <p className="profile-subtitle">
            {isEditing
                ? "Vui lòng cập nhật thông tin chính xác."
                : "Thông tin cá nhân & liên hệ đặt phòng."}
        </p>

        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label>Họ và Tên</label>
            {isEditing ? (
                <input type="text" name="HoTen" value={formData.HoTen} onChange={handleChange} required />
            ) : (
                <div className="read-only-field">{formData.HoTen || "Chưa cập nhật"}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số Điện Thoại</label>
              {isEditing ? (
                <input type="tel" name="SoDienThoai" value={formData.SoDienThoai} onChange={handleChange} required />
              ) : (
                <div className="read-only-field">{formData.SoDienThoai || "Chưa cập nhật"}</div>
              )}
            </div>
            <div className="form-group">
              <label>Email</label>
              {isEditing ? (
                 <input type="email" name="Email" value={formData.Email} onChange={handleChange} required />
              ) : (
                 <div className="read-only-field">{formData.Email}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Số CCCD / Passport</label>
            {isEditing ? (
                <input type="text" name="CCCD" value={formData.CCCD} onChange={handleChange} required />
            ) : (
                <div className="read-only-field">{formData.CCCD || "Chưa cập nhật"}</div>
            )}
          </div>

          <div className="form-group">
            <label>Địa Chỉ</label>
            {isEditing ? (
                <textarea name="DiaChi" value={formData.DiaChi} onChange={handleChange} rows="3" required />
            ) : (
                <div className="read-only-field">{formData.DiaChi || "Chưa cập nhật"}</div>
            )}
          </div>

          {/* Khu vực nút bấm: Chỉ hiện khi ĐANG SỬA */}
          {isEditing && (
              <div className="action-buttons">
                  <button type="button" onClick={handleCancel} className="btn-cancel">Hủy Bỏ</button>
                  <button type="submit" className="btn-save">Lưu Thay Đổi</button>
              </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;