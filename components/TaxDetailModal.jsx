// components/TaxDetailModal.jsx
"use client";
import React from 'react';
import { apiService } from '../services/apiService';
const TaxDetailModal = ({ isOpen, onClose, rate, currency }) => {
  if (!isOpen || !rate) return null;

  // Tính toán các giá trị (Ví dụ: Phí 5%, Thuế 10%)
  const additionalCharges = rate.price * 0.05;
  const taxes = rate.price * 0.10;
  const total = rate.price + additionalCharges + taxes;

  const format = (amt) => new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amt);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-full max-w-md overflow-hidden rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#6b1d4f] p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">{rate.title}</h3>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-gray-700 max-h-[80vh] overflow-y-auto">
          <ul className="list-disc pl-5 space-y-1 font-medium">
            <li>Không hoàn lại tiền</li>
            <li>Yêu cầu đặt cọc</li>
          </ul>

          <div className="border-t pt-4">
            <p className="font-bold mb-2">Giá cho 1 PHÒNG, 1 ĐÊM</p>
            <div className="flex justify-between py-1">
              <span>Giá phòng tạm tính</span>
              <span className="font-semibold">{format(rate.price)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Phí bổ sung (5%)</span>
              <span>{format(additionalCharges)}</span>
            </div>
            <div className="flex justify-between py-1 border-b pb-2">
              <span>Thuế (10%)</span>
              <span>{format(taxes)}</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold text-[#6b1d4f]">
              <span>Tổng giá ước tính</span>
              <span>{format(total)}</span>
            </div>
          </div>

          <div>
            <p className="font-bold uppercase mb-1">Mô tả</p>
            <p>Hội viên IHG® One Rewards tiết kiệm được nhiều hơn. Chưa là hội viên? Hãy tham gia khi bạn thanh toán.</p>
          </div>

          <div>
            <p className="font-bold uppercase mb-1">Thuế và Phí bổ sung</p>
            <p>Phí bổ sung: 5% mỗi đêm không bao gồm trong giá, có hiệu lực từ 1 tháng 1, 2026.</p>
            <p>Thuế: 10% mỗi đêm không bao gồm trong giá, có hiệu lực từ 1 tháng 1, 2026.</p>
            <p>Phí dịch vụ 5% đã được bao gồm.</p>
          </div>

          <div>
            <p className="font-bold uppercase mb-1">Tiền đặt cọc bảo đảm</p>
            <p>Yêu cầu xác nhận trước/Tiền gửi bảo đảm cho mỗi đêm khi nhận phòng để đảm bảo việc đặt phòng của khách.</p>
          </div>

          <div>
            <p className="font-bold uppercase mb-1">Số người tối đa mỗi phòng</p>
            <p>Tối đa: 3 người.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxDetailModal;
