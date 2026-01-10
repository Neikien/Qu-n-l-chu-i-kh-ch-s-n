"use client";

import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBar from "@/components/BookingBar";
import { BookingProvider, useBooking } from "@/app/context/BookingContext";
import { AuthProvider } from "./context/AuthContext";
import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";

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

// Component con: Chỉ chịu trách nhiệm hiển thị Header, Footer và Logic BookingBar
function InnerLayout({ children }) {
  const pathname = usePathname();
  const { isBookingOpen } = useBooking();
  const isHomePage = pathname === "/";

  return (
    <>
      <Header />

      {/* Booking Bar Logic */}
      {/* Chỉ hiển thị nếu KHÔNG PHẢI trang chủ (vì trang chủ có cái to đùng rồi) */}
      {!isHomePage && (
        <div
          className={`fixed top-[100px] left-0 w-full z-40 flex justify-center px-5 transition-all duration-500 ease-in-out transform ${
            isBookingOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full max-w-[1320px]">
            <BookingBar id="global-booking" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow">{children}</div>
        <Chatbot />
      <Footer />
    </>
  );
}

// RootLayout: Chịu trách nhiệm cấu trúc HTML gốc
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>

      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${playfair.variable} font-sans text-primary bg-white antialiased flex flex-col min-h-screen relative`}
      >
        {/* AuthProvider bao bọc toàn bộ */}
        <AuthProvider>
          {/* BookingProvider bao bọc bên trong để InnerLayout dùng được useBooking */}
          <BookingProvider>
            <InnerLayout>{children}</InnerLayout>
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
