'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function JourneyPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      
      {/* 1. HERO BANNER */}
      <div className="relative h-[70vh] w-full overflow-hidden bg-gray-900">
        <Image 
          src="https://www.angsana.com/_next/image?url=https%3A%2F%2Fwww.angsana.com%2Fassets%2F2023-03%2F12.%20The%20Rainmist%20Experience.jpg&w=1920&q=75" 
          alt="Rainmist Hero" 
          fill 
          priority
          className="object-cover opacity-90" 
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
            <p className="text-sm font-bold tracking-[4px] uppercase mb-6 animate-fade-in-up">Signature Treatment</p>
            <h1 className="font-serif text-6xl md:text-8xl mb-6 animate-fade-in-up delay-100">The Rainmist Experience</h1>
        </div>
      </div>

      {/* 2. INTRODUCE */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-8 leading-tight">
                A Journey for the Soul
            </h2>
            <p className="text-lg text-secondary font-light leading-loose">
                Feel the healing power of the rainforest with our signature Rainmist Experience, an Angsana innovation. Unlike any other spa treatment, this unique ritual combines the soothing sounds of cascading water with the therapeutic touch of our expert therapists.
            </p>
        </div>
      </section>

      {/* 3. THE RITUAL STEPS */}
      <section className="py-24 bg-gray-50 px-5">
        <div className="max-w-[90%] mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
                
                {/* Ảnh minh họa */}
                <div className="lg:w-1/2 h-[600px] relative w-full">
                    <Image 
                        src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800" 
                        alt="Spa Treatment" 
                        fill
                        className="object-cover" 
                    />
                </div>

                {/* Các bước */}
                <div className="lg:w-1/2">
                    <h3 className="font-serif text-4xl text-primary mb-10">The Ritual</h3>
                    
                    <div className="space-y-12">
                        <div className="flex gap-6">
                            <span className="text-4xl font-serif text-accent opacity-50">01</span>
                            <div>
                                <h4 className="text-xl font-serif text-primary mb-2">Steam & Prepare</h4>
                                <p className="text-secondary font-light leading-relaxed">Begin with a warm herbal steam bath to open your pores and relax your muscles, preparing your body for deep restoration.</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-6">
                            <span className="text-4xl font-serif text-accent opacity-50">02</span>
                            <div>
                                <h4 className="text-xl font-serif text-primary mb-2">Rain Shower</h4>
                                <p className="text-secondary font-light leading-relaxed">Refresh your mind under the calming beat of our specially designed cascading rain showers, simulating a tropical downpour.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <span className="text-4xl font-serif text-accent opacity-50">03</span>
                            <div>
                                <h4 className="text-xl font-serif text-primary mb-2">Restorative Massage</h4>
                                <p className="text-secondary font-light leading-relaxed">Conclude with a full-body massage using aromatic oils, releasing tension and leaving you in a state of pure bliss.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* 4. DETAILS & BOOKING */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto border border-gray-200 p-12 text-center">
            <h3 className="font-serif text-3xl text-primary mb-6">Experience Details</h3>
            
            <div className="flex justify-center gap-12 mb-10 text-sm font-medium tracking-widest uppercase text-secondary">
                <div>
                    <span className="block text-xs text-gray-400 mb-2">Duration</span>
                    90 Minutes
                </div>
                <div>
                    <span className="block text-xs text-gray-400 mb-2">Intensity</span>
                    Medium
                </div>
                <div>
                    <span className="block text-xs text-gray-400 mb-2">Price</span>
                    From $180
                </div>
            </div>

            <Link href="/#booking" className="inline-block bg-primary text-white px-12 py-4 text-sm font-bold tracking-[2px] uppercase hover:bg-accent transition-all">
                Book Appointment
            </Link>
        </div>
      </section>

    </main>
  );
}