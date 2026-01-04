"use client";

import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBar from "@/components/BookingBar";
import Chatbot from "@/components/chatbot/Chatbot";

import { BookingProvider, useBooking } from "@/context/BookingContext";
import { AuthProvider } from "./context/AuthContext";
import { usePathname } from "next/navigation";

/* ================= FONT CONFIG ================= */
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

/* ================= INNER LAYOUT ================= */
function InnerLayout({ children }) {
  const pathname = usePathname();
  const { isBookingOpen } = useBooking();
  const isHomePage = pathname === "/";

  return (
    <>
      <Header />

      {/* BOOKING BAR (KHÔNG HIỂN THỊ Ở HOME) */}
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

      {/* MAIN CONTENT */}
      <div className="flex-grow">{children}</div>

      <Footer />
    </>
  );
}

/* ================= ROOT LAYOUT ================= */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>

      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} font-sans text-primary bg-white antialiased flex flex-col min-h-screen relative`}
      >
        <AuthProvider>
          <BookingProvider>
            <InnerLayout>{children}</InnerLayout>

            {/* ===== CHATBOT GLOBAL (ĐÚNG CHỖ) ===== */}
            <Chatbot />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
