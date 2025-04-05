'use client';

import PaySlips from '@/src/components/data/Payroll/MyPayrollTabs/Payroll';
import Pension from '@/src/components/data/Payroll/MyPayrollTabs/Pension';
import Tax from '@/src/components/data/Payroll/MyPayrollTabs/Tax';
import { useState } from 'react';

const MY_PAYROLL_TABS = ['Payroll', 'Tax', 'Pension'];

const MyPayrollTabs = () => {
  const [tab, setTab] = useState(MY_PAYROLL_TABS[0]);

  return (
    <div>
      <h3 className="font-bold text-[#1D2939] pt-2 text-lg md:text-xl">
        {tab}
      </h3>
      <ul className="pt-5  flex flex-col md:flex-row items-center gap-5 text-sm border-[#E4E7EC] border-b">
        {MY_PAYROLL_TABS.map((dat, i) => (
          <li
            key={i}
            className={`py-3 cursor-pointer ${
              tab === dat
                ? 'text-primary border-b-[3px] border-primary'
                : 'text-[#667085] '
            }`}
            onClick={() => setTab(dat)}
          >
            {dat}
          </li>
        ))}
      </ul>
      <div className=" mt-9">
        {tab === 'Payroll' ? (
          <PaySlips />
        ) : tab === 'Tax' ? (
          <Tax />
        ) : (
          <Pension />
        )}
      </div>
    </div>
  );
};
export default MyPayrollTabs;
