'use client';

import TableLayer from '@/src/components/data/Attendance/EmployeeTable';

const EmployeeAttendance = () => {
  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
        Employee Attendance
      </h2>
      <TableLayer />
    </div>
  );
};
export default EmployeeAttendance;
