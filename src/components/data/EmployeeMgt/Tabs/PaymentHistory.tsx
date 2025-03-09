'use client';

import { useState } from 'react';

import Calendar from 'react-calendar';
import { formatDate } from '@/src/utils/helper';
import { LuCalendarDays } from 'react-icons/lu';
import PaymentHisTable from '../PaymentHisTable';

const PaymentHistory = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const handleDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setDate(value);
      setShowCalendar(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-5 max-w-[480px] sm:items-center">
        <p className="text-[#1D2939] font-semibold flex-1">Payroll History</p>

        <div className="flex-[3] box">
          <div className="w-full relative">
            {/* Input-like div */}
            <div
              className={`flex gap-2 border-2 bg-[#ffff]  border-[#E4E7EC] h-[40px] w-full rounded-[10px] cursor-pointer  items-center p-[10px]`}
              onClick={() => setShowCalendar((prev) => !prev)}
            >
              <div>
                <LuCalendarDays className="mr-2 h-4 w-4 text-[#5B5B5B]" />
              </div>
              <p className="text-xs text-[#292D32]">
                {date ? formatDate(date) : 'Select date'}
              </p>
            </div>

            {/* Calendar popup */}
            {showCalendar && (
              <div className="absolute max-w-[350px] mt-2 w-full z-30">
                <Calendar
                  onChange={handleDateChange}
                  value={date || new Date()} // Default to today's date
                  tileClassName={
                    ({ date }) =>
                      date.getDay() === 0 || date.getDay() === 6
                        ? 'weekend'
                        : '' // Optional: Style weekends
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <PaymentHisTable />
    </div>
  );
};
export default PaymentHistory;
