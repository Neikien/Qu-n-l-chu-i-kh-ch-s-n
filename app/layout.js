"use client";

import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBar from "@/components/BookingBar";
import { BookingProvider, useBooking } from "@/context/BookingContext";
import { AuthProvider } from "./context/AuthContext";
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

// Component xử lý giao diện bao quanh (Header, Footer, BookingBar)
function GlobalBookingWrapper({ children }) {
  const pathname = usePathname();
  const { isBookingOpen } = useBooking();
  const isHomePage = pathname === "/";

  return (
    <body
      suppressHydrationWarning={true}
      className={`${inter.variable} ${playfair.variable} font-sans text-primary bg-white antialiased flex flex-col min-h-screen relative`}
    >
      <Header />

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

      <div className="flex-grow">{children}</div>
      <Footer />
    </body>
  );
}

// CHỈ GIỮ LẠI MỘT HÀM ROOTLAYOUT DUY NHẤT
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <AuthProvider>
        <BookingProvider>
          <GlobalBookingWrapper>{children}</GlobalBookingWrapper>
        </BookingProvider>
      </AuthProvider>
    </html>
  );
}