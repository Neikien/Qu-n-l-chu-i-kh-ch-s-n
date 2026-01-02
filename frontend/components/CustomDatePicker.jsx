// ./components/CustomDatePicker.jsx
"use client"; // Component này phải là Client Component

import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays, format } from 'date-fns';
import vi from 'date-fns/locale/vi'; // Import ngôn ngữ Tiếng Việt

/**
 * CustomDatePicker Component
 * @param {object} props
 * @param {string} checkInDate - Ngày nhận phòng hiện tại (string, dd/MM/yyyy)
 * @param {string} checkOutDate - Ngày trả phòng hiện tại (string, dd/MM/yyyy)
 * @param {function} onDateChange - Hàm callback khi ngày được chọn
 */
const CustomDatePicker = ({ checkInDate, checkOutDate, onDateChange }) => {

    // Chuyển đổi chuỗi ngày tháng (dd/MM/yyyy) sang đối tượng Date
    const parseDate = (dateString) => {
        if (!dateString) return new Date();
        const [day, month, year] = dateString.split('/').map(Number);
        // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
        return new Date(year, month - 1, day);
    };

    // State nội bộ của DateRange
    const [range, setRange] = useState([
        {
            startDate: parseDate(checkInDate),
            endDate: parseDate(checkOutDate),
            key: 'selection'
        }
    ]);

    // Xử lý khi người dùng chọn một khoảng ngày
    const handleSelect = (ranges) => {
        const newRange = ranges.selection;
        setRange([newRange]);

        // Định dạng lại ngày để truyền ra ngoài Component Header
        const inDateString = format(newRange.startDate, 'dd/MM/yyyy');
        const outDateString = format(newRange.endDate, 'dd/MM/yyyy');

        onDateChange(inDateString, outDateString);
    };

    // Thiết lập ngày khởi đầu, đảm bảo không cho chọn ngày trong quá khứ
    const minDate = new Date();

    return (
        <div className="calendar-popup custom-date-range-container">
             <DateRange
                editableDateInputs={true}
                onChange={handleSelect}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={2} // Hiển thị 2 tháng
                direction="horizontal"
                minDate={minDate}
                // Thay đổi ngôn ngữ sang Tiếng Việt
                locale={vi}
                // Thêm các style tùy chỉnh nếu cần
                className="custom-date-range"
            />
        </div>
    );
};

export default CustomDatePicker;