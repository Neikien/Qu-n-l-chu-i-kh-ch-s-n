"use client";

import Image from "next/image";
import Link from "next/link";

export default function DiningPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200"
          alt="Dining Hero"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6">
            Taste the Extraordinary
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Restaurants & Bars
          </h1>
        </div>
      </div>

      <div className="max-w-[90%] mx-auto py-20 px-5">
        {/* Section 1 */}
        <div className="flex flex-col lg:flex-row gap-16 mb-20 items-center">
          <div className="lg:w-1/2">
            <h2 className="font-serif text-4xl text-primary mb-6">
              Fine Dining
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-8">
              Experience culinary masterpieces crafted by our world-renowned
              chefs. Using only the freshest local ingredients, we create dishes
              that delight the senses.
            </p>
            <span className="text-accent text-sm font-bold uppercase tracking-widest">
              Open: 18:00 - 22:00
            </span>
          </div>
          <div className="lg:w-1/2 relative h-[400px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200"
              alt="Fine Dining"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="font-serif text-4xl text-primary mb-6">
              The Lounge Bar
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-8">
              Unwind with signature cocktails and premium wines in a
              sophisticated atmosphere. The perfect place to end your day.
            </p>
            <span className="text-accent text-sm font-bold uppercase tracking-widest">
              Open: 10:00 - Late
            </span>
          </div>
          <div className="lg:w-1/2 relative h-[400px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200"
              alt="Bar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="text-center pb-20">
        <Link
          href="/#booking"
          className="inline-block bg-primary text-white px-10 py-4 font-bold tracking-widest uppercase"
        >
          Reserve a Table
        </Link>
      </div>
    </main>
  );
}
