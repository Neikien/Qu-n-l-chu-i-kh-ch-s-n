"use client";

import Image from "next/image";
import Link from "next/link";

export default function RainmistPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://www.angsana.com/_next/image?url=https%3A%2F%2Fwww.angsana.com%2Fassets%2F2023-03%2F12.%20The%20Rainmist%20Experience.jpg&w=1920&q=75"
          alt="Rainmist Hero"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6">
            Signature Therapy
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            The Rainmist Experience
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-20 px-5">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-primary mb-6">
            A Journey for the Soul
          </h2>
          <p className="text-lg text-secondary font-light leading-relaxed">
            The Rainmist experience combines the soothing power of cascading
            water with steam heat to prepare your body for a restorative
            massage. Inspired by the tropical rainforests, this treatment washes
            away stress and leaves you feeling completely renewed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-10 border border-gray-100">
          <div>
            <h3 className="font-serif text-2xl mb-4">The Ritual</h3>
            <ul className="space-y-3 text-secondary font-light">
              <li>• Rain shower steam bath</li>
              <li>• Body scrub with natural sea salts</li>
              <li>• Rainmist shower rinse</li>
              <li>• Full body oil massage</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center items-start border-l border-gray-200 pl-8">
            <h3 className="font-serif text-2xl mb-4">Details</h3>
            <p className="text-secondary font-light mb-2">
              Duration: 90 Minutes
            </p>
            <p className="text-secondary font-light mb-6">
              Price: $200 per person
            </p>
            <Link
              href="/booking"
              className="text-accent font-bold uppercase tracking-widest border-b border-accent pb-1"
            >
              Book This Experience
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
