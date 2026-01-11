"use client";

import Image from "next/image";
import Link from "next/link";

// DỮ LIỆU GIẢ: MENU TRỊ LIỆU
const treatments = [
  {
    id: 1,
    name: "Angsana Signature Massage",
    duration: "90 Minutes",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    desc: "A euphoric blend of Thai and Western techniques to relieve tension and restore vitality. Uses warm sesame oil for deep relaxation.",
  },
  {
    id: 2,
    name: "Hydrothermal Therapy",
    duration: "60 Minutes",
    // ĐÃ SỬA: Thay ảnh mới sang trọng hơn (Bể sục/Spa trong nhà)
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800&auto=format&fit=crop",
    desc: "Immerse yourself in our vitality pools, herbal steam rooms, and ice fountains to boost circulation and immunity.",
  },
  {
    id: 3,
    name: "Radiance Facial",
    duration: "75 Minutes",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    desc: "Restore your skin's natural glow with our organic facial treatments, featuring premium ingredients and expert techniques.",
  },
];

export default function SpaPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920&auto=format&fit=crop"
          alt="Spa Hero"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6 animate-fade-in-up">
            Sanctuary for the Senses
          </p>
          <h1 className="font-serif text-6xl md:text-8xl mb-6 animate-fade-in-up delay-100">
            Wellness & Spa
          </h1>
        </div>
      </div>

      {/* 2. PHILOSOPHY (Ảnh Trái - Chữ Phải) */}
      <section className="py-24 px-5">
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 h-[600px] relative w-full shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop"
              alt="Spa Interior"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:w-1/2 text-left lg:pl-10">
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-8 leading-tight">
              Refresh. Rejuvenate. Reconnect.
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-10">
              Step into a world of tranquility. Our spa philosophy is grounded
              in the belief that wellness is a journey, not a destination. We
              combine ancient Asian healing traditions with modern techniques to
              create a personalized experience for every guest.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="font-serif text-2xl mb-2">10+</h4>
                <p className="text-xs tracking-widest uppercase text-gray-500">
                  Treatment Rooms
                </p>
              </div>
              <div>
                <h4 className="font-serif text-2xl mb-2">100%</h4>
                <p className="text-xs tracking-widest uppercase text-gray-500">
                  Natural Ingredients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TREATMENT MENU (Grid) */}
      <section className="py-24 bg-gray-50 px-5">
        <div className="max-w-[90%] mx-auto">
          <div className="text-center mb-20">
            <span className="block text-xs font-bold text-gray-500 tracking-[4px] uppercase mb-4">
              Our Selection
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary">
              Signature Treatments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {treatments.map((item) => (
              <div
                key={item.id}
                className="group bg-white p-0 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-[300px] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 text-center">
                  <h3 className="font-serif text-2xl text-primary mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-accent uppercase tracking-widest mb-4">
                    {item.duration}
                  </p>
                  <p className="text-sm text-secondary font-light leading-relaxed mb-6">
                    {item.desc}
                  </p>
                  {/* ĐÃ SỬA: Link trỏ về trang /offers */}
                  <Link
                    href="/offers"
                    className="text-[10px] font-bold uppercase tracking-widest border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED (Overlay) */}
      <section className="py-24 bg-white">
        <div className="max-w-[96%] mx-auto relative lg:h-[600px] flex flex-col lg:block">
          <Image
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1920"
            alt="Spa Products"
            fill
            className="object-cover relative lg:absolute inset-0 h-[400px] lg:h-full w-full"
          />
          <div className="relative lg:absolute top-0 lg:top-1/2 right-0 lg:right-[8%] lg:transform lg:-translate-y-1/2 bg-white p-10 lg:p-16 max-w-xl shadow-none lg:shadow-xl mt-[-50px] lg:mt-0 mx-5 lg:mx-0">
            <h2 className="font-serif text-3xl lg:text-4xl text-primary mb-6 leading-tight">
              Bring the Spa Home
            </h2>
            <p className="text-lg text-secondary font-light leading-loose mb-8">
              Extend your wellness journey with our exclusive range of spa
              products. From aromatic essential oils to handcrafted ceramics,
              take a piece of tranquility with you.
            </p>
            <a
              href="#"
              className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-primary hover:text-white transition-all"
            >
              View Collection
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
