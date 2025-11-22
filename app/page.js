"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  // --- 1. LOGIC TABS (Giữ nguyên) ---
  const [activeTab, setActiveTab] = useState("chantilly");
  const tabImages = {
    chantilly:
      "https://digital.ihg.com/is/image/ihg/ic-brand-refresh-homepg-hero-box-carousel-1-lvp-1440x636",
    bellevue:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1600&auto=format&fit=crop",
    hayman:
      "https://digital.ihg.com/is/image/ihg/ic-brand-refresh-homepg-hero-box-carousel-3-lvp-1440x636",
    dominica:
      "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1600&auto=format&fit=crop",
  };

  // --- 2. LOGIC POPUP LOGIN ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // --- 3. LOGIC ẨN NÚT BOOK NOW KHI CUỘN ---
  const [showBookBtn, setShowBookBtn] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowBookBtn(false);
      } else {
        setShowBookBtn(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* MODAL LOGIN */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100 py-4 transition-all">
        <div className="max-w-[95%] mx-auto flex justify-between items-center px-5">
          <Link
            href="/"
            className="font-serif text-xl font-semibold uppercase tracking-widest text-primary hover:opacity-80 transition"
          >
            InterContinental
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-6 items-center text-xs font-medium uppercase tracking-widest text-primary">
              {[
                "Destinations",
                "Experience",
                "Residences",
                "Offers",
                "Loyalty",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="relative pb-1 hover:text-accent transition-colors group"
                  >
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 border-l border-gray-200 pl-8 ml-2">
              {/* Nút Sign In */}
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

              {/* Nút Book Now (Ẩn khi cuộn) */}
              <div
                className={`transition-all duration-500 ease-in-out transform ${
                  showBookBtn
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10 pointer-events-none"
                }`}
              >
                <Link
                  href="#booking"
                  className="bg-accent text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-[#85604d] transition-all shadow-md block whitespace-nowrap"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* 2. HERO SECTION (ẢNH MỚI + ÍT CHỮ HƠN) */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-gray-900">
        {/* ẢNH NỀN MỚI: Maldives sang trọng hơn */}
        <Image
          src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1920&auto=format&fit=crop"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />

        {/* LỚP PHỦ: Giảm độ tối xuống một chút (bg-black/30) để ảnh mới rực rỡ hơn */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* HERO TEXT TỐI GIẢN */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5 z-10 mt-[-40px]">
          {/* Chỉ giữ lại Tiêu đề chính và một dòng mô tả siêu ngắn */}
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-none mb-6 animate-fade-in-up">
            The <br /> InterContinental Life
          </h1>
          <p className="text-base md:text-xl font-light tracking-[3px] max-w-xl opacity-90 animate-fade-in-up delay-200 uppercase">
            Luxury without limits.
          </p>
        </div>
      </div>

      {/* 3. BOOKING BAR */}
      <div
        className="relative z-30 -mt-[50px] px-5 scroll-mt-[200px]"
        id="booking"
      >
        <div className="max-w-standard mx-auto bg-white shadow-2xl rounded-sm p-6 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 w-full border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:px-4">
            <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
              DESTINATION
            </label>
            <input
              type="text"
              placeholder="Where to?"
              className="w-full font-serif text-lg text-primary outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="flex-1 w-full border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:px-4">
            <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
              DATES
            </label>
            <div className="flex gap-4 items-center font-serif text-lg text-primary">
              <input
                type="text"
                placeholder="Check-in"
                onFocus={(e) => (e.target.type = "date")}
                className="w-full outline-none cursor-pointer"
              />
              <span className="text-gray-300">—</span>
              <input
                type="text"
                placeholder="Check-out"
                onFocus={(e) => (e.target.type = "date")}
                className="w-full outline-none cursor-pointer"
              />
            </div>
          </div>
          <div className="flex-1 w-full border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:px-4">
            <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
              GUESTS
            </label>
            <select className="w-full font-serif text-lg text-primary outline-none bg-transparent cursor-pointer">
              <option>1 Room, 2 Guests</option>
              <option>2 Rooms, 4 Guests</option>
            </select>
          </div>
          <button className="w-full lg:w-auto bg-accent text-white font-bold uppercase tracking-widest px-10 py-4 hover:bg-[#85604d] transition-all shadow-lg text-sm">
            Search
          </button>
        </div>
      </div>

      {/* 4. INTRO TEXT */}
      <section className="pt-20 pb-12 px-5">
        <div className="max-w-[90%] mx-auto text-left">
          <h1 className="font-serif text-4xl lg:text-5xl text-primary mb-6 leading-tight">
            Opening Doors to a <br /> World of Fascination
          </h1>
          <p className="text-lg text-secondary max-w-4xl mb-10 leading-relaxed font-light">
            We believe travel is more than a destination. It’s a journey that
            expands minds, connects cultures, and ignites possibilities. As the
            pioneers of luxury travel, InterContinental Hotels & Resorts invites
            you into a world where extraordinary things happen.
          </p>
          <h2 className="font-serif text-2xl text-primary border-b border-gray-200 pb-3 inline-block">
            Discover indulgent escapes in remarkable destinations
          </h2>
        </div>
      </section>

      {/* 5. TABS SECTION */}
      <section className="pb-16 px-5">
        <div className="max-w-[90%] mx-auto">
          <div className="flex flex-wrap justify-center gap-8 mb-8 border-b border-gray-100 pb-2">
            {["chantilly", "bellevue", "hayman", "dominica"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium uppercase tracking-[2px] transition-all ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-accent"
                    : "text-gray-400 hover:text-primary"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full h-[600px] bg-gray-100 overflow-hidden group">
            <Image
              src={tabImages[activeTab]}
              alt="Destination"
              fill
              className="object-cover transition-transform duration-700"
            />
            <div className="absolute top-1/2 right-10 lg:right-20 transform -translate-y-1/2 bg-white p-10 lg:p-14 max-w-md shadow-xl">
              <div className="text-xs font-bold text-gray-400 tracking-[3px] mb-4 uppercase">
                {activeTab}, Location
              </div>
              <h3 className="font-serif text-3xl lg:text-4xl text-primary mb-6 leading-tight">
                {activeTab === "chantilly" &&
                  "InterContinental Chantilly Chateau Mont Royal"}
                {activeTab === "bellevue" &&
                  "InterContinental Seattle Bellevue"}
                {activeTab === "hayman" &&
                  "InterContinental Hayman Island Resort"}
                {activeTab === "dominica" &&
                  "InterContinental Dominica Cabrits Resort"}
              </h3>
              <p className="text-secondary mb-8 font-light text-sm leading-relaxed">
                Experience the untouched nature with luxury amenities and
                world-class service tailored just for you.
              </p>
              <a
                href="#"
                className="text-sm font-bold text-accent uppercase tracking-widest border-b border-accent pb-1 hover:text-primary hover:border-primary transition-colors"
              >
                Explore Hotel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SPA SECTION */}
      <section className="py-8 bg-white">
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 text-left">
            <span className="block text-xs font-bold text-gray-500 tracking-[4px] mb-4">
              REJUVENATE YOUR SENSES
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-6 leading-tight">
              Exceptional Experiences <br /> Around the World
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-8 max-w-xl">
              Unlock exclusive insider access to the world’s most celebrated
              wellness moments. We invite you behind the scenes of incredible
              experiences with moments of cultural discovery and natural
              healing.
            </p>
            <a
              href="#"
              className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all"
            >
              Discover More
            </a>
          </div>
          <div className="lg:w-1/2 flex gap-5">
            <div className="flex flex-col gap-5 w-1/2">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&h=400&fit=crop"
                className="w-full h-60 object-cover"
                alt="spa1"
              />
              <img
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&h=600&fit=crop"
                className="w-full h-80 object-cover"
                alt="spa2"
              />
            </div>
            <div className="flex flex-col gap-5 w-1/2 mt-16">
              <img
                src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600&h=600&fit=crop"
                className="w-full h-80 object-cover"
                alt="spa3"
              />
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&h=400&fit=crop"
                className="w-full h-60 object-cover"
                alt="spa4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXPERIENCE SECTION */}
      <section className="py-8 bg-white">
        <div className="max-w-[90%] mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <img
              src="https://www.angsana.com/_next/image?url=https%3A%2F%2Fwww.angsana.com%2Fassets%2F2023-03%2F12.%20The%20Rainmist%20Experience.jpg&w=1920&q=75"
              alt="Experience"
              className="w-full h-[550px] object-cover shadow-sm"
            />
          </div>
          <div className="lg:w-1/2 text-left lg:pl-10">
            <span className="block text-xs font-bold text-gray-500 tracking-[4px] mb-4">
              THE RAINMIST EXPERIENCE
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-6 leading-tight">
              Incredible occasions for <br /> precious memories
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-8">
              Placing you at the heart of every celebration. From intimate
              dinners to joyful anniversaries or lively weekender, we curate
              your special occasion and transform it into something incredible.
            </p>
            <a
              href="#"
              className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all"
            >
              Find Out More
            </a>
          </div>
        </div>
      </section>

      {/* 8. AMBASSADOR SECTION */}
      <section className="py-8 bg-white">
        <div className="max-w-[96%] mx-auto relative lg:h-[700px] flex flex-col lg:block">
          <Image
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1920&auto=format&fit=crop"
            alt="Ambassador"
            fill
            className="object-cover relative lg:absolute inset-0 h-[500px] lg:h-full w-full"
          />
          <div className="relative lg:absolute top-0 lg:top-1/2 right-0 lg:right-[8%] lg:transform lg:-translate-y-1/2 bg-white p-10 lg:p-16 max-w-xl shadow-none lg:shadow-xl mt-[-50px] lg:mt-0 mx-5 lg:mx-0 border border-gray-100 lg:border-none">
            <h2 className="font-serif text-3xl lg:text-4xl text-primary mb-6 leading-tight">
              InterContinental <br /> Ambassador
            </h2>
            <p className="text-base text-secondary font-light leading-loose mb-8">
              Turn every trip into something extraordinary. Elevate your stay
              with our loyalty program and take advantage of exclusive benefits
              available at over 220 destinations worldwide.
            </p>
            <a
              href="#"
              className="inline-block border border-primary px-8 py-4 text-[10px] font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all"
            >
              More Rewards
            </a>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#111] text-gray-400 py-16 mt-8">
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row justify-between gap-10">
          <div>
            <h3 className="font-serif text-2xl text-white mb-4">
              InterContinental
            </h3>
            <p className="text-sm font-light">Luxury Resorts & Hotels.</p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="text-white font-serif mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-serif mb-4 text-sm">Help</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
