"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";

export default function Header() {
  const { user, logout } = useAuth();
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
    router.push("/booking");
  };

  // Hàm mở dropdown và đóng khi click ra ngoài
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

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
        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-semibold uppercase tracking-widest text-primary">
          InterContinental
        </Link>

        {/* Navigation */}
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

          {/* Right side functionality */}
          <div className="flex items-center gap-6 border-l border-gray-200 pl-10 ml-2">
            {user ? (
              // HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP
              <div className="relative user-dropdown">
                <button
                  onClick={handleDropdownToggle}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
                    {user.name?.charAt(0) || user.userName?.charAt(0) || "U"}
                  </div>
                  <span>{user.name || user.userName || "User"}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900">{user.name || user.userName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || user.userName}</p>
                      <p className="text-xs text-gray-500">{user.role || "VIP Member"}</p>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Hồ sơ cá nhân
                    </Link>
                    
                    <Link 
                      href="/my-bookings" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Đặt phòng của tôi
                    </Link>
                    
                    <button 
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                        router.push("/");
                      }} 
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // HIỂN THỊ KHI CHƯA ĐĂNG NHẬP
              <div className="flex items-center gap-4">
                <Link 
                  href="/register" 
                  className="text-xs font-bold uppercase tracking-widest text-primary hover:text-accent"
                >
                  Đăng ký
                </Link>
                
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent group"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Đăng nhập
                </Link>
              </div>
            )}

            {/* Book Now Button */}
            {showBookBtn && (
              <button
                onClick={handleBookNow}
                className="bg-accent text-white text-xs font-bold px-8 py-3 uppercase hover:bg-accent/90 transition-colors"
              >
                Book Now
              </button>
            )}
          </div>
        </nav>

        {/* Mobile menu button (optional) */}
        <button className="lg:hidden text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}