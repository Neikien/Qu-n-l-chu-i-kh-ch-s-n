"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiService } from "@/services/apiService";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Trash2,
  Save,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();

  // State cho form update
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    current_password: "",
    new_password: "",
  });
  const [loading, setLoading] = useState(false);

  // Load data vào form
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullname: user.fullname || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Xử lý CẬP NHẬT
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.current_password) {
      alert("Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi.");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await apiService.updateUser(formData);
      setUser(updatedUser);
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
      }));
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý XÓA TÀI KHOẢN
  const handleDeleteAccount = async () => {
    if (
      confirm(
        "CẢNH BÁO: Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa tài khoản?"
      )
    ) {
      try {
        await apiService.deleteAccount();
        alert("Tài khoản đã bị xóa.");
        logout();
      } catch (error) {
        alert("Không thể xóa tài khoản.");
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/login" className="text-primary underline">
          Vui lòng đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-serif text-gray-500 font-bold">
              {/* --- FIX LỖI CRASH TẠI ĐÂY --- */}
              {/* Ép kiểu String trước khi gọi charAt để an toàn */}
              {String(user.fullname || user.username || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                {user.fullname}
              </h1>
              <p className="text-gray-500">
                @{user.username} • {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-full hover:bg-black hover:text-white transition"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SIDEBAR INFO */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit">
            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider text-gray-400 text-xs">
              Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <User size={18} />
                <span className="font-medium">ID: {user.id}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={18} />
                <span className="font-medium truncate">
                  {user.email || "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <ShieldAlert size={18} />
                <span className="font-medium">Role: {user.role}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-6 w-full py-2 bg-primary text-white rounded font-bold text-sm hover:opacity-90 transition"
            >
              {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
            </button>
          </div>

          {/* MAIN FORM AREA */}
          <div className="lg:col-span-2 space-y-6">
            {/* FORM UPDATE */}
            {isEditing && (
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 animate-fade-in-up">
                <h2 className="text-xl font-bold mb-6">Cập nhật hồ sơ</h2>
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ tên
                      </label>
                      <input
                        type="text"
                        className="w-full border p-2 rounded focus:ring-black outline-none"
                        value={formData.fullname}
                        onChange={(e) =>
                          setFormData({ ...formData, fullname: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full border p-2 rounded focus:ring-black outline-none"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs uppercase font-bold text-gray-400 mb-4">
                      Đổi mật khẩu & Xác nhận
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu mới (Nếu muốn đổi)
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                          <input
                            type="password"
                            className="w-full border pl-9 p-2 rounded focus:ring-black outline-none"
                            placeholder="Nhập mật khẩu mới..."
                            value={formData.new_password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                new_password: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-red-600 mb-1">
                          Mật khẩu hiện tại (Bắt buộc)
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 text-red-400 w-4 h-4" />
                          <input
                            type="password"
                            required
                            className="w-full border border-red-200 bg-red-50 pl-9 p-2 rounded focus:ring-red-500 outline-none"
                            placeholder="Xác nhận mật khẩu cũ..."
                            value={formData.current_password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                current_password: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-black text-white px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <Save size={18} />
                      )}
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* DANGER ZONE */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-100 flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-bold">Xóa tài khoản</h3>
                <p className="text-red-600 text-sm mt-1">
                  Hành động này sẽ xóa vĩnh viễn dữ liệu của bạn.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition flex items-center gap-2 text-sm font-bold"
              >
                <Trash2 size={16} /> Xóa ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
