"use client";

import Image from "next/image";
import Link from "next/link";

export default function RestorativeDesignPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* HERO */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1920"
          alt="Restorative Design Hero"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6">
            Sanctuary of Sleep
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Restorative Design
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto py-20 px-5">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-primary mb-6">
            Designed for Serenity
          </h2>
          <p className="text-lg text-secondary font-light leading-relaxed">
            We understand that travel can be exhausting. That's why we've
            collaborated with neuroscientists and designers to create spaces
            that promote deep rest and rejuvenation. Every element, from
            lighting to acoustics, is curated to help you recharge.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-[#f9f9f9] p-10 text-center">
            <h3 className="font-serif text-2xl text-primary mb-4">
              Intelligent Lighting
            </h3>
            <p className="text-secondary font-light">
              Circadian-friendly lighting systems that adjust throughout the day
              to support your natural sleep-wake cycle.
            </p>
          </div>
          <div className="bg-[#f9f9f9] p-10 text-center">
            <h3 className="font-serif text-2xl text-primary mb-4">
              Acoustic Comfort
            </h3>
            <p className="text-secondary font-light">
              Sound-insulating materials and white noise amenities to ensure a
              peaceful environment, free from distractions.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/rooms"
            className="inline-block bg-primary text-white px-10 py-4 font-bold tracking-widest uppercase hover:bg-accent transition-colors"
          >
            Find Your Sanctuary
          </Link>
        </div>
      </div>
    </main>
  );
}
