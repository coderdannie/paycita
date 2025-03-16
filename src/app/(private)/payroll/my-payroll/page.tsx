'use client';

import MyPayrollTable from '@/src/components/data/Payroll/MyPayrollTable';
import { useRouter } from 'next/navigation';
import { FaFileArrowDown } from 'react-icons/fa6';

const MyPayroll = () => {
  const router = useRouter();

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
      label: 'Status',
    },

    {
      label: '',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
            Payslips
          </h2>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
          onClick={() => router.push('/payroll/payslips')}
        >
          <FaFileArrowDown />
          <span>Download as PDF</span>
        </button>
      </div>
      <MyPayrollTable headers={headers} />
    </div>
  );
};
export default MyPayroll;
