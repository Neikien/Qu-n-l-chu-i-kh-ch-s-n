"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import './profile.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    HoTen: '',
    SoDienThoai: '',
    Email: '',
    CCCD: '',
    DiaChi: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [customerId, setCustomerId] = useState(null); // Lưu MaKH nếu có

  // Load dữ liệu từ backend
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.token) return;
      
      setLoading(true);
      try {
        // 1. Ưu tiên lấy từ LocalStorage (tạm thời)
        const savedData = localStorage.getItem('userProfile');
        if (savedData) {
          setFormData(JSON.parse(savedData));
          setLoading(false);
          return;
        }

        // 2. Gọi API lấy danh sách khách hàng
        const response = await fetch('https://khachsan-backend-production-9810.up.railway.app/customers/', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) throw new Error('Không thể lấy danh sách KH');
        
        const customers = await response.json();
        
        // 3. Tìm profile của user hiện tại (dựa vào email hoặc username)
        const userEmail = user.email || user.userName;
        const myProfile = customers.find(c => 
          c.Email === userEmail || c.Email === user.email || c.Email === user.userName
        );

        if (myProfile) {
          setFormData({
            HoTen: myProfile.HoTen || '',
            SoDienThoai: myProfile.SoDienThoai || '',
            Email: myProfile.Email || userEmail,
            CCCD: myProfile.CCCD || '',
            DiaChi: myProfile.DiaChi || ''
          });
          setCustomerId(myProfile.MaKH);
          localStorage.setItem('userProfile', JSON.stringify(myProfile));
        } else {
          // 4. Nếu chưa có profile, dùng thông tin đăng nhập
          setFormData(prev => ({
            ...prev,
            HoTen: user.name || '',
            Email: userEmail
          }));
        }

      } catch (error) {
        console.error('Lỗi load profile:', error);
        // Fallback: lấy từ thông tin đăng nhập
        setFormData(prev => ({
          ...prev,
          HoTen: user.name || '',
          Email: user.email || user.userName || ''
        }));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log("Đang lưu thông tin:", formData);
      
      // Gọi API lưu profile
      const url = customerId 
        ? `https://khachsan-backend-production-9810.up.railway.app/customers/${customerId}`  // Cập nhật nếu có ID
        : 'https://khachsan-backend-production-9810.up.railway.app/customers/';  // Tạo mới nếu chưa có
      
      const method = customerId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Kết quả:", result);
      
      // Lưu vào LocalStorage (tạm thời)
      localStorage.setItem('userProfile', JSON.stringify(formData));
      
      if (result.MaKH && !customerId) {
        setCustomerId(result.MaKH);
      }
      
      setMessage(`✅ Đã lưu thông tin thành công!`);
      setIsEditing(false);
      
    } catch (error) {
      console.error("Lỗi:", error);
      setMessage(`❌ Lỗi: ${error.message}`);
      
      // Fallback: lưu vào localStorage nếu API fail
      localStorage.setItem('userProfile', JSON.stringify(formData));
      setIsEditing(false);
      alert("✅ Đã lưu thông tin (offline mode)!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Load lại dữ liệu cũ từ LocalStorage
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
            <h2 className="profile-title">Hồ Sơ Của Tôi</h2>

            {!isEditing && (
                <button 
                  onClick={handleEdit} 
                  className="btn-icon-edit" 
                  title="Chỉnh sửa thông tin"
                  disabled={loading}
                >
                  {loading ? 'Đang tải...' : '✏️ Sửa'}
                </button>
            )}
        </div>

        <p className="profile-subtitle">
            {isEditing
                ? "Vui lòng cập nhật thông tin chính xác."
                : "Thông tin cá nhân & liên hệ đặt phòng."}
        </p>

        {message && (
          <div className="message-alert" style={{ 
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label>Họ và Tên</label>
            {isEditing ? (
                <input 
                  type="text" 
                  name="HoTen" 
                  value={formData.HoTen} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  placeholder="Nhập họ tên đầy đủ"
                />
            ) : (
                <div className="read-only-field">{formData.HoTen || "Chưa cập nhật"}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số Điện Thoại</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  name="SoDienThoai" 
                  value={formData.SoDienThoai} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  placeholder="0912345678"
                />
              ) : (
                <div className="read-only-field">{formData.SoDienThoai || "Chưa cập nhật"}</div>
              )}
            </div>
            <div className="form-group">
              <label>Email</label>
              {isEditing ? (
                 <input 
                   type="email" 
                   name="Email" 
                   value={formData.Email} 
                   onChange={handleChange} 
                   required 
                   disabled={loading}
                   placeholder="email@example.com"
                 />
              ) : (
                 <div className="read-only-field">{formData.Email || user?.email || user?.userName || "Chưa cập nhật"}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Số CCCD / Passport</label>
            {isEditing ? (
                <input 
                  type="text" 
                  name="CCCD" 
                  value={formData.CCCD} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  placeholder="123456789012"
                />
            ) : (
                <div className="read-only-field">{formData.CCCD || "Chưa cập nhật"}</div>
            )}
          </div>

          <div className="form-group">
            <label>Địa Chỉ</label>
            {isEditing ? (
                <textarea 
                  name="DiaChi" 
                  value={formData.DiaChi} 
                  onChange={handleChange} 
                  rows="3" 
                  required 
                  disabled={loading}
                  placeholder="Số nhà, đường, phường, quận, thành phố"
                />
            ) : (
                <div className="read-only-field">{formData.DiaChi || "Chưa cập nhật"}</div>
            )}
          </div>

          {/* Khu vực nút bấm: Chỉ hiện khi ĐANG SỬA */}
          {isEditing && (
              <div className="action-buttons">
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    className="btn-cancel"
                    disabled={loading}
                  >
                    Hủy Bỏ
                  </button>
                  <button 
                    type="submit" 
                    className="btn-save" 
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>
              </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
