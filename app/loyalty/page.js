"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Đảm bảo đã import Link

// DỮ LIỆU NỘI DUNG TỪNG TAB
const tabContent = {
  recognition: {
    title: "Elevated Recognition",
    desc: "We believe your loyalty should be rewarded instantly. Enjoy priority check-in, a dedicated support line, and exclusive access to our member-only private sales.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    benefits: ["Priority Check-in", "Dedicated Support", "Welcome Amenity"],
    linkId: "elevated-recognition",
  },
  enhancements: {
    title: "Stay Enhancements",
    desc: "Make every stay more comfortable with complimentary room upgrades, premium Wi-Fi, and daily housekeeping tailored to your preferences.",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
    benefits: ["Room Upgrades", "Premium Wi-Fi", "Turn-down Service"],
    linkId: "stay-enhancements",
  },
  dining: {
    title: "Restaurant Provisions",
    desc: "Savor the moment with exclusive dining discounts at our award-winning restaurants and bars. Members enjoy up to 20% off food and beverages.",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop",
    benefits: [
      "Dining Discounts",
      "Priority Reservations",
      "Complimentary Breakfast",
    ],
    linkId: "restaurant-provisions",
  },
  time: {
    title: "Luxury of Time",
    desc: "Relax without the rush. Take advantage of guaranteed late check-out until 4 PM and early check-in to maximize your stay.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    benefits: ["Late Check-out (4PM)", "Early Check-in", "24hr Stay"],
    linkId: "luxury-of-time",
  },
};

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState("recognition");

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://digital.ihg.com/is/image/ihg/ic-brand-refresh-homepg-offer-hero-box-lvp-1440x636"
          alt="Loyalty Hero"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6 animate-fade-in-up">
            IHG One Rewards
          </p>
          <h1 className="font-serif text-6xl md:text-8xl mb-8 animate-fade-in-up delay-100">
            InterContinental Ambassador
          </h1>

          {/* ĐÃ SỬA: Thay button bằng Link trỏ về /register */}
          <Link
            href="/register"
            className="inline-block bg-white text-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-accent hover:text-white transition-all animate-fade-in-up delay-200"
          >
            Join For Free
          </Link>
        </div>
      </div>

      {/* 2. INTRO TEXT */}
      <section className="pt-24 pb-12 px-5 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-5xl lg:text-6xl text-primary mb-8 leading-tight">
            Exceptional experiences, <br /> exclusive benefits
          </h2>
          <p className="text-lg text-secondary font-light leading-loose max-w-3xl mx-auto">
            Placing you at the heart of every celebration. From intimate dinners
            to joyful anniversaries or lively weekender, we curate your special
            occasion and transform it into something incredible.
          </p>
        </div>
      </section>

      {/* 3. INTERACTIVE TABS */}
      <section className="py-12 px-5">
        <div className="max-w-[90%] mx-auto">
          {/* Thanh Tab Ngang */}
          <div className="flex flex-wrap justify-center gap-10 border-b border-gray-200 pb-4 mb-16">
            {Object.keys(tabContent).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-4 text-sm font-bold uppercase tracking-[2px] transition-all ${
                  activeTab === key
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-400 hover:text-primary"
                }`}
              >
                {tabContent[key].title}
              </button>
            ))}
          </div>

          {/* Nội dung Tab */}
          <div className="flex flex-col lg:flex-row items-center gap-20 animate-fade-in-up">
            {/* Cột Chữ */}
            <div className="lg:w-1/2 text-left">
              <h3 className="font-serif text-4xl text-primary mb-6">
                {tabContent[activeTab].title}
              </h3>
              <p className="text-lg text-secondary font-light leading-loose mb-10">
                {tabContent[activeTab].desc}
              </p>
              <ul className="space-y-4 mb-10">
                {tabContent[activeTab].benefits.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm font-medium tracking-wider text-primary uppercase"
                  >
                    <span className="h-[1px] w-8 bg-accent"></span> {item}
                  </li>
                ))}
              </ul>

              {/* Link Discover More */}
              <Link
                href={`/membership-benefits#${tabContent[activeTab].linkId}`}
                className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all"
              >
                Discover More
              </Link>
            </div>

            {/* Cột Ảnh */}
            <div className="lg:w-1/2 h-[500px] relative w-full shadow-sm">
              <Image
                src={tabContent[activeTab].image}
                alt={tabContent[activeTab].title}
                fill
                className="object-cover transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
