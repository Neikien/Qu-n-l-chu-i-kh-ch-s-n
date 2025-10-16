from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mysqldb import MySQL
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'hotel_management_secret_key_23001529'

# Cấu hình MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''  # Điền mật khẩu của bạn
app.config['MYSQL_DB'] = 'hotel_management'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

# MSV - Mã số sinh viên
MSV = '23001529'

# Trang chủ
@app.route('/')
def home():
    cur = mysql.connection.cursor()
    
    # Lấy thống kê
    cur.execute("SELECT COUNT(*) as total_hotels FROM KHACH_SAN")
    total_hotels = cur.fetchone()['total_hotels']
    
    cur.execute("SELECT COUNT(*) as total_rooms FROM PHONG")
    total_rooms = cur.fetchone()['total_rooms']
    
    cur.execute("SELECT COUNT(*) as available_rooms FROM PHONG WHERE TinhTrang = 'Trống'")
    available_rooms = cur.fetchone()['available_rooms']
    
    cur.execute("SELECT COUNT(*) as total_customers FROM KHACH_HANG")
    total_customers = cur.fetchone()['total_customers']
    
    # Lấy danh sách khách sạn nổi bật
    cur.execute("""
        SELECT ks.*, kv.TenKhuVuc 
        FROM KHACH_SAN ks 
        JOIN KHU_VUC kv ON ks.MaKhuVuc = kv.MaKhuVuc 
        LIMIT 6
    """)
    featured_hotels = cur.fetchall()
    
    cur.close()
    
    return render_template('index.html', 
                         msv=MSV,
                         total_hotels=total_hotels,
                         total_rooms=total_rooms,
                         available_rooms=available_rooms,
                         total_customers=total_customers,
                         featured_hotels=featured_hotels)

# QUẢN LÝ KHÁCH SẠN
@app.route(f'/khach_san_{MSV}')
def khach_san():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT ks.*, kv.TenKhuVuc 
        FROM KHACH_SAN ks 
        JOIN KHU_VUC kv ON ks.MaKhuVuc = kv.MaKhuVuc
        ORDER BY ks.MaKS
    """)
    khach_san = cur.fetchall()
    cur.close()
    return render_template('khach_san.html', khach_san=khach_san, msv=MSV)

@app.route(f'/them_khach_san_{MSV}', methods=['GET', 'POST'])
def them_khach_san():
    cur = mysql.connection.cursor()
    
    if request.method == 'POST':
        TenKS = request.form['TenKS']
        DiaChi = request.form['DiaChi']
        SoSao = request.form['SoSao']
        MaKhuVuc = request.form['MaKhuVuc']
        MoTa = request.form['MoTa']
        AnhDaiDien = request.form['AnhDaiDien']
        
        try:
            cur.execute(
                "INSERT INTO KHACH_SAN (TenKS, DiaChi, SoSao, MaKhuVuc, MoTa, AnhDaiDien) VALUES (%s, %s, %s, %s, %s, %s)",
                (TenKS, DiaChi, SoSao, MaKhuVuc, MoTa, AnhDaiDien)
            )
            mysql.connection.commit()
            flash('Thêm khách sạn thành công!', 'success')
            return redirect(url_for('khach_san'))
        except Exception as e:
            flash(f'Lỗi: {str(e)}', 'error')
        finally:
            cur.close()
    
    # Lấy danh sách khu vực cho dropdown
    cur.execute("SELECT * FROM KHU_VUC")
    khu_vuc = cur.fetchall()
    cur.close()
    
    return render_template('them_khach_san.html', khu_vuc=khu_vuc, msv=MSV)

# QUẢN LÝ PHÒNG
@app.route(f'/phong_{MSV}')
def phong():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT p.*, ks.TenKS, kv.TenKhuVuc 
        FROM PHONG p 
        JOIN KHACH_SAN ks ON p.MaKS = ks.MaKS 
        JOIN KHU_VUC kv ON ks.MaKhuVuc = kv.MaKhuVuc
        ORDER BY p.MaPhong
    """)
    phong = cur.fetchall()
    cur.close()
    return render_template('phong.html', phong=phong, msv=MSV)

@app.route(f'/them_phong_{MSV}', methods=['GET', 'POST'])
def them_phong():
    cur = mysql.connection.cursor()
    
    if request.method == 'POST':
        MaKS = request.form['MaKS']
        LoaiPhong = request.form['LoaiPhong']
        GiaPhong = request.form['GiaPhong']
        TinhTrang = request.form['TinhTrang']
        SucChua = request.form['SucChua']
        AnhPhong = request.form['AnhPhong']
        
        try:
            cur.execute(
                "INSERT INTO PHONG (MaKS, LoaiPhong, GiaPhong, TinhTrang, SucChua, AnhPhong) VALUES (%s, %s, %s, %s, %s, %s)",
                (MaKS, LoaiPhong, GiaPhong, TinhTrang, SucChua, AnhPhong)
            )
            mysql.connection.commit()
            flash('Thêm phòng thành công!', 'success')
            return redirect(url_for('phong'))
        except Exception as e:
            flash(f'Lỗi: {str(e)}', 'error')
        finally:
            cur.close()
    
    # Lấy danh sách khách sạn cho dropdown
    cur.execute("SELECT * FROM KHACH_SAN")
    khach_san = cur.fetchall()
    cur.close()
    
    return render_template('them_phong.html', khach_san=khach_san, msv=MSV)

# QUẢN LÝ KHÁCH HÀNG
@app.route(f'/khach_hang_{MSV}')
def khach_hang():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM KHACH_HANG ORDER BY MaKH")
    khach_hang = cur.fetchall()
    cur.close()
    return render_template('khach_hang.html', khach_hang=khach_hang, msv=MSV)

@app.route(f'/them_khach_hang_{MSV}', methods=['GET', 'POST'])
def them_khach_hang():
    if request.method == 'POST':
        HoTen = request.form['HoTen']
        SoDienThoai = request.form['SoDienThoai']
        Email = request.form['Email']
        CCCD = request.form['CCCD']
        DiaChi = request.form['DiaChi']
        LoaiKH = request.form['LoaiKH']
        
        cur = mysql.connection.cursor()
        try:
            cur.execute(
                "INSERT INTO KHACH_HANG (HoTen, SoDienThoai, Email, CCCD, DiaChi, LoaiKH) VALUES (%s, %s, %s, %s, %s, %s)",
                (HoTen, SoDienThoai, Email, CCCD, DiaChi, LoaiKH)
            )
            mysql.connection.commit()
            flash('Thêm khách hàng thành công!', 'success')
            return redirect(url_for('khach_hang'))
        except Exception as e:
            flash(f'Lỗi: {str(e)}', 'error')
        finally:
            cur.close()
    
    return render_template('them_khach_hang.html', msv=MSV)

# QUẢN LÝ ĐẶT PHÒNG
@app.route(f'/dat_phong_{MSV}')
def dat_phong():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT dp.*, kh.HoTen, p.LoaiPhong, ks.TenKS,
               DATEDIFF(dp.NgayTraPhong, dp.NgayNhanPhong) as SoDem
        FROM DAT_PHONG dp
        JOIN KHACH_HANG kh ON dp.MaKH = kh.MaKH
        JOIN PHONG p ON dp.MaPhong = p.MaPhong
        JOIN KHACH_SAN ks ON p.MaKS = ks.MaKS
        ORDER BY dp.MaDatPhong DESC
    """)
    dat_phong = cur.fetchall()
    cur.close()
    return render_template('dat_phong.html', dat_phong=dat_phong, msv=MSV)

@app.route(f'/them_dat_phong_{MSV}', methods=['GET', 'POST'])
def them_dat_phong():
    cur = mysql.connection.cursor()
    
    if request.method == 'POST':
        MaKH = request.form['MaKH']
        MaPhong = request.form['MaPhong']
        NgayNhanPhong = request.form['NgayNhanPhong']
        NgayTraPhong = request.form['NgayTraPhong']
        
        try:
            # Tính tổng tiền
            cur.execute("SELECT GiaPhong FROM PHONG WHERE MaPhong = %s", (MaPhong,))
            gia_phong = cur.fetchone()['GiaPhong']
            
            so_dem = (datetime.strptime(NgayTraPhong, '%Y-%m-%d') - datetime.strptime(NgayNhanPhong, '%Y-%m-%d')).days
            tong_tien = gia_phong * so_dem
            
            cur.execute(
                "INSERT INTO DAT_PHONG (MaKH, MaPhong, NgayNhanPhong, NgayTraPhong, TongTien) VALUES (%s, %s, %s, %s, %s)",
                (MaKH, MaPhong, NgayNhanPhong, NgayTraPhong, tong_tien)
            )
            
            # Cập nhật tình trạng phòng
            cur.execute("UPDATE PHONG SET TinhTrang = 'Đã đặt' WHERE MaPhong = %s", (MaPhong,))
            
            mysql.connection.commit()
            flash('Đặt phòng thành công!', 'success')
            return redirect(url_for('dat_phong'))
        except Exception as e:
            flash(f'Lỗi: {str(e)}', 'error')
        finally:
            cur.close()
    
    # Lấy danh sách khách hàng và phòng trống
    cur.execute("SELECT * FROM KHACH_HANG")
    khach_hang = cur.fetchall()
    
    cur.execute("SELECT p.*, ks.TenKS FROM PHONG p JOIN KHACH_SAN ks ON p.MaKS = ks.MaKS WHERE p.TinhTrang = 'Trống'")
    phong_trong = cur.fetchall()
    
    cur.close()
    
    return render_template('them_dat_phong.html', 
                         khach_hang=khach_hang, 
                         phong_trong=phong_trong, 
                         msv=MSV)

# QUẢN LÝ DỊCH VỤ
@app.route(f'/dich_vu_{MSV}')
def dich_vu():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM DICH_VU ORDER BY MaDV")
    dich_vu = cur.fetchall()
    cur.close()
    return render_template('dich_vu.html', dich_vu=dich_vu, msv=MSV)

@app.route(f'/them_dich_vu_{MSV}', methods=['GET', 'POST'])
def them_dich_vu():
    if request.method == 'POST':
        TenDV = request.form['TenDV']
        GiaDV = request.form['GiaDV']
        MoTa = request.form['MoTa']
        
        cur = mysql.connection.cursor()
        try:
            cur.execute(
                "INSERT INTO DICH_VU (TenDV, GiaDV, MoTa) VALUES (%s, %s, %s)",
                (TenDV, GiaDV, MoTa)
            )
            mysql.connection.commit()
            flash('Thêm dịch vụ thành công!', 'success')
            return redirect(url_for('dich_vu'))
        except Exception as e:
            flash(f'Lỗi: {str(e)}', 'error')
        finally:
            cur.close()
    
    return render_template('them_dich_vu.html', msv=MSV)

# SỬ DỤNG DỊCH VỤ
@app.route(f'/su_dung_dv_{MSV}')
def su_dung_dv():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT sd.*, dp.MaDatPhong, kh.HoTen, dv.TenDV, dv.GiaDV
        FROM SU_DUNG_DV sd
        JOIN DAT_PHONG dp ON sd.MaDatPhong = dp.MaDatPhong
        JOIN KHACH_HANG kh ON dp.MaKH = kh.MaKH
        JOIN DICH_VU dv ON sd.MaDV = dv.MaDV
        ORDER BY sd.MaSuDung DESC
    """)
    su_dung_dv = cur.fetchall()
    cur.close()
    return render_template('su_dung_dv.html', su_dung_dv=su_dung_dv, msv=MSV)

@app.route(f'/them_su_dung_dv_{MSV}', methods=['GET', 'POST'])
def them_su_dung_dv():
    cur = mysql.connection.cursor()
    
    if request.method == 'POST':
        MaDatPhong = request.form['MaDatPhong']
        MaDV = request.form['MaDV']
        SoLuong = request.form['SoLuong']
        
        try:
            # Tính thành tiền
            cur.execute("SELECT GiaDV FROM DICH_VU WHERE MaDV = %s", (MaDV,))
            gia_dv = cur.fetchone()['GiaDV']
            thanh_tien = gia_dv * int(SoLuong)
            
            cur.execute(
                "INSERT INTO SU_DUNG_DV (MaDatPhong, MaDV, SoLuong, ThanhTien) VALUES (%s, %s, %s, %s)",
                (MaDatPhong, MaDV, SoLuong, thanh_tien)
            )
            mysql.connection.commit()
            flash('Thêm sử dụng dịch vụ thành công!', 'success')
            return redirect(url_for('su_dung_dv'))
        except Exception as e:
            flash(f'Lỗi: {str(e)}', 'error')
        finally:
            cur.close()
    
    # Lấy danh sách đặt phòng và dịch vụ
    cur.execute("""
        SELECT dp.MaDatPhong, kh.HoTen, ks.TenKS 
        FROM DAT_PHONG dp
        JOIN KHACH_HANG kh ON dp.MaKH = kh.MaKH
        JOIN PHONG p ON dp.MaPhong = p.MaPhong
        JOIN KHACH_SAN ks ON p.MaKS = ks.MaKS
        WHERE dp.TrangThai != 'Hủy'
    """)
    dat_phong = cur.fetchall()
    
    cur.execute("SELECT * FROM DICH_VU")
    dich_vu = cur.fetchall()
    
    cur.close()
    
    return render_template('them_su_dung_dv.html', 
                         dat_phong=dat_phong, 
                         dich_vu=dich_vu, 
                         msv=MSV)

if __name__ == '__main__':
    app.run(debug=True, port=5001)