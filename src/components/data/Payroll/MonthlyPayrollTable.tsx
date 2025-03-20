'use client';

import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';
import Link from 'next/link';

const MonthlyPayrollTable: React.FC = () => {
  const headers = [
    {
      label: 'Period',
    },
    {
      label: 'Employee Name',
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
  ];
  return (
    <div className="mt-[20px]">
      <CustomTable headers={headers} center={true}>
        {['', '']?.length ? (
          ['', '', '', ''].map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="text-[#1D2939] text-center text-sm"
            >
              <TableCell className="py-5">
                <div className="flex gap-6">
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>{' '}
                  February 2025
                </div>
              </TableCell>
              <TableCell>Sarah Johnson </TableCell>
              <TableCell>$600</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>$0.00</TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/payroll/my-payroll/${1}`}
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                  >
                    <Image
                      src="/assets/warn.svg"
                      alt="info icon"
                      width={15}
                      height={15}
                    />
                  </Link>{' '}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={headers.length} className="text-center py-6">
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/avatar.jpeg"
                  alt="No Attendance Records"
                  className="w-20 h-20 mb-4"
                />
                <p className="text-lg font-semibold text-gray-700">
                  No Payroll Records yet
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </div>
  );
};

export default MonthlyPayrollTable;
