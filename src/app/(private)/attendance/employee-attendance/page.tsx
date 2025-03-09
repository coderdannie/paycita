'use client';

import TableLayer from '@/src/components/data/Attendance/EmployeeTable';
import FilterDrawer from '@/src/components/modals/FilterDrawer';
import SearchInput from '@/src/components/ui/SearchInput';
import { useState } from 'react';
import { PiSlidersHorizontal } from 'react-icons/pi';

const EmployeeAttendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
        Employee Attendance
      </h2>
      <div className="mt-10 flex items-center gap-4 ">
        <div className="h-[40px] max-w-[338px] w-full">
          <SearchInput
            placeholder="Search employee name"
            value={searchTerm}
            setValue={setSearchTerm}
          />
        </div>
        <button
          className="flex h-[40px] px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
          onClick={() => setIsDrawerOpen(true)}
        >
          <span>Filter</span> <PiSlidersHorizontal size={24} />
        </button>
      </div>
      <TableLayer />
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
export default EmployeeAttendance;
