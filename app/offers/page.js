"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Kho ảnh Mock
const LUXURY_SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200", // Spa
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200", // Dining
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200", // Gym
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200", // Room Service
];

const CATEGORIES = [
  "Wellness",
  "Dining",
  "Fitness",
  "Convenience",
  "Exclusive",
];

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          "https://khachsan-backend-production-9810.up.railway.app/services/?skip=0&limit=100"
        );
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const formattedData = data.map((item, index) => ({
          id: item.MaDV,
          title: item.TenDV,
          category: CATEGORIES[index % CATEGORIES.length],
          image: LUXURY_SERVICE_IMAGES[index % LUXURY_SERVICE_IMAGES.length],
          desc: item.MoTa || "Trải nghiệm dịch vụ đẳng cấp 5 sao.",
          price: item.GiaDV,
        }));
        setServices(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // XỬ LÝ KHI BẤM NÚT BOOK NOW
  const handleBookService = () => {
    // Luồng đơn giản: Bắt buộc đặt phòng trước
    if (
      confirm(
        "Vui lòng Đặt Phòng trước khi gọi dịch vụ.\n\n- Nếu bạn chưa có phòng: Bấm OK để tìm phòng.\n- Nếu bạn đã có phòng: Vào mục 'Đơn phòng của tôi' để gọi dịch vụ."
      )
    ) {
      router.push("/"); // Chuyển về trang chủ để đặt phòng
    }
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="relative h-[60vh] bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=1920"
          alt="Hero"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">
          <p className="text-sm font-bold tracking-[4px] uppercase mb-6">
            World Class Amenities
          </p>
          <h1 className="font-serif text-6xl">Our Services</h1>
        </div>
      </div>

      <div className="max-w-[90%] mx-auto py-20 px-5">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl text-primary mb-6">
            Trải nghiệm dịch vụ hoàn hảo
          </h2>
          <p className="text-lg text-secondary font-light">
            Khám phá các dịch vụ đẳng cấp. Vui lòng đặt phòng trước để sử dụng
            các dịch vụ này.
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <Loader2 className="animate-spin inline" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {services.map((service) => (
              <div key={service.id} className="group cursor-pointer">
                <div className="relative h-[400px] mb-10 bg-gray-100">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {service.category}
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex justify-between items-baseline mb-6">
                    <h3 className="font-serif text-3xl text-primary">
                      {service.title}
                    </h3>
                    <span className="text-lg font-bold text-gray-500">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(service.price)}
                    </span>
                  </div>
                  <p className="text-lg text-secondary font-light mb-10 line-clamp-3">
                    {service.desc}
                  </p>

                  {/* NÚT BẤM */}
                  <button
                    onClick={handleBookService}
                    className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-[2px] uppercase text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    Đặt Dịch Vụ Này
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
