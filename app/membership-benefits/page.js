"use client";

import Image from "next/image";
import Link from "next/link";

// DỮ LIỆU: CÁC QUYỀN LỢI CHI TIẾT
const benefits = [
  {
    id: "elevated-recognition",
    title: "Elevated Recognition",
    subtitle: "Status that travels with you",
    desc: "Experience a level of recognition that goes beyond the ordinary. From priority check-in to a dedicated support line, we ensure you are known and valued from the moment you arrive. Your status is recognized globally across all our properties.",
    features: [
      "Priority Check-in & Check-out",
      "Dedicated Guest Relations Team",
      "Elite Member Support Line",
      "Guaranteed Room Availability (72h)",
    ],
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1200&auto=format&fit=crop", // Ảnh lễ tân/sảnh sang trọng
  },
  {
    id: "stay-enhancements",
    title: "Stay Enhancements",
    subtitle: "Comfort in every detail",
    desc: "We believe your room should be a sanctuary. Enjoy complimentary upgrades to better views or suites, premium Wi-Fi for seamless connectivity, and personalized welcome amenities waiting for you upon arrival.",
    features: [
      "Complimentary Room Upgrades",
      "Premium High-Speed Wi-Fi",
      "Welcome Fruit Platter & Mineral Water",
      "Daily Turndown Service",
    ],
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop", // Ảnh phòng ngủ nội thất đẹp
  },
  {
    id: "restaurant-provisions",
    title: "Restaurant Provisions",
    subtitle: "A taste of the exquisite",
    desc: "Savor the world's finest cuisines with exclusive privileges. Start your day with a complimentary full breakfast and enjoy dining credits to explore our signature restaurants and bars.",
    features: [
      "Daily Complimentary Breakfast for Two",
      "Welcome Drink at The Bar",
      "$20 Food & Beverage Credit per Stay",
      "Priority Reservations at Signature Restaurants",
    ],
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop", // Ảnh nhà hàng/đồ ăn
  },
  {
    id: "luxury-of-time",
    title: "Luxury of Time",
    subtitle: "Make every moment count",
    desc: "Time is the ultimate luxury. We give you more of it with flexible arrival and departure times, allowing you to relax without the rush. Sleep in late or arrive early—the schedule is yours to define.",
    features: [
      "Guaranteed Late Check-out until 4:00 PM",
      "Early Check-in from 10:00 AM (Subject to availability)",
      "24-Hour Lounge Access",
      "Express Laundry Service",
    ],
    image:
      "https://images.unsplash.com/photo-1501139083538-0139583c61ee?q=80&w=1200&auto=format&fit=crop", // Ảnh đồng hồ/thư giãn/spa
  },
];

export default function MembershipBenefitsPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative h-[50vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop"
          alt="Membership Benefits Hero"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-4 animate-fade-in-up">
            IHG One Rewards
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-4 animate-fade-in-up delay-100">
            Elite Benefits
          </h1>
          <p className="text-lg font-light max-w-2xl animate-fade-in-up delay-200">
            Unlock a world of exclusive privileges designed to enhance every
            part of your journey.
          </p>
        </div>
      </div>

      {/* 2. INTRODUCTION */}
      <div className="max-w-[800px] mx-auto py-24 px-5 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6 leading-tight">
          Designed for the Distinguished Traveler
        </h2>
        <p className="text-lg text-secondary font-light leading-relaxed">
          As a member, you are entitled to a suite of benefits that elevate your
          stay from memorable to unforgettable. Explore the pillars of our
          recognition program below.
        </p>
      </div>

      {/* 3. BENEFITS LIST (ZIG-ZAG LAYOUT) */}
      <div className="flex flex-col gap-0">
        {benefits.map((benefit, index) => (
          <div
            key={benefit.id}
            id={benefit.id} // Để có thể scroll đến đúng vị trí nếu cần
            className={`flex flex-col md:flex-row w-full ${
              index % 2 === 1 ? "md:flex-row-reverse" : "" // Đảo chiều layout chẵn/lẻ
            }`}
          >
            {/* Cột Hình Ảnh (Chiếm 50%) */}
            <div className="relative w-full md:w-1/2 h-[400px] md:h-[600px]">
              <Image
                src={benefit.image}
                alt={benefit.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Cột Nội Dung (Chiếm 50%) */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-10 md:p-20">
              <div className="max-w-md">
                <p className="text-xs font-bold tracking-[3px] uppercase text-gray-400 mb-4">
                  0{index + 1}
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
                  {benefit.subtitle}
                </p>

                <p className="text-base text-secondary font-light leading-loose mb-8">
                  {benefit.desc}
                </p>

                {/* Danh sách Features nhỏ */}
                <ul className="space-y-3 mb-10">
                  {benefit.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-gray-600"
                    >
                      <span className="mr-3 text-accent">✦</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Nút CTA nhỏ */}
                <Link
                  href="/register"
                  className="text-primary text-xs font-bold tracking-[2px] uppercase border-b border-primary pb-1 hover:text-accent hover:border-accent transition-all"
                >
                  Join to Experience
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. BOTTOM CTA */}
      <div className="bg-primary text-white py-24 text-center px-5">
        <h2 className="font-serif text-3xl md:text-4xl mb-6">
          Ready to elevate your journey?
        </h2>
        <p className="text-white/70 mb-10 max-w-xl mx-auto font-light">
          Join IHG One Rewards today and start enjoying these exclusive benefits
          from your very first stay.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-primary px-12 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-accent hover:text-white transition-all"
        >
          Become a Member
        </Link>
      </div>
    </main>
  );
}
