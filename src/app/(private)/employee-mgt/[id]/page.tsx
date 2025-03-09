'use client';

import { useState } from 'react';
import { employeeDetailsTabs } from '@/src/components/common/constants';
import PersonalInfo from '@/src/components/data/EmployeeMgt/Tabs/PersonalInfo';
import EmployeeDetail from '@/src/components/data/EmployeeMgt/Tabs/EmployeeDetails';
import Attendance from '@/src/components/data/EmployeeMgt/Tabs/Attendance';
import PayrollHistory from '@/src/components/data/EmployeeMgt/Tabs/PaymentHistory';
import LeaveHistory from '@/src/components/data/EmployeeMgt/Tabs/LeaveHistory';

const EmployeeDetails = () => {
  const [tab, setTab] = useState(employeeDetailsTabs[0]);

  return (
    <div>
      <div className="flex text-xs gap-1">
        <div className="text-primary ">
          <p>Employee Management</p>{' '}
        </div>
        <p className="text-[#667085]">/ Sarah Johnson</p>
      </div>
      <h3 className="font-bold text-[#1D2939] pt-2 text-lg md:text-xl">
        Detail Employee
      </h3>
      <ul className="pt-5  flex flex-col md:flex-row items-center gap-5 text-sm border-[#E4E7EC] border-b">
        {employeeDetailsTabs?.map((dat, i) => (
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
        {tab.includes('Personal') ? (
          <PersonalInfo />
        ) : tab.includes('Employee') ? (
          <EmployeeDetail />
        ) : tab.includes('Attendance') ? (
          <Attendance />
        ) : tab.includes('Payroll') ? (
          <PayrollHistory />
        ) : (
          <LeaveHistory />
        )}
      </div>
    </div>
  );
};
export default EmployeeDetails;
