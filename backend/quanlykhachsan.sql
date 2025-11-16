-- Tạo database
CREATE DATABASE IF NOT EXISTS hotel_management;
USE hotel_management;

-- Bảng KHU_VUC
CREATE TABLE KHU_VUC (
    MaKhuVuc INT AUTO_INCREMENT PRIMARY KEY,
    TenKhuVuc VARCHAR(100) NOT NULL,
    MoTa TEXT,
    ViTri VARCHAR(255)
);

-- Bảng KHACH_SAN
CREATE TABLE KHACH_SAN (
    MaKS INT AUTO_INCREMENT PRIMARY KEY,
    TenKS VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(255) NOT NULL,
    SoSao INT CHECK (SoSao BETWEEN 1 AND 5),
    MaKhuVuc INT,
    MoTa TEXT,
    AnhDaiDien VARCHAR(255),
    FOREIGN KEY (MaKhuVuc) REFERENCES KHU_VUC(MaKhuVuc)
);

-- BỔ SUNG 4 BẢNG MỚI VÀO HỆ THỐNG

-- 8. Bảng LIEN_HE_KHACH_SAN
CREATE TABLE LIEN_HE_KHACH_SAN (
    MaLienHe INT AUTO_INCREMENT PRIMARY KEY,
    MaKS INT,
    HoTenNguoiLienHe VARCHAR(100) NOT NULL,
    ChucVu VARCHAR(50),
    SoDienThoai VARCHAR(15),
    Email VARCHAR(100),
    GhiChu TEXT,
    FOREIGN KEY (MaKS) REFERENCES KHACH_SAN(MaKS) ON DELETE CASCADE
);

-- 9. Bảng DANH_GIA
CREATE TABLE DANH_GIA (
    MaDanhGia INT AUTO_INCREMENT PRIMARY KEY,
    MaDatPhong INT,
    Diem INT CHECK (Diem BETWEEN 1 AND 5),
    NoiDung TEXT,
    NgayDanhGia DATE DEFAULT CURDATE(),
    TrangThai ENUM('Hiển thị', 'Ẩn') DEFAULT 'Hiển thị',
    FOREIGN KEY (MaDatPhong) REFERENCES DAT_PHONG(MaDatPhong) ON DELETE CASCADE
);

-- 10. Bảng TAI_KHOAN
CREATE TABLE TAI_KHOAN (
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
    TenDangNhap VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    LoaiTaiKhoan ENUM('admin', 'khach_hang', 'nhan_vien') DEFAULT 'khach_hang',
    MaKH INT,
    TrangThai ENUM('active', 'inactive') DEFAULT 'active',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH) ON DELETE CASCADE
);

-- 11. Bảng LICH_SU_HOAT_DONG
CREATE TABLE LICH_SU_HOAT_DONG (
    MaHoatDong INT AUTO_INCREMENT PRIMARY KEY,
    MaTaiKhoan INT,
    HanhDong VARCHAR(100) NOT NULL,
    MoTa TEXT,
    ThoiGian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaTaiKhoan) REFERENCES TAI_KHOAN(MaTaiKhoan) ON DELETE CASCADE
);

-- CHÈN DỮ LIỆU MẪU CHO CÁC BẢNG MỚI

-- Chèn dữ liệu LIEN_HE_KHACH_SAN
INSERT INTO LIEN_HE_KHACH_SAN (MaKS, HoTenNguoiLienHe, ChucVu, SoDienThoai, Email, GhiChu) VALUES
(1, 'Nguyễn Thị Hồng', 'Quản lý lễ tân', '0912345001', 'manager.topas@sapa.com', 'Hỗ trợ 24/7'),
(2, 'Trần Văn Nam', 'Giám đốc khách sạn', '0912345002', 'director.vinpearl@halong.com', 'Liên hệ giờ hành chính'),
(3, 'Lê Thị Mai', 'Trưởng bộ phận đặt phòng', '0912345003', 'reservation@intercontinental.com', 'Hỗ trợ đặt phòng và dịch vụ'),
(4, 'Phạm Văn Đức', 'Quản lý khách sạn', '0912345004', 'manager.anantara@hoian.com', 'Hỗ trợ đa ngôn ngữ'),
(5, 'Hoàng Thị Lan', 'Giám đốc điều hành', '0912345005', 'director.amanoi@nhatrang.com', 'Liên hệ qua email là tốt nhất');

-- Chèn dữ liệu DANH_GIA
INSERT INTO DANH_GIA (MaDatPhong, Diem, NoiDung, NgayDanhGia) VALUES
(1, 5, 'Khách sạn tuyệt vời, view đẹp, nhân viên thân thiện. Sẽ quay lại!', '2024-01-19'),
(1, 4, 'Phòng sạch sẽ, dịch vụ tốt nhưng giá hơi cao. Buffet sáng ngon.', '2024-01-20'),
(3, 5, 'Trải nghiệm tuyệt vời! View biển đẹp, phòng rộng rãi và sạch sẽ.', '2024-01-28'),
(2, 3, 'Khách sạn đẹp nhưng dịch vụ hơi chậm. Cần cải thiện hơn.', '2024-01-23');

-- Chèn dữ liệu TAI_KHOAN (mật khẩu mẫu: 123456 - đã được mã hóa bcrypt)
INSERT INTO TAI_KHOAN (TenDangNhap, MatKhau, LoaiTaiKhoan, MaKH, TrangThai) VALUES
('admin', '$2a$10$8K1p/a0dRTnL5y2ZQY.7Oe3hZkX6VqB9nQY6wXrZcNtHjJvMlKpYi', 'admin', NULL, 'active'),
('nguyenvanan', '$2a$10$8K1p/a0dRTnL5y2ZQY.7Oe3hZkX6VqB9nQY6wXrZcNtHjJvMlKpYi', 'khach_hang', 1, 'active'),
('tranthibinh', '$2a$10$8K1p/a0dRTnL5y2ZQY.7Oe3hZkX6VqB9nQY6wXrZcNtHjJvMlKpYi', 'khach_hang', 2, 'active'),
('levancuong', '$2a$10$8K1p/a0dRTnL5y2ZQY.7Oe3hZkX6VqB9nQY6wXrZcNtHjJvMlKpYi', 'khach_hang', 3, 'active'),
('phamthidung', '$2a$10$8K1p/a0dRTnL5y2ZQY.7Oe3hZkX6VqB9nQY6wXrZcNtHjJvMlKpYi', 'khach_hang', 4, 'active');

-- Chèn dữ liệu LICH_SU_HOAT_DONG
INSERT INTO LICH_SU_HOAT_DONG (MaTaiKhoan, HanhDong, MoTa) VALUES
(2, 'Đặt phòng', 'Đặt phòng Deluxe Mountain View tại Topas Sapa từ 15-18/01/2024'),
(2, 'Thanh toán', 'Thanh toán thành công 7,500,000 VND cho đặt phòng #1'),
(3, 'Đặt phòng', 'Đặt phòng Ocean View Suite tại Vinpearl Hạ Long từ 20-22/01/2024'),
(4, 'Đặt phòng', 'Đặt phòng River View Suite tại Anantara Hội An từ 25-27/01/2024'),
(1, 'Quản lý', 'Admin đăng nhập vào hệ thống quản lý'),
(2, 'Hủy dịch vụ', 'Hủy dịch vụ tour tham quan cho đặt phòng #1');

-- TẠO THÊM INDEX CHO CÁC BẢNG MỚI
CREATE INDEX idx_lienhe_maks ON LIEN_HE_KHACH_SAN(MaKS);
CREATE INDEX idx_danhgia_madatphong ON DANH_GIA(MaDatPhong);
CREATE INDEX idx_taikhoan_makh ON TAI_KHOAN(MaKH);
CREATE INDEX idx_taikhoan_tendangnhap ON TAI_KHOAN(TenDangNhap);
CREATE INDEX idx_lichsu_mataikhoan ON LICH_SU_HOAT_DONG(MaTaiKhoan);
CREATE INDEX idx_lichsu_thoigian ON LICH_SU_HOAT_DONG(ThoiGian);

-- TẠO VIEW MỚI

-- View xem thông tin đánh giá chi tiết
CREATE VIEW view_danh_gia_chi_tiet AS
SELECT 
    dg.MaDanhGia,
    dg.Diem,
    dg.NoiDung,
    dg.NgayDanhGia,
    dg.TrangThai,
    kh.HoTen,
    ks.TenKS,
    p.LoaiPhong,
    dp.MaDatPhong
FROM DANH_GIA dg
JOIN DAT_PHONG dp ON dg.MaDatPhong = dp.MaDatPhong
JOIN KHACH_HANG kh ON dp.MaKH = kh.MaKH
JOIN PHONG p ON dp.MaPhong = p.MaPhong
JOIN KHACH_SAN ks ON p.MaKS = ks.MaKS;

-- View xem thông tin tài khoản khách hàng
CREATE VIEW view_tai_khoan_khach_hang AS
SELECT 
    tk.MaTaiKhoan,
    tk.TenDangNhap,
    tk.LoaiTaiKhoan,
    tk.TrangThai,
    tk.NgayTao,
    kh.MaKH,
    kh.HoTen,
    kh.Email,
    kh.SoDienThoai
FROM TAI_KHOAN tk
LEFT JOIN KHACH_HANG kh ON tk.MaKH = kh.MaKH;

-- CẬP NHẬT THÔNG BÁO THÀNH CÔNG
SELECT '4 bảng mới đã được bổ sung thành công!' as ThongBao;
SELECT 'Bảng LIEN_HE_KHACH_SAN đã được tạo' as ThongBao;
SELECT 'Bảng DANH_GIA đã được tạo' as ThongBao;
SELECT 'Bảng TAI_KHOAN đã được tạo' as ThongBao;
SELECT 'Bảng LICH_SU_HOAT_DONG đã được tạo' as ThongBao;
SELECT COUNT(*) as 'Tổng số bảng trong hệ thống' FROM information_schema.tables 
WHERE table_schema = 'hotel_management';

-- Bảng PHONG
CREATE TABLE PHONG (
    MaPhong INT AUTO_INCREMENT PRIMARY KEY,
    MaKS INT,
    LoaiPhong VARCHAR(50) NOT NULL,
    GiaPhong DECIMAL(10,2) NOT NULL,
    TinhTrang ENUM('Trống','Đã đặt','Bảo trì') DEFAULT 'Trống',
    SucChua INT NOT NULL,
    AnhPhong VARCHAR(255),
    FOREIGN KEY (MaKS) REFERENCES KHACH_SAN(MaKS)
);

-- Bảng KHACH_HANG
CREATE TABLE KHACH_HANG (
    MaKH INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15),
    Email VARCHAR(100),
    CCCD VARCHAR(20),
    DiaChi VARCHAR(255),
    LoaiKH ENUM('Cá nhân','Doanh nghiệp','VIP') DEFAULT 'Cá nhân'
);

-- Bảng DAT_PHONG
CREATE TABLE DAT_PHONG (
    MaDatPhong INT AUTO_INCREMENT PRIMARY KEY,
    MaKH INT,
    MaPhong INT,
    NgayNhanPhong DATE NOT NULL,
    NgayTraPhong DATE NOT NULL,
    TongTien DECIMAL(10,2),
    TrangThai ENUM('Đã thanh toán','Chưa thanh toán','Hủy') DEFAULT 'Chưa thanh toán',
    FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH),
    FOREIGN KEY (MaPhong) REFERENCES PHONG(MaPhong)
);

-- Bảng DICH_VU
CREATE TABLE DICH_VU (
    MaDV INT AUTO_INCREMENT PRIMARY KEY,
    TenDV VARCHAR(100) NOT NULL,
    GiaDV DECIMAL(10,2) NOT NULL,
    MoTa TEXT
);

-- Bảng SU_DUNG_DV
CREATE TABLE SU_DUNG_DV (
    MaSuDung INT AUTO_INCREMENT PRIMARY KEY,
    MaDatPhong INT,
    MaDV INT,
    SoLuong INT DEFAULT 1,
    ThanhTien DECIMAL(10,2),
    FOREIGN KEY (MaDatPhong) REFERENCES DAT_PHONG(MaDatPhong),
    FOREIGN KEY (MaDV) REFERENCES DICH_VU(MaDV)
);

-- CHÈN DỮ LIỆU MẪU

-- 1. Chèn dữ liệu KHU_VUC (10 khu vực du lịch nổi tiếng Việt Nam)
INSERT INTO KHU_VUC (TenKhuVuc, MoTa, ViTri) VALUES
('Sapa', 'Thị trấn vùng cao với khí hậu mát mẻ, ruộng bậc thang và văn hóa dân tộc độc đáo', 'Lào Cai'),
('Hạ Long', 'Vịnh biển nổi tiếng với hàng nghìn đảo đá vôi kỳ vĩ', 'Quảng Ninh'),
('Đà Nẵng', 'Thành phố biển xinh đẹp với nhiều bãi biển đẹp và cầu Vàng nổi tiếng', 'Đà Nẵng'),
('Hội An', 'Phố cổ với kiến trúc truyền thống được UNESCO công nhận', 'Quảng Nam'),
('Nha Trang', 'Thành phố biển với các resort sang trọng và đảo khỉ', 'Khánh Hòa'),
('Phú Quốc', 'Đảo ngọc với những bãi biển hoang sơ và rừng nguyên sinh', 'Kiên Giang'),
('Đà Lạt', 'Thành phố ngàn hoa với khí hậu se lạnh và kiến trúc Pháp', 'Lâm Đồng'),
('Phong Nha', 'Vườn quốc gia với hệ thống hang động lớn nhất thế giới', 'Quảng Bình'),
('Mũi Né', 'Bãi biển với những đồi cát đỏ độc đáo và là thiên đường lướt ván', 'Bình Thuận'),
('Cát Bà', 'Đảo lớn với vịnh Lan Hạ xinh đẹp và rừng nguyên sinh', 'Hải Phòng');

-- 2. Chèn dữ liệu KHACH_SAN (10 khách sạn ở 10 khu vực trên)
INSERT INTO KHACH_SAN (TenKS, DiaChi, SoSao, MaKhuVuc, MoTa, AnhDaiDien) VALUES
('Khách sạn Topas Sapa', 'Xã Tả Van, Huyện Sa Pa, Lào Cai', 5, 1, 'Khách sạn sang trọng với view ruộng bậc thang tuyệt đẹp', 'topas_sapa.jpg'),
('Vinpearl Resort Hạ Long', 'Đảo Rều, Thành phố Hạ Long, Quảng Ninh', 5, 2, 'Resort sang trọng với view vịnh Hạ Long', 'vinpearl_halong.jpg'),
('InterContinental Danang Sun Peninsula Resort', 'Bán đảo Sơn Trà, Đà Nẵng', 5, 3, 'Resort 5 sao với thiết kế độc đáo và view biển tuyệt đẹp', 'intercontinental_danang.jpg'),
('Anantara Hoi An Resort', 'Cẩm Châu, Hội An, Quảng Nam', 4, 4, 'Resort cổ điển bên dòng sông Thu Bồn thơ mộng', 'anantara_hoian.jpg'),
('Amanoi Resort Nha Trang', 'Vĩnh Hy, Ninh Thuận', 5, 5, 'Resort nghỉ dưỡng cao cấp với view vịnh đẹp', 'amanoi_nhatrang.jpg'),
('JW Marriott Phu Quoc Emerald Bay', 'Bãi Dài, Phú Quốc, Kiên Giang', 5, 6, 'Khách sạn sang trọng với kiến trúc độc đáo', 'jw_marriott_phuquoc.jpg'),
('Dalat Palace Heritage Hotel', 'Trần Phú, Đà Lạt, Lâm Đồng', 5, 7, 'Khách sạn cổ điển với kiến trúc Pháp độc đáo', 'dalat_palace.jpg'),
('Chay Lap Farmstay Phong Nha', 'Xã Sơn Trạch, Bố Trạch, Quảng Bình', 4, 8, 'Farmstay gần hang động với không gian thiên nhiên', 'chaylap_phongnha.jpg'),
('The Cliff Resort & Residences Mui Ne', 'Nguyễn Đình Chiểu, Mũi Né, Bình Thuận', 5, 9, 'Resort với view biển và đồi cát đỏ', 'cliff_muine.jpg'),
('Cat Ba Resort', 'Đường 1/4, Cát Bà, Hải Phòng', 4, 10, 'Resort với view vịnh Lan Hạ tuyệt đẹp', 'catba_resort.jpg');

-- 3. Chèn dữ liệu PHONG (3-5 phòng mỗi khách sạn)
INSERT INTO PHONG (MaKS, LoaiPhong, GiaPhong, TinhTrang, SucChua, AnhPhong) VALUES
-- Phòng cho KS Sapa (MaKS=1)
(1, 'Deluxe Mountain View', 2500000, 'Trống', 2, 'deluxe_mountain.jpg'),
(1, 'Superior Room', 1800000, 'Trống', 2, 'superior_room.jpg'),
(1, 'Family Suite', 3500000, 'Trống', 4, 'family_suite.jpg'),

-- Phòng cho KS Hạ Long (MaKS=2)
(2, 'Ocean View Suite', 4500000, 'Trống', 2, 'ocean_view.jpg'),
(2, 'Presidential Villa', 12000000, 'Trống', 6, 'presidential_villa.jpg'),
(2, 'Deluxe Room', 3200000, 'Trống', 2, 'deluxe_room.jpg'),

-- Phòng cho KS Đà Nẵng (MaKS=3)
(3, 'Beach Front Villa', 8500000, 'Trống', 4, 'beach_villa.jpg'),
(3, 'Ocean Pool Villa', 6500000, 'Trống', 2, 'pool_villa.jpg'),
(3, 'Garden View Room', 2800000, 'Trống', 2, 'garden_view.jpg'),

-- Phòng cho KS Hội An (MaKS=4)
(4, 'River View Suite', 3200000, 'Trống', 2, 'river_view.jpg'),
(4, 'Garden Villa', 4200000, 'Trống', 4, 'garden_villa.jpg'),
(4, 'Superior Room', 1900000, 'Trống', 2, 'superior_hotel.jpg'),

-- Phòng cho KS Nha Trang (MaKS=5)
(5, 'Hill Top Villa', 9500000, 'Trống', 4, 'hill_villa.jpg'),
(5, 'Ocean View Room', 5200000, 'Trống', 2, 'ocean_room.jpg'),
(5, 'Wellness Suite', 3800000, 'Trống', 2, 'wellness_suite.jpg'),

-- Phòng cho KS Phú Quốc (MaKS=6)
(6, 'Emerald Bay Suite', 7500000, 'Trống', 2, 'emerald_suite.jpg'),
(6, 'Beach Front Room', 5500000, 'Trống', 2, 'beach_front.jpg'),
(6, 'Family Room', 4800000, 'Trống', 4, 'family_room.jpg'),

-- Phòng cho KS Đà Lạt (MaKS=7)
(7, 'Heritage Suite', 3500000, 'Trống', 2, 'heritage_suite.jpg'),
(7, 'Garden View Room', 2200000, 'Trống', 2, 'garden_room.jpg'),
(7, 'Executive Room', 2800000, 'Trống', 2, 'executive_room.jpg'),

-- Phòng cho KS Phong Nha (MaKS=8)
(8, 'Farmstay Bungalow', 1500000, 'Trống', 2, 'bungalow.jpg'),
(8, 'Family Bungalow', 2200000, 'Trống', 4, 'family_bungalow.jpg'),
(8, 'River View Room', 1800000, 'Trống', 2, 'river_room.jpg'),

-- Phòng cho KS Mũi Né (MaKS=9)
(9, 'Sea View Suite', 3800000, 'Trống', 2, 'sea_view.jpg'),
(9, 'Pool Access Room', 4500000, 'Trống', 2, 'pool_access.jpg'),
(9, 'Garden Room', 2500000, 'Trống', 2, 'garden_room2.jpg'),

-- Phòng cho KS Cát Bà (MaKS=10)
(10, 'Bay View Room', 2800000, 'Trống', 2, 'bay_view.jpg'),
(10, 'Superior Room', 1900000, 'Trống', 2, 'superior_room2.jpg'),
(10, 'Family Suite', 3200000, 'Trống', 4, 'family_suite2.jpg');

-- 4. Chèn dữ liệu KHACH_HANG
INSERT INTO KHACH_HANG (HoTen, SoDienThoai, Email, CCCD, DiaChi, LoaiKH) VALUES
('Nguyễn Văn An', '0912345678', 'nguyenvanan@gmail.com', '001123456789', 'Hà Nội', 'Cá nhân'),
('Trần Thị Bình', '0923456789', 'tranthibinh@yahoo.com', '001123456790', 'TP.HCM', 'Cá nhân'),
('Lê Văn Cường', '0934567890', 'levancuong@gmail.com', '001123456791', 'Đà Nẵng', 'Doanh nghiệp'),
('Phạm Thị Dung', '0945678901', 'phamthidung@gmail.com', '001123456792', 'Hải Phòng', 'VIP'),
('Hoàng Văn Đức', '0956789012', 'hoangvanduc@company.com', '001123456793', 'Cần Thơ', 'Doanh nghiệp'),
('Vũ Thị Hương', '0967890123', 'vuthihuong@gmail.com', '001123456794', 'Nha Trang', 'Cá nhân'),
('Đặng Văn Hùng', '0978901234', 'dangvanhung@gmail.com', '001123456795', 'Quảng Ninh', 'Cá nhân'),
('Bùi Thị Lan', '0989012345', 'buithilan@yahoo.com', '001123456796', 'Huế', 'VIP'),
('Mai Văn Minh', '0990123456', 'maivanminh@gmail.com', '001123456797', 'Vũng Tàu', 'Doanh nghiệp'),
('Lý Thị Nga', '0901234567', 'lythinga@gmail.com', '001123456798', 'Đà Lạt', 'Cá nhân');

-- 5. Chèn dữ liệu DICH_VU
INSERT INTO DICH_VU (TenDV, GiaDV, MoTa) VALUES
('Buffet sáng', 250000, 'Buffet sáng với đa dạng món ăn Á - Âu'),
('Massage thư giãn', 500000, 'Massage toàn thân 60 phút'),
('Thuê xe đạp', 100000, 'Thuê xe đạp trong ngày'),
('Tour tham quan', 800000, 'Tour tham quan địa điểm nổi tiếng'),
('Dịch vụ spa', 1200000, 'Gói spa cao cấp 120 phút'),
('Đưa đón sân bay', 350000, 'Dịch vụ đưa đón sân bay'),
('Thuê ô tô', 1500000, 'Thuê ô tô 7 chỗ có tài xế'),
('Bể bơi', 0, 'Sử dụng bể bơi (miễn phí)'),
('Phòng gym', 0, 'Sử dụng phòng gym (miễn phí)'),
('Dịch vụ giặt ủi', 150000, 'Giặt ủi theo kg');

-- 6. Chèn dữ liệu DAT_PHONG (một số đặt phòng mẫu)
INSERT INTO DAT_PHONG (MaKH, MaPhong, NgayNhanPhong, NgayTraPhong, TongTien, TrangThai) VALUES
(1, 1, '2024-01-15', '2024-01-18', 7500000, 'Đã thanh toán'),
(2, 5, '2024-01-20', '2024-01-22', 9000000, 'Chưa thanh toán'),
(3, 10, '2024-01-25', '2024-01-27', 6400000, 'Đã thanh toán'),
(4, 15, '2024-02-01', '2024-02-05', 38000000, 'Chưa thanh toán');

-- 7. Chèn dữ liệu SU_DUNG_DV
INSERT INTO SU_DUNG_DV (MaDatPhong, MaDV, SoLuong, ThanhTien) VALUES
(1, 1, 3, 750000),
(1, 2, 2, 1000000),
(1, 4, 1, 800000),
(2, 1, 2, 500000),
(2, 6, 1, 350000),
(3, 1, 2, 500000),
(3, 3, 2, 200000);

-- Tạo các index để tối ưu hiệu suất
CREATE INDEX idx_phong_maks ON PHONG(MaKS);
CREATE INDEX idx_datphong_makh ON DAT_PHONG(MaKH);
CREATE INDEX idx_datphong_maphong ON DAT_PHONG(MaPhong);
CREATE INDEX idx_sudungdv_madatphong ON SU_DUNG_DV(MaDatPhong);

-- Tạo view để xem thông tin đặt phòng chi tiết
CREATE VIEW view_dat_phong_chi_tiet AS
SELECT 
    dp.MaDatPhong,
    kh.HoTen,
    kh.SoDienThoai,
    ks.TenKS,
    p.LoaiPhong,
    p.GiaPhong,
    dp.NgayNhanPhong,
    dp.NgayTraPhong,
    dp.TongTien,
    dp.TrangThai,
    DATEDIFF(dp.NgayTraPhong, dp.NgayNhanPhong) as SoDem
FROM DAT_PHONG dp
JOIN KHACH_HANG kh ON dp.MaKH = kh.MaKH
JOIN PHONG p ON dp.MaPhong = p.MaPhong
JOIN KHACH_SAN ks ON p.MaKS = ks.MaKS;

-- Hiển thị thông báo thành công
SELECT 'Database hotel_management đã được tạo thành công!' as ThongBao;
SELECT '10 khu vực du lịch đã được thêm' as ThongBao;
SELECT '10 khách sạn đã được thêm' as ThongBao;
SELECT COUNT(*) as 'Tổng số phòng' FROM PHONG;
SELECT COUNT(*) as 'Tổng số khách hàng' FROM KHACH_HANG;
