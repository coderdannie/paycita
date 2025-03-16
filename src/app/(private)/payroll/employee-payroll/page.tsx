'use client';

import MyPayrollTable from '@/src/components/data/Payroll/MyPayrollTable';
import SearchInput from '@/src/components/ui/SearchInput';

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import GeneratePayroll from '@/src/components/modals/GeneatePayroll';

const EmployeePayRoll = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [status, setStatus] = useState('This Month');
  const [isOpen, setIsOpen] = useState(false);

  const headers = [
    {
      label: 'Period',
    },
    {
      label: 'Base Salary',
    },
    {
      label: 'Allowance',
    },
    {
      label: 'Deductions',
    },
    {
      label: 'Take Home Pay',
    },

    {
      label: '',
    },
  ];

  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">Payroll</h2>
      <div className="flex  justify-between flex-wrap items-center gap-6 mt-10 ">
        <div className="flex md:items-center flex-col sm:flex-row gap-4 ">
          <div className="h-[40px] max-w-[438px] w-full">
            <SearchInput
              placeholder="Search employee name"
              value={searchTerm}
              setValue={setSearchTerm}
            />
          </div>
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={status} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {['This Month', 'Last week'].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
          onClick={() => setIsOpen(true)}
        >
          <span>Generate Payroll</span>
          <AiOutlinePlus />
        </button>
      </div>
      <MyPayrollTable headers={headers} hidden />
      <GeneratePayroll isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
export default EmployeePayRoll;
