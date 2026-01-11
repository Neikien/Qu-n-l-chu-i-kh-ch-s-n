"use client";

import Image from "next/image";
import Link from "next/link";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://digital.ihg.com/is/image/ihg/ic-brand-refresh-exper-lp-offer-hero-box-lvp-1440x636"
          alt="Experience Hero"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6 animate-fade-in-up">
            Unforgettable Moments
          </p>
          <h1 className="font-serif text-6xl md:text-8xl mb-6 animate-fade-in-up delay-100">
            Curated Experiences
          </h1>
        </div>
      </div>

      {/* 2. TIMELESS LUXURY */}
      <section className="py-20 px-5">
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row h-auto lg:h-[600px]">
          <div className="lg:w-1/2 bg-[#f9f9f9] flex flex-col justify-center p-10 lg:p-20 text-left order-2 lg:order-1">
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-6 leading-tight">
              Timeless Luxury Meets Modern Hospitality
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-8">
              As the world's first luxury hotel brand, InterContinental Hotels &
              Resorts has been offering guests a warmhearted welcome since 1946.
            </p>
            <div className="border-t border-gray-200 pt-6 mt-4">
              <h3 className="font-serif text-2xl text-primary mb-2">
                Insider Expertise
              </h3>
              <p className="text-sm text-secondary font-light">
                Discover more with insider know-how from our colleagues.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 relative h-[400px] lg:h-full order-1 lg:order-2">
            <Image
              src="https://digital.ihg.com/is/image/ihg/ic-brand-refresh-exper-lp-offer-insider-svp-1500x1125"
              alt="Lobby Staff"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. INTENTIONAL FLEXIBILITY */}
      <section className="py-24 bg-gray-50 px-5">
        <div className="max-w-[90%] mx-auto">
          <div className="text-left mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-6">
              Intentional Flexibility
            </h2>
            <p className="text-lg text-secondary font-light">
              Tailoring your stay, your way, to ensure you feel refreshed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Item 1 - Timeshifter */}
            <div className="group">
              <div className="relative h-[350px] w-full overflow-hidden mb-8 bg-gray-200">
                <Image
                  src="https://digital.ihg.com/is/image/ihg/ic-brand-refresh-exper-lp-offer-timeshifter-svp-1500x750-2"
                  alt="App"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-3xl text-primary mb-4 group-hover:text-accent transition-colors">
                Timeshifter® App
              </h3>
              <p className="text-base text-secondary font-light leading-loose mb-6">
                A personalized, science-backed jet lag plan available to
                optimize your travel experience.
              </p>
              {/* UPDATED LINK */}
              <Link
                href="/offers"
                className="text-xs font-bold uppercase tracking-widest text-accent border-b border-accent pb-1 hover:text-primary hover:border-primary transition-colors"
              >
                Learn More &gt;
              </Link>
            </div>

            {/* Item 2 - Restorative Design */}
            <div className="group">
              <div className="relative h-[350px] w-full overflow-hidden mb-8 bg-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600"
                  alt="Room"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-3xl text-primary mb-4 group-hover:text-accent transition-colors">
                Restorative Design
              </h3>
              <p className="text-base text-secondary font-light leading-loose mb-6">
                Carefully curated spaces designed to enhance relaxation and
                restoration during your stay.
              </p>
              {/* UPDATED LINK */}
              <Link
                href="/offers"
                className="text-xs font-bold uppercase tracking-widest text-accent border-b border-accent pb-1 hover:text-primary hover:border-primary transition-colors"
              >
                Learn More &gt;
              </Link>
            </div>

            {/* Item 3 - Flexible Dining */}
            <div className="group">
              <div className="relative h-[350px] w-full overflow-hidden mb-8 bg-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600"
                  alt="Dining"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-3xl text-primary mb-4 group-hover:text-accent transition-colors">
                Flexible Dining
              </h3>
              <p className="text-base text-secondary font-light leading-loose mb-6">
                Balanced and wholesome dishes available on-demand to suit your
                schedule.
              </p>
              {/* UPDATED LINK */}
              <Link
                href="/offers"
                className="text-xs font-bold uppercase tracking-widest text-accent border-b border-accent pb-1 hover:text-primary hover:border-primary transition-colors"
              >
                Learn More &gt;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INCREDIBLE OCCASIONS */}
      <section className="py-20 px-5">
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row h-auto lg:h-[600px]">
          <div className="lg:w-1/2 relative h-[400px] lg:h-full">
            <Image
              src="https://digital.ihg.com/is/image/ihg/ic-brand-refresh-homepg-offer-event-svp-1500x1125-2"
              alt="Occasions"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:w-1/2 bg-[#f9f9f9] flex flex-col justify-center p-10 lg:p-20 text-left">
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-8 leading-tight">
              Incredible Occasions
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-10">
              With a dedicated team on hand to curate celebrations that are
              unique and personal to you, every milestone is crafted to be truly
              unforgettable.
            </p>
            {/* UPDATED LINK */}
            <Link
              href="/offers"
              className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all w-fit"
            >
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* 5. RESTAURANTS AND BARS */}
      <section className="py-12 bg-white">
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row h-auto lg:h-[600px]">
          {/* Cột CHỮ bên TRÁI */}
          <div className="lg:w-1/2 bg-[#f9f9f9] flex flex-col justify-center p-10 lg:p-20 text-left">
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-8 leading-tight">
              Restaurants and Bars
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-10">
              At our restaurants, every dish tells a story. Our talented chefs
              celebrate traditional local recipes with a global twist, crafting
              each bite from the freshest ingredients.
            </p>
            {/* UPDATED LINK */}
            <Link
              href="/offers"
              className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all w-fit"
            >
              Learn More
            </Link>
          </div>

          {/* Cột ẢNH bên PHẢI */}
          <div className="lg:w-1/2 relative h-[400px] lg:h-full">
            <Image
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200"
              alt="Restaurant"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. CLUB INTERCONTINENTAL */}
      <section className="py-20 px-5">
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row h-auto lg:h-[600px]">
          <div className="lg:w-1/2 relative h-[400px] lg:h-full">
            <Image
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200"
              alt="Club Lounge"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:w-1/2 bg-[#f9f9f9] flex flex-col justify-center p-10 lg:p-20 text-left">
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-6">
              Club InterContinental
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-10">
              Elevate your stay with Club InterContinental. Indulge in locally
              inspired treats such as afternoon tea, evening canapés, and
              signature serves.
            </p>
            {/* UPDATED LINK */}
            <Link
              href="/offers"
              className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all w-fit"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* 7. PIONEERING */}
      <section className="py-24 bg-white">
        <div className="max-w-[96%] mx-auto relative lg:h-[700px] flex flex-col lg:block">
          <Image
            src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1920"
            alt="Pioneering"
            fill
            className="object-cover relative lg:absolute inset-0 h-[500px] lg:h-full w-full"
          />
          <div className="relative lg:absolute top-0 lg:top-1/2 right-0 lg:right-[8%] lg:transform lg:-translate-y-1/2 bg-white p-10 lg:p-16 max-w-xl shadow-none lg:shadow-xl mt-[-50px] lg:mt-0 mx-5 lg:mx-0">
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-6 leading-tight">
              Pioneering the <br /> philosophy of travel
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-0">
              Founded in 1946 by Juan Tripp, InterContinental Hotels & Resorts
              was born from a spirit of innovation. As the world's first luxury
              hotel brand, we have been at the apex of history.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
