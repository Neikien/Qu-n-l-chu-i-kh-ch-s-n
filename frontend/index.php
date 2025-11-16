<?php
// Xử lý dữ liệu form gửi lên
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $destination = $_POST["destination"];
    $checkin = $_POST["checkin"];
    $checkout = $_POST["checkout"];
    $adults = $_POST["adults"];

    echo "<div class='result-box'>
            <h3>Kết quả tìm kiếm</h3>
            <p>Điểm đến: <b>$destination</b></p>
            <p>Nhận phòng: <b>$checkin</b></p>
            <p>Trả phòng: <b>$checkout</b></p>
            <p>Số người lớn: <b>$adults</b></p>
          </div>";
}
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đặt phòng khách sạn</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <!-- 1️⃣ HEADER (Thanh điều hướng trên cùng) -->
  <header>
    <div class="logo">Hải Đăng Hotel</div>
    <nav class="navbar">
      <ul>
        <li><a href="#hotel">Khách sạn</a></li>
        <li><a href="#combo">Máy bay + Khách sạn</a></li>
        <li><a href="#house">Chỗ ở</a></li>
        <li><a href="#flight">Vé máy bay</a></li>
        <li><a href="#">Hoạt động</a></li>
        <li><a href="#transport">Đưa đón sân bay</a></li>
      </ul>
    </nav>
    <div class="auth-buttons">
      <a href="#">Đăng nhập</a>
      <button>Tạo tài khoản</button>
    </div>
  </header>

  <!--  BANNER  -->
  <section class="hero">
    <img src="images/bannerVietNam.jpg" alt="Ảnh du lịch Việt Nam" />
    <div class="hero-text">
      <h2>RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN “YÊU THƯƠNG”</h2>
    </div>
  </section>

  <!-- THANH TÌM KIẾM (Search bar chính giữa trang) -->
  <section class="search-section">
      <div class="search-box">
        <div class="tabs">
          <button class="tab active" onclick="openTab(event, 'hotel')">Khách sạn</button>
          <button class="tab" onclick="openTab(event, 'flight')">Vé máy bay</button>
          <button class="tab" onclick="openTab(event, 'combo')">Máy bay + K.sạn</button>
          <button class="tab" onclick="openTab(event, 'house')">Nhà và căn hộ</button>
          <button class="tab" onclick="openTab(event, 'transport')">Đưa đón sân bay</button>
        </div>
    <!-- BOX OPTION -->
        <!-- Khách sạn -->
        <div id="hotel" class="">
          <form>
            <input type="text" placeholder="Nhập điểm đến hoặc tên khách sạn">
            <input type="date">
            <input type="date">
            <div class="guest-room-box">
              <div class="guest-display">Người, Phòng</div>
              <div class="guest-panel hidden">
                <div class="option">
                  <span>Người</span>
                  <div class="counter">
                    <button type="button" class="minus" data-type="adult">-</button>
                    <span class="adultCount">0</span>
                    <button type="button" class="plus" data-type="adult">+</button>
                  </div>
                </div>
                <div class="option">
                  <span>Phòng</span>
                  <div class="counter">
                    <button type="button" class="minus" data-type="room">-</button>
                    <span class="roomCount">0</span>
                    <button type="button" class="plus" data-type="room">+</button>
                  </div>
                </div>
                <button type="button" class="doneBtn">Xong</button>
              </div>
            </div>
            <button>Tìm</button>
          </form>
        </div>
        <!-- Vé máy bay -->
        <div id="flight" class="hidden">
          <form>
            <input type="text" placeholder="Điểm đi">
            <input type="text" placeholder="Điểm đến">
            <input type ="date">
            <input type="date">
            <div class="guest-room-box">
              <div class="guest-display">Người</div>
              <div class="guest-panel hidden">
                <div class="option">
                  <span>Người</span>
                  <div class="counter">
                    <button type="button" class="minus" data-type="adult">-</button>
                    <span class="adultCount">0</span>
                    <button type="button" class="plus" data-type="adult">+</button>
                  </div>
                </div>
                <button type="button" class="doneBtn">Xong</button>
              </div>
            </div>
            <button>Tìm chuyến bay</button>
          </form>
        </div>
        <!-- 🧳 Combo -->
        <div id="combo" class="hidden">
             <form>
               <input type="text" placeholder="Điểm đến" >
               <input type="date" placeholder="Ngày đi" >
               <input type="date" placeholder="Ngày về" >
               <button>Tìm combo</button>
             </form>
           </div>
       <!-- 🏠 Nhà & căn hộ -->
         <div id="house" class="hidden">
           <form>
             <input type="text" placeholder="Thành phố hoặc tên căn hộ" required>
             <input type="date" placeholder="Ngày nhận phòng" required>
             <input type="date" placeholder="Ngày trả phòng" required>
             <button>Tìm chỗ ở</button>
           </form>
         </div>

         <!-- 🚗 Đưa đón sân bay -->
         <div id="transport" class="hidden">
           <form>
             <input type="text" placeholder="Sân bay hoặc điểm đón" required>
             <input type="text" placeholder="Điểm đến" required>
             <input type="date">
             <button>Đặt xe</button>
           </form>
         </div>
      </div>
    </section>

  <!-- 4️⃣ DANH SÁCH ĐIỂM ĐẾN NỔI BẬT -->
  <section class="popular-destinations">
    <h3>Các điểm đến thu hút nhất Việt Nam</h3>
    <div class="destination-grid">
      <div class="destination-item">
        <img src="images/LangBac.jpg" alt="Hà Nội">
        <p>Hà Nội</p>
      </div>
      <div class="destination-item">
        <img src="images/ChoBenThanh.jpg" alt="TP.HCM">
        <p>TP. Hồ Chí Minh</p>
      </div>
      <div class="destination-item">
        <img src="images/VinhHaLong.jpg" alt="Vịnh Hạ Long">
        <p>Hạ Long</p>
      </div>
        <div class="destination-item">
          <img src="images/HoiAn.jpg" alt="Hội An">
          <p>Hội An</p>
        </div>
        <div class="destination-item">
                  <img src="images/DaLat.jpg" alt="Đà Lạt">
                  <p>Đà Lạt</p>
        </div>
    </div>
  </section>

  <!-- FOOTER (Chân trang) -->
  <footer>
    <p>© 2025 HotelBooking. Hotel của Đăng nhé.</p>
  </footer>
  <script src="script.js"></script>
</body>

</html>
