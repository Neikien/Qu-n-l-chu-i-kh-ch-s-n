// ./components/CustomDatePicker.jsx
"use client";
import { apiService } from '../services/apiService';
import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, format } from 'date-fns';
import vi from 'date-fns/locale/vi';

const CustomDatePicker = ({ checkInDate, checkOutDate, onDateChange }) => {

    // Chuyển đổi chuỗi ngày tháng (dd/MM/yyyy) sang đối tượng Date
    const parseDate = (dateString) => {
        if (!dateString) return new Date();
        try {
            const [day, month, year] = dateString.split('/').map(Number);
            // Validate numbers
            if (isNaN(day) || isNaN(month) || isNaN(year)) {
                return new Date();
            }
            return new Date(year, month - 1, day);
        } catch (error) {
            console.error('Parse date error:', error);
            return new Date();
        }
    };

    // State nội bộ của DateRange - FIX: Đảm bảo không có NaN
    const [range, setRange] = useState([
        {
            startDate: parseDate(checkInDate),
            endDate: parseDate(checkOutDate),
            key: 'selection'
        }
    ]);

    // Cập nhật range khi props thay đổi
    useEffect(() => {
        const start = parseDate(checkInDate);
        const end = parseDate(checkOutDate);
        
        // Đảm bảo không có NaN
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return;
        }
        
        setRange([{
            startDate: start,
            endDate: end,
            key: 'selection'
        }]);
    }, [checkInDate, checkOutDate]);

    // Xử lý khi người dùng chọn một khoảng ngày
    const handleSelect = (ranges) => {
        const newRange = ranges.selection;
        
        // Kiểm tra valid date
        if (isNaN(newRange.startDate.getTime()) || isNaN(newRange.endDate.getTime())) {
            return;
        }
        
        setRange([newRange]);

        // Định dạng lại ngày để truyền ra ngoài
        const inDateString = format(newRange.startDate, 'dd/MM/yyyy');
        const outDateString = format(newRange.endDate, 'dd/MM/yyyy');

        onDateChange(inDateString, outDateString);
    };

    // Thiết lập ngày khởi đầu
    const minDate = new Date();
    
    // Đảm bảo minDate không bị NaN
    if (isNaN(minDate.getTime())) {
        return <div>Loading calendar...</div>;
    }

    return (
        <div className="calendar-popup custom-date-range-container">
            <DateRange
                editableDateInputs={true}
                onChange={handleSelect}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={2}
                direction="horizontal"
                minDate={minDate}
                locale={vi}
                // FIX QUAN TRỌNG: Chuyển months thành number string
                monthDisplayFormat="MMMM yyyy"
                rangeColors={['#3b82f6']}
                showMonthAndYearPickers={true}
                showDateDisplay={false}
                className="custom-date-range"
            />
        </div>
    );
};

export default CustomDatePicker;
