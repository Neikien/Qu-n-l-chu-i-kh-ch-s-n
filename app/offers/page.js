"use client";

import Image from "next/image";
import Link from "next/link";

// DỮ LIỆU GIẢ: CÁC GÓI ƯU ĐÃI
const offers = [
  {
    id: 1,
    title: "Advance Purchase",
    category: "Room Offers",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200&auto=format&fit=crop", // Ảnh hồ bơi thư giãn
    desc: "Plan ahead and save. Book your stay at least 7 days in advance to enjoy up to 20% off our Best Flexible Rate. Valid at participating hotels and resorts worldwide.",
  },
  {
    id: 2,
    title: "Stay Longer, Pay Less",
    category: "Long Stay",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop", // Ảnh phòng khách sạn
    desc: "Linger a little longer with more time to explore. Book a minimum of 3 nights and enjoy special savings. The perfect excuse to extend your getaway.",
  },
  {
    id: 3,
    title: "Club InterContinental Experience",
    category: "Exclusive",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop", // Ảnh ăn uống sang trọng
    desc: "Elevate your stay with access to the Club InterContinental Lounge, including complimentary breakfast, evening cocktails, and personalized service throughout your stay.",
  },
  {
    id: 4,
    title: "Dinner, Bed & Breakfast",
    category: "Dining Packages",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop", // Ảnh ly rượu/bàn ăn
    desc: "Indulge in a complete escape. Package includes luxury accommodation, daily breakfast for two, and a three-course dinner at our signature restaurant.",
  },
  {
    id: 5,
    title: "Unforgettable Honeymoons",
    category: "Romance",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop", // Ảnh cặp đôi/hoa
    desc: "Celebrate your love with champagne on arrival, a romantic turndown service, and a late checkout. Create memories that will last a lifetime.",
  },
  {
    id: 6,
    title: "IHG One Rewards Member Rate",
    category: "Member Only",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop", // Ảnh view đẹp
    desc: "Members always save more. Enjoy exclusive discounted rates when you book directly with us. Not a member yet? Join for free today.",
  },
];

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=1920&auto=format&fit=crop"
          alt="Offers Hero"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6 animate-fade-in-up">
            Exclusive Benefits
          </p>
          <h1 className="font-serif text-6xl md:text-8xl mb-6 animate-fade-in-up delay-100">
            Special Offers
          </h1>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="max-w-[90%] mx-auto py-20 px-5">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-6 leading-tight">
            Curated Packages for Every Journey
          </h2>
          <p className="text-lg text-secondary font-light leading-relaxed">
            Whether you are looking for a romantic getaway, a family vacation,
            or a business trip, discover exclusive offers designed to enhance
            your stay.
          </p>
        </div>

        {/* 3. OFFERS GRID (2 CỘT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
          {offers.map((offer) => (
            <div key={offer.id} className="group cursor-pointer flex flex-col">
              {/* Ảnh Card */}
              <div className="relative h-[400px] w-full overflow-hidden mb-10 bg-gray-100 shadow-sm">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Tag Category */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-primary">
                  {offer.category}
                </div>
              </div>

              {/* Thông tin */}
              <div className="text-left">
                <h3 className="font-serif text-3xl lg:text-4xl text-primary mb-6 leading-tight group-hover:text-accent transition-colors">
                  {offer.title}
                </h3>
                <p className="text-lg text-secondary font-light leading-loose mb-10">
                  {offer.desc}
                </p>

                {/* Nút Book (Link về Booking Bar hoặc trang chi tiết) */}
                <Link
                  href="/#booking"
                  className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase text-primary hover:bg-primary hover:text-white transition-all"
                >
                  View Offer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
