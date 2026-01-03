"use client";

import Image from "next/image";

export default function ClubPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* HERO BANNER */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200"
          alt="Club Hero"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6">
            Exclusive Access
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Club InterContinental
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto py-20 px-5">
        <h2 className="font-serif text-4xl text-center text-primary mb-12">
          A Higher Level of Luxury
        </h2>
        <div className="space-y-12">
          <div className="flex gap-6">
            <span className="text-4xl text-accent font-serif">01</span>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-2">
                Personalized Service
              </h3>
              <p className="text-secondary font-light">
                Dedicated Club team available to assist with every detail of
                your stay, from check-in to check-out.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <span className="text-4xl text-accent font-serif">02</span>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-2">
                Culinary Delights
              </h3>
              <p className="text-secondary font-light">
                Complimentary breakfast, afternoon tea, and evening cocktails
                and canapés served daily in the Club Lounge.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <span className="text-4xl text-accent font-serif">03</span>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-2">
                Exclusive Spaces
              </h3>
              <p className="text-secondary font-light">
                Access to the private Club InterContinental Lounge, a sanctuary
                for relaxation or business.
              </p>
            </div>
          </div>
        </div>

        {/* ĐÃ XÓA NÚT VIEW CLUB ROOMS Ở ĐÂY */}
      </div>
    </main>
  );
}
