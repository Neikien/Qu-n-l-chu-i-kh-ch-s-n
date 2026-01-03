"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Dữ liệu giả (Phải khớp ID với trang danh sách)
const offersData = [
  {
    id: 1,
    title: "Advance Purchase",
    category: "Room Offers",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200",
    desc: "Plan ahead and save. Book your stay at least 7 days in advance.",
    details: ["Up to 20% savings", "Free Wi-Fi", "Pool access"],
  },
  {
    id: 2,
    title: "Stay Longer, Pay Less",
    category: "Long Stay",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200",
    desc: "Book a minimum of 3 nights and enjoy special savings.",
    details: ["Save 25%", "Free Breakfast", "Late Check-out"],
  },
  {
    id: 3,
    title: "Club InterContinental Experience",
    category: "Exclusive",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop",
    desc: "Elevate your stay with access to the Club InterContinental Lounge.",
    details: ["Lounge Access", "Evening Cocktails", "Private Check-in"],
  },
  {
    id: 4,
    title: "Dinner, Bed & Breakfast",
    category: "Dining Packages",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop",
    desc: "Indulge in a complete escape. Package includes luxury accommodation and dinner.",
    details: ["Daily Breakfast", "3-Course Dinner", "Welcome Drink"],
  },
  {
    id: 5,
    title: "Unforgettable Honeymoons",
    category: "Romance",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop",
    desc: "Celebrate your love with champagne on arrival and romantic amenities.",
    details: ["Champagne on arrival", "Romantic Turndown", "Late Check-out"],
  },
  {
    id: 6,
    title: "IHG One Rewards Member Rate",
    category: "Member Only",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
    desc: "Members always save more. Enjoy exclusive discounted rates.",
    details: ["Extra 10% Off", "Earn Points", "Free Internet"],
  },
];

export default function OfferDetailPage() {
  const params = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      const foundOffer = offersData.find(
        (item) => item.id === parseInt(params.id)
      );
      setOffer(foundOffer);
      setLoading(false);
    }
  }, [params]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  if (!offer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif mb-4">Offer Not Found</h1>
        <Link href="/offers" className="text-blue-600 underline">
          Back to Offers
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* HERO IMAGE */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={offer.image}
          alt={offer.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-10 left-10 z-10">
          <Link
            href="/offers"
            className="bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto -mt-20 relative z-10 bg-white p-10 shadow-lg border-t-4 border-primary mx-5 lg:mx-auto">
        <span className="text-xs font-bold text-accent tracking-[3px] uppercase block mb-2">
          {offer.category}
        </span>
        <h1 className="text-4xl lg:text-5xl font-serif text-primary mb-6">
          {offer.title}
        </h1>
        <p className="text-lg text-secondary font-light mb-8">{offer.desc}</p>

        <h3 className="font-serif text-2xl mb-4 text-primary">
          Package Includes:
        </h3>
        <ul className="list-disc pl-5 space-y-2 mb-10 text-secondary">
          {offer.details && offer.details.map((d, i) => <li key={i}>{d}</li>)}
        </ul>

        <div className="text-center">
          {/* ĐÃ SỬA: Link trỏ thẳng sang trang /booking */}
          <Link
            href="/booking"
            className="inline-block bg-primary text-white px-12 py-4 font-bold tracking-widest uppercase hover:bg-accent transition-colors duration-300"
          >
            Book Now
          </Link>
        </div>
      </div>
    </main>
  );
}
