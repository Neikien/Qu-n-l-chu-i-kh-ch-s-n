"use client";
import BookingBar from "@/components/BookingBar";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  // --- LOGIC SLIDER HERO ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1920&auto=format&fit=crop",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // --- LOGIC TABS ---
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

  // --- LOGIC POPUP LOGIN ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // (Đã xóa logic showBookBtn vì nó đã chuyển sang component Header rồi)

  return (
    <main className="min-h-screen bg-white">
      {/* MODAL LOGIN */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {/* --- ĐÃ XÓA HEADER Ở ĐÂY (Layout tự thêm vào) --- */}
      {/* 1. HERO SECTION */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1920&auto=format&fit=crop"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5 z-10 mt-[-40px]">
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-none mb-6 animate-fade-in-up">
            The <br /> InterContinental Life
          </h1>
          <p className="text-base md:text-xl font-light tracking-[3px] max-w-xl opacity-90 animate-fade-in-up delay-200 uppercase">
            Luxury without limits.
          </p>
        </div>
      </div>
      {/* 2. BOOKING BAR */};{/* 3. BOOKING BAR */}
      <div
        className="relative z-30 -mt-[50px] px-5 scroll-mt-[200px]"
        id="booking"
      >
        <div className="max-w-standard mx-auto">
          <BookingBar />
        </div>
      </div>
      {/* 3. INTRO TEXT */}
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
      {/* 4. TABS SECTION */}
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
                InterContinental Resort
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
      {/* 6. SPA SECTION (NỀN XÁM SANG TRỌNG) */}
      <section className="py-12 bg-white">
        {" "}
        {/* Giảm py tổng thể */}
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row h-auto lg:h-[650px]">
          {/* Cột Chữ (Bên Trái) - CÓ NỀN XÁM */}
          <div className="lg:w-1/2 bg-[#f9f9f9] flex flex-col justify-center p-10 lg:p-20 text-left order-2 lg:order-1">
            <span className="block text-xs font-bold text-gray-500 tracking-[4px] mb-6">
              REJUVENATE YOUR SENSES
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-8 leading-tight">
              Angsana Spa Signatures
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-10">
              Unlock exclusive insider access to the world’s most celebrated
              wellness moments. We invite you behind the scenes of incredible
              experiences with moments of cultural discovery.
            </p>
            <a
              href="/spa"
              className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all w-fit"
            >
              Discover More
            </a>
          </div>

          {/* Cột Ảnh (Bên Phải) - KHÔNG CÒN GAP */}
          <div className="lg:w-1/2 relative h-[400px] lg:h-full order-1 lg:order-2">
            <div className="flex gap-0 h-full w-full">
              {/* Giữ nguyên layout 2 ảnh hoặc đổi thành 1 ảnh to tùy bạn, ở đây tôi để 1 ảnh to cho khớp với style nền xám */}
              <Image
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop"
                alt="Spa"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {/* 7. EXPERIENCE SECTION (NỀN XÁM - ĐẢO NGƯỢC) */}
      <section className="py-12 bg-white">
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row h-auto lg:h-[650px]">
          {/* Cột Ảnh (Bên Trái) */}
          <div className="lg:w-1/2 relative h-[400px] lg:h-full">
            <Image
              src="https://www.angsana.com/_next/image?url=https%3A%2F%2Fwww.angsana.com%2Fassets%2F2023-03%2F12.%20The%20Rainmist%20Experience.jpg&w=1920&q=75"
              alt="Experience"
              fill
              className="object-cover"
            />
          </div>

          {/* Cột Chữ (Bên Phải) - CÓ NỀN XÁM */}
          <div className="lg:w-1/2 bg-[#f9f9f9] flex flex-col justify-center p-10 lg:p-20 text-left">
            <span className="block text-xs font-bold text-gray-500 tracking-[4px] mb-6">
              THE RAINMIST EXPERIENCE
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-8 leading-tight">
              A Journey for the Soul
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-10">
              Feel the healing power of the rainforest with our signature
              Rainmist Experience. Refresh the mind under the calming beat of
              cascading rain showers, and restore the soul.
            </p>
            <a
              href="#"
              className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all w-fit"
            >
              Find Out More
            </a>
          </div>
        </div>
      </section>
      {/* 7. AMBASSADOR SECTION */}
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
      {/* --- ĐÃ XÓA FOOTER Ở ĐÂY (Layout tự thêm vào) --- */}
    </main>
  );
}
