document.addEventListener("DOMContentLoaded", () => {
  // --- 1️⃣ TAB SWITCHING ---
  const tabs = document.querySelectorAll(".tab");
  const sections = {
    "khách sạn": document.getElementById("hotel"),
    "vé máy bay": document.getElementById("flight"),
    "máy bay + k.sạn": document.getElementById("combo"),
    "nhà và căn hộ": document.getElementById("house"),
    "đưa đón sân bay": document.getElementById("transport")
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      Object.values(sections).forEach(s => s.classList.add("hidden"));

      const key = tab.textContent.trim().toLowerCase();
      if (sections[key]) sections[key].classList.remove("hidden");
    });
  });

  // --- 2️⃣ GUEST & ROOM SELECTORS (chung cho mọi form) ---
  document.querySelectorAll(".guest-room-box").forEach(box => {
    const display = box.querySelector(".guest-display");
    const panel = box.querySelector(".guest-panel");
    const doneBtn = box.querySelector(".doneBtn");
    const plusBtns = box.querySelectorAll(".plus");
    const minusBtns = box.querySelectorAll(".minus");

    let adult = 0;
    let room = box.querySelector(".roomCount") ? 0 : null;

    function updateDisplay() {
      const adultSpan = box.querySelector(".adultCount");
      if (adultSpan) adultSpan.textContent = adult;
      const roomSpan = box.querySelector(".roomCount");
      if (roomSpan) roomSpan.textContent = room;

      if (room !== null)
        display.textContent = `${adult} người · ${room} phòng`;
      else
        display.textContent = `${adult} người`;
    }

    display.addEventListener("click", () => panel.classList.toggle("hidden"));
    doneBtn.addEventListener("click", () => panel.classList.add("hidden"));

    plusBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        if (type === "adult") adult++;
        if (type === "room" && room !== null) room++;
        updateDisplay();
      });
    });

    minusBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        if (type === "adult" && adult > 0) adult--;
        if (type === "room" && room !== null && room > 0) room--;
        updateDisplay();
      });
    });

    updateDisplay();
  });
});
