"use client";

import Image from "next/image";

export default function TimeshifterPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://digital.ihg.com/is/image/ihg/ic-brand-refresh-exper-lp-offer-timeshifter-svp-1500x750-2"
          alt="App Hero"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6">
            Wellness & Travel
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Timeshifter® App
          </h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto py-20 px-5 text-center">
        <h2 className="font-serif text-4xl text-primary mb-6">
          Defeat Jet Lag
        </h2>
        <p className="text-lg text-secondary font-light leading-relaxed mb-10">
          We have partnered with Timeshifter®, the world leader in circadian
          technology, to help our guests travel their best. The Timeshifter app
          provides personalized plans based on your sleep pattern, chronotype,
          and itinerary to help you adjust quickly to new time zones.
        </p>

        <div className="bg-gray-50 p-10 rounded-lg border border-gray-100">
          <h3 className="font-serif text-2xl mb-4">Complimentary for Guests</h3>
          <p className="text-sm text-gray-500 mb-6">
            InterContinental guests receive a complimentary jet lag plan with
            every stay.
          </p>
          <button className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs font-bold">
            Download Now
          </button>
        </div>
      </div>
    </main>
  );
}
