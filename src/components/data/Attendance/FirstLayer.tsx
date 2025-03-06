'use client';

import { useState } from 'react';
import { AiFillClockCircle } from 'react-icons/ai';
import { attendanceCount } from '../../common/constants';
import Checkout from '../../modals/Checkout';

const FirstLayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
            My Attendance
          </h2>
          <p className="pt-2 font-medium">Monday, January 29, 2025 - 9:03 AM</p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
          onClick={() => setIsOpen(true)}
        >
          <AiFillClockCircle /> <span>Check Out 08:00:05 Hrs</span>
        </button>
      </div>
      <div className="grid md:grid-cols-3 mt-5 gap-6">
        {attendanceCount.map((data, i) => (
          <div
            key={i}
            className="bg-[#FCFCFC] min-h-[140px] rounded-[8px] border border-[#E4E7EC] py-6 px-[22px] grid "
          >
            <h4 className="text-[#808191] text-sm">{data?.title}</h4>
            <p
              style={{ alignSelf: 'end' }}
              className="text-[#11142D] text-2xl font-bold  "
            >
              {data?.value}
            </p>
          </div>
        ))}
      </div>
      <Checkout isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};
export default FirstLayer;
