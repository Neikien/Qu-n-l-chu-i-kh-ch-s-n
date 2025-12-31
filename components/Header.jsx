"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext"; // Import Auth
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";

export default function Header() {
  const { user, logout } = useAuth(); // Lấy thông tin user
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const { toggleBooking } = useBooking();
  const [showBookBtn, setShowBookBtn] = useState(true);
  const menuItems = [
    { name: "Destinations", path: "/destinations" },
    { name: "Experience", path: "/experience" },
    { name: "Offers", path: "/offers" },
    { name: "Loyalty", path: "/loyalty" },
  ];

  const handleBookNow = (e) => {
    e.preventDefault();
    router.push("/booking"); // Chuyển hướng đến thư mục app/booking
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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 py-4 transition-all">
      <div className="max-w-[95%] mx-auto flex justify-between items-center px-5">
        <Link href="/" className="font-serif text-xl font-semibold uppercase tracking-widest text-primary">
          InterContinental
        </Link>

          <nav className="hidden lg:flex items-center gap-12">
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
            {user ? (
              // HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP
              <div className="relative group">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent"
                >
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded py-2 border border-gray-100 z-50">
                    <Link href="/profile" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Hồ sơ cá nhân</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              // HIỂN THỊ KHI CHƯA ĐĂNG NHẬP
              <Link href="/login" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent group">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Sign In
              </Link>
            )}

            <button
            onClick={handleBookNow}
            className="bg-accent text-white text-xs font-bold px-8 py-3 uppercase"
          >
            Book Now
          </button>
          </div>
        </nav>
      </div>
    </header>
  );
}