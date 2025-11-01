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
        <li><a href="#">Máy bay + Khách sạn</a></li>
        <li><a href="#">Chỗ ở</a></li>
        <li><a href="#">Vé máy bay</a></li>
        <li><a href="#">Hoạt động</a></li>
        <li><a href="#">Phiếu giảm giá</a></li>
      </ul>
    </nav>
    <div class="auth-buttons">
      <a href="#">Đăng nhập</a>
      <button>Tạo tài khoản</button>
    </div>
  </header>

  <!--  BANNER  -->
  <section class="hero">
    <img src="images/banner.jpg" alt="Ảnh bãi biển" />
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
        </div>

        <div id="hotel" class="hidden">
          <form>
            <input type="text" placeholder="Nhập điểm đến hoặc tên khách sạn">
            <input type="date">
            <input type="date">
            <div class="guest-room-box">
                <div id="guestRoomDisplay">Người, Phòng</div>
                <div id="guestRoomPanel" class="hidden">
                  <div class="option">
                    <span>Người</span>
                    <div class="counter">
                      <button type="button" class="minus" data-type="adult">-</button>
                      <span id="adultCount">0</span>
                      <button type="button" class="plus" data-type="adult">+</button>
                    </div>
                  </div>
                  <div class="option">
                    <span>Phòng</span>
                    <div class="counter">
                      <button type="button" class="minus" data-type="room">-</button>
                      <span id="roomCount">0</span>
                      <button type="button" class="plus" data-type="room">+</button>
                    </div>
                  </div>
                  <button id="doneBtn">Xong</button>
                </div>
              </div>
            <button>Tìm</button>
          </form>
        </div>

        <div id="flight" class="hidden">
          <form>
            <input type="text" placeholder="Điểm đi">
            <input type="text" placeholder="Điểm đến">
            <input type="date">
            <div class="guest-room-box">
                            <div id="guestFlightDisplay">Người</div>
                            <div id="guestRoomPanel" class="hidden">
                              <div class="option">
                                <span>Người</span>
                                <div class="counter">
                                  <button type="button" class="minus" data-type="adult">-</button>
                                  <span id="adultCount">0</span>
                                  <button type="button" class="plus" data-type="adult">+</button>
                                </div>
                              </div>
                              </div>
                              <button id="doneBtn">Xong</button>
                            </div>
            <button>Tìm chuyến bay</button>
          </form>
        </div>

        <div id="combo" class="tab-content">
          <p>Form combo máy bay + khách sạn ở đây...</p>
        </div>
      </div>
    </section>

  <!-- 4️⃣ DANH SÁCH ĐIỂM ĐẾN NỔI BẬT -->
  <section class="popular-destinations">
    <h3>Các điểm đến thu hút nhất Việt Nam</h3>
    <div class="destination-grid">
      <div class="destination-item">
        <img src="images/hanoi.jpg" alt="Hà Nội">
        <p>Hà Nội</p>
      </div>
      <div class="destination-item">
        <img src="images/hochiminh.jpg" alt="TP.HCM">
        <p>TP. Hồ Chí Minh</p>
      </div>
      <div class="destination-item">
        <img src="images/danang.jpg" alt="Đà Nẵng">
        <p>Đà Nẵng</p>
      </div>
    </div>
  </section>

  <!-- 5️⃣ FOOTER (Chân trang) -->
  <footer>
    <p>© 2025 EasyBooking. Thiết kế bởi bạn.</p>
  </footer>
  <script src="script.js"></script>
</body>

</html>
