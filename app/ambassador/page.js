"use client";

import Image from "next/image";
import Link from "next/link";

export default function AmbassadorPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1920"
          alt="Ambassador Hero"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6">
            Membership
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            InterContinental Ambassador
          </h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto py-20 px-5 text-center">
        <h2 className="font-serif text-4xl text-primary mb-8">
          Elevate Every Stay
        </h2>
        <p className="text-lg text-secondary font-light leading-relaxed mb-12">
          InterContinental Ambassador is a loyalty program that delivers
          recognition and exclusive benefits at InterContinental Hotels &
          Resorts worldwide.
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-16">
          <div className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
            <span className="text-4xl text-accent mb-4 block">01</span>
            <h3 className="font-bold uppercase tracking-widest mb-3">
              Room Upgrade
            </h3>
            <p className="text-sm text-gray-500">
              Guaranteed one category room upgrade at check-in.
            </p>
          </div>
          <div className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
            <span className="text-4xl text-accent mb-4 block">02</span>
            <h3 className="font-bold uppercase tracking-widest mb-3">
              4PM Check-out
            </h3>
            <p className="text-sm text-gray-500">
              Extend your stay with guaranteed late check-out until 4:00 PM.
            </p>
          </div>
          <div className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
            <span className="text-4xl text-accent mb-4 block">03</span>
            <h3 className="font-bold uppercase tracking-widest mb-3">
              Free Weekend Night
            </h3>
            <p className="text-sm text-gray-500">
              Receive a complimentary weekend night certificate valid on the
              second night of a paid stay.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-12">
          <h3 className="font-serif text-3xl mb-4">Join the Club</h3>
          <p className="opacity-80 mb-8 font-light">
            USD 200 for 12 months of benefits.
          </p>
          <button className="bg-white text-gray-900 px-10 py-4 font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors">
            Purchase Membership
          </button>
        </div>
      </div>
    </main>
  );
}
