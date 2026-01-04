"use client";

import { createContext, useContext, useState } from "react";
import { format } from "date-fns";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Khởi tạo ngày check-in (Hôm nay) và check-out (Ngày mai)
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // State lưu trữ thông tin tìm kiếm toàn cục
  const [bookingParams, setBookingParams] = useState({
    checkInDate: format(today, "yyyy-MM-dd"),
    checkOutDate: format(tomorrow, "yyyy-MM-dd"),
    rooms: 1,
    guests: 2,
    destination: "Hà Nội",
  });

  const updateBookingParams = (newParams) => {
    setBookingParams((prev) => ({ ...prev, ...newParams }));
  };

  const toggleBooking = () => setIsBookingOpen((prev) => !prev);
  const closeBooking = () => setIsBookingOpen(false);

  return (
    <BookingContext.Provider
      value={{
        isBookingOpen,
        toggleBooking,
        closeBooking,
        bookingParams,
        updateBookingParams,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
