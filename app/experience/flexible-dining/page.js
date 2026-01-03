"use client";

import Image from "next/image";
import Link from "next/link";

export default function FlexibleDiningPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* HERO */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920"
          alt="Flexible Dining Hero"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6">
            Nourish on Your Terms
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Flexible Dining
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1000px] mx-auto py-20 px-5">
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div className="lg:w-1/2">
            <h2 className="font-serif text-4xl text-primary mb-6">
              Eat What You Want, When You Want
            </h2>
            <p className="text-lg text-secondary font-light leading-relaxed mb-6">
              Travel doesn't run on a 9-to-5 schedule, and neither does your
              hunger. Whether you need a nutritious breakfast at 2 PM or a
              comforting meal after a late flight, our flexible dining options
              are designed around you.
            </p>
            <ul className="space-y-4 text-secondary font-light">
              <li className="flex items-center gap-3">
                <span className="text-accent">✓</span> 24-Hour In-Room Dining
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent">✓</span> Healthy & Balanced Menu
                Options
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent">✓</span> Grab-and-Go Gourmet
              </li>
            </ul>
          </div>
          <div className="lg:w-1/2 relative h-[400px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=1200"
              alt="In-room dining"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/experience/dining"
            className="inline-block border border-primary px-10 py-4 font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-colors"
          >
            View All Dining Options
          </Link>
        </div>
      </div>
    </main>
  );
}
