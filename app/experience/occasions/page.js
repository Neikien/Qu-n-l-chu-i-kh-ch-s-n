"use client";

import Image from "next/image";
import Link from "next/link";

export default function OccasionsPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* HERO */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://digital.ihg.com/is/image/ihg/ic-brand-refresh-homepg-offer-event-svp-1500x1125-2"
          alt="Occasions Hero"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6 animate-fade-in-up">
            Celebrations & Events
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Incredible Occasions
          </h1>
        </div>
      </div>

      {/* INTRO */}
      <div className="max-w-4xl mx-auto py-20 px-5 text-center">
        <h2 className="font-serif text-4xl text-primary mb-6">
          Crafting Unforgettable Moments
        </h2>
        <p className="text-lg text-secondary font-light leading-relaxed">
          From intimate weddings to grand galas, our dedicated team of planners
          ensures every detail is executed to perfection. Experience world-class
          service in our stunning venues.
        </p>
      </div>

      {/* VENUES GRID */}
      <div className="max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
        <div className="relative h-[500px] group">
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200"
            alt="Weddings"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <h3 className="font-serif text-4xl mb-4">Weddings</h3>
            <p className="tracking-widest uppercase text-sm">
              Say "I Do" in Paradise
            </p>
          </div>
        </div>
        <div className="relative h-[500px] group">
          <Image
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200"
            alt="Meetings"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <h3 className="font-serif text-4xl mb-4">Meetings</h3>
            <p className="tracking-widest uppercase text-sm">
              Inspiring Business Spaces
            </p>
          </div>
        </div>
      </div>

      {/* CONTACT CTA */}
      <div className="bg-[#f9f9f9] py-20 text-center">
        <h2 className="font-serif text-3xl text-primary mb-8">
          Start Planning Your Event
        </h2>
        <Link
          href="/#booking"
          className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all"
        >
          Contact Our Team
        </Link>
      </div>
    </main>
  );
}
