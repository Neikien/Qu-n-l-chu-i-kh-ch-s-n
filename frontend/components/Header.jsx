"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import { useBooking } from "@/context/BookingContext";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showBookBtn, setShowBookBtn] = useState(true);
  const pathname = usePathname();
  const { toggleBooking } = useBooking();

  // CẬP NHẬT MENU: Đã bỏ "Residences"
  const menuItems = [
    { name: "Destinations", path: "/destinations" },
    { name: "Experience", path: "/experience" },
    // { name: 'Residences', path: '#' }, <--- Đã xóa dòng này
    { name: "Offers", path: "/offers" },
    { name: "Loyalty", path: "/loyalty" },
  ];

  const handleBookNow = (e) => {
    e.preventDefault();
    if (pathname === "/") {
      const bookingSection = document.getElementById("booking");
      if (bookingSection) {
        const y =
          bookingSection.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      toggleBooking();
    }
  };

  useEffect(() => {
    if (pathname !== "/") {
      setShowBookBtn(true);
      return;
    }
    const handleScroll = () => {
      const bookingSection = document.getElementById("booking");
      if (bookingSection) {
        const rect = bookingSection.getBoundingClientRect();
        const navHeight = 80;
        const isScrolledPast = rect.bottom < navHeight;
        const isAtTop = rect.top > window.innerHeight - 200;

        if (isScrolledPast || isAtTop) setShowBookBtn(true);
        else setShowBookBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 py-4 transition-all">
        <div className="max-w-[95%] mx-auto flex justify-between items-center px-5">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-xl font-semibold uppercase tracking-widest text-primary hover:opacity-80 transition"
          >
            InterContinental
          </Link>

          <nav className="hidden lg:flex items-center gap-12">
            {" "}
            {/* Tăng gap tổng thể lên 12 */}
            {/* Menu List: Tăng gap-6 lên gap-10 cho thoáng */}
            <ul className="flex gap-10 items-center text-xs font-medium uppercase tracking-widest text-primary">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`relative pb-1 hover:text-accent transition-colors group ${
                      pathname === item.path ? "text-accent" : ""
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute left-0 bottom-0 h-[1px] bg-accent transition-all ${
                        pathname === item.path
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
            {/* Khu vực chức năng bên phải */}
            <div className="flex items-center gap-6 border-l border-gray-200 pl-10 ml-2">
              {" "}
              {/* Tăng padding left */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Sign In
              </button>
              <div
                className={`transition-all duration-500 ease-in-out transform ${
                  showBookBtn
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10 pointer-events-none"
                }`}
              >
                <button
                  onClick={handleBookNow}
                  className="bg-accent text-white text-xs font-bold uppercase tracking-widest px-8 py-3 hover:bg-[#85604d] transition-all shadow-md block whitespace-nowrap"
                >
                  Book Now
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
