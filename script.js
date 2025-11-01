document.addEventListener("DOMContentLoaded", () => {
  // --- 1️⃣ TAB SWITCHING (Khách sạn / Vé máy bay / Combo) ---
  const tabs = document.querySelectorAll(".tab");
  const hotel = document.getElementById("hotel");
  const flight = document.getElementById("flight");
  const combo = document.getElementById("combo");

  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      // Xóa active khỏi tất cả tab
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Ẩn tất cả form
      [hotel, flight, combo].forEach(f => f.classList.add("hidden"));

      // Hiện form tương ứng
      const target = tab.textContent.trim().toLowerCase();
      if (target.includes("khách sạn")) hotel.classList.remove("hidden");
      else if (target.includes("vé máy bay")) flight.classList.remove("hidden");
      else combo.classList.remove("hidden");
    });
  });

  // Mặc định chỉ hiển thị tab đầu tiên
  hotel.classList.remove("hidden");
  flight.classList.add("hidden");
  combo.classList.add("hidden");

  // --- 2️⃣ GUEST & ROOM SELECTOR ---
  const display = document.getElementById("guestRoomDisplay");
  const panel = document.getElementById("guestRoomPanel");
  const doneBtn = document.getElementById("doneBtn");
  const plusButtons = document.querySelectorAll(".plus");
  const minusButtons = document.querySelectorAll(".minus");

  let adultCount = 2;
  let roomCount = 1;

  function updateDisplay() {
    document.getElementById("adultCount").textContent = adultCount;
    document.getElementById("roomCount").textContent = roomCount;
    display.textContent = `${adultCount} người lớn · ${roomCount} phòng`;
  }

  if (display && panel) {
    display.addEventListener("click", () => {
      panel.classList.toggle("hidden");
    });
  }

  if (doneBtn && panel) {
    doneBtn.addEventListener("click", () => {
      panel.classList.add("hidden");
    });
  }

  plusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      if (type === "adult") adultCount++;
      else if (type === "room") roomCount++;
      updateDisplay();
    });
  });

  minusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      if (type === "adult" && adultCount > 1) adultCount--;
      else if (type === "room" && roomCount > 1) roomCount--;
      updateDisplay();
    });
  });

  // Cập nhật ban đầu
  updateDisplay();
});
