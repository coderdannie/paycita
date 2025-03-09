'use client';

import { useState } from 'react';
import SearchInput from '@/src/components/ui/SearchInput';
import { PiSlidersHorizontal } from 'react-icons/pi';
import { AiOutlinePlus } from 'react-icons/ai';
import EmployeeTable from '@/src/components/data/EmployeeMgt/EmployeeTable';
import EmployeeMgtFilter from '@/src/components/modals/EmployeeMgtFilter';
import { useRouter } from 'next/navigation';

const EmployeeMgt = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
        Employee Management
      </h2>
      <div className="flex justify-between flex-wrap items-center gap-6">
        <div className="mt-10 flex md:items-center flex-col sm:flex-row gap-4 ">
          <div className="h-[40px] max-w-[338px] w-full">
            <SearchInput
              placeholder="Search employee name"
              value={searchTerm}
              setValue={setSearchTerm}
            />
          </div>
          <button
            className="flex h-[40px] w-fit px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
            onClick={() => setIsDrawerOpen(true)}
          >
            <span>Filter</span> <PiSlidersHorizontal size={24} />
          </button>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
          onClick={() => router.push('/employee-mgt/add-personal-info')}
        >
          <span>Add Employee</span>
          <AiOutlinePlus />
        </button>
      </div>
      <EmployeeTable />
      <EmployeeMgtFilter
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
export default EmployeeMgt;
