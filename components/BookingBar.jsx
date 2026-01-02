"use client";
import { apiService } from '../services/apiService';
export default function BookingBar({ className = "", id = "" }) {
  return (
    // Class mặc định: Nền trắng, bóng đổ đậm, bo góc nhẹ -> Chuẩn Luxury
    <div
      id={id}
      className={`bg-white shadow-2xl rounded-sm p-6 flex flex-col lg:flex-row items-center gap-6 border border-gray-100 ${className}`}
    >
      {/* Destination */}
      <div className="flex-1 w-full border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:px-4">
        <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
          DESTINATION
        </label>
        <input
          type="text"
          placeholder="Where to?"
          className="w-full font-serif text-lg text-primary outline-none placeholder:text-gray-300"
        />
      </div>

      {/* Dates */}
      <div className="flex-1 w-full border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:px-4">
        <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
          DATES
        </label>
        <div className="flex gap-4 items-center font-serif text-lg text-primary">
          <input
            type="text"
            placeholder="Check-in"
            onFocus={(e) => (e.target.type = "date")}
            className="w-full outline-none cursor-pointer"
          />
          <span className="text-gray-300">—</span>
          <input
            type="text"
            placeholder="Check-out"
            onFocus={(e) => (e.target.type = "date")}
            className="w-full outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="flex-1 w-full border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:px-4">
        <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
          GUESTS
        </label>
        <select className="w-full font-serif text-lg text-primary outline-none bg-transparent cursor-pointer">
          <option>1 Room, 2 Guests</option>
          <option>2 Rooms, 4 Guests</option>
        </select>
      </div>

      {/* Button */}
      <button className="w-full lg:w-auto bg-accent text-white font-bold uppercase tracking-widest px-10 py-4 hover:bg-[#85604d] transition-all shadow-lg text-sm">
        Search
      </button>
    </div>
  );
}
