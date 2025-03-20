'use client';

import { useState } from 'react';

import GeneratePayroll from '@/src/components/modals/GeneatePayroll';
import EmployeePayroll from '@/src/components/data/Payroll/EmployeePayroll';

const EmployeePayRoll = () => {
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
      label: 'status',
    },

    {
      label: '',
    },
  ];

  return (
    <div>
      <div className="flex  justify-between flex-wrap items-center gap-6  ">
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Payslips
        </h2>
        <button
          className="gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
          onClick={() => setIsOpen(true)}
        >
          Generate Payslip
        </button>
      </div>
      <EmployeePayroll headers={headers} />
      <GeneratePayroll isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
export default EmployeePayRoll;
