"use client";

import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBar from "@/components/BookingBar";
import { BookingProvider, useBooking } from "@/context/BookingContext";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600"],
});

// ... (Các phần import giữ nguyên)

function GlobalBookingWrapper({ children }) {
  const pathname = usePathname();
  const { isBookingOpen } = useBooking();

  // Xác định xem có phải trang chủ không
  const isHomePage = pathname === "/";

  return (
    <body
      suppressHydrationWarning={true}
      className={`${inter.variable} ${playfair.variable} font-sans text-primary bg-white antialiased flex flex-col min-h-screen relative`}
    >
      <Header />

      {/* --- SỬA ĐOẠN NÀY: GLOBAL BOOKING BAR (STYLE GIỐNG HOME) --- */}
      {!isHomePage && (
        // Container bao ngoài: Fixed, Căn giữa, Animation mờ dần + trượt nhẹ
        <div
          className={`fixed top-[100px] left-0 w-full z-40 flex justify-center px-5 transition-all duration-500 ease-in-out transform ${
            isBookingOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0 pointer-events-none"
          }`}
        >
          {/* Khung giới hạn chiều rộng y hệt trang chủ */}
          <div className="w-full max-w-[1320px]">
            {/* Gọi BookingBar gốc, không cần ghi đè style (để nó tự có shadow, rounded, padding) */}
            <BookingBar id="global-booking" />
          </div>
        </div>
      )}

      <div className="flex-grow">{children}</div>
      <Footer />
    </body>
  );
}

// ... (Phần export default RootLayout giữ nguyên)

export default function RootLayout({ children }) {
  return (
    // THÊM suppressHydrationWarning VÀO CẢ ĐÂY CHO CHẮC
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <BookingProvider>
        <GlobalBookingWrapper>{children}</GlobalBookingWrapper>
      </BookingProvider>
    </html>
  );
}
