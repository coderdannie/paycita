'use client';

import { useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';
import Link from 'next/link';
import { LuArrowDownToLine } from 'react-icons/lu';

interface Header {
  label: string;
}

interface MyPayrollTableProps {
  headers: Header[];
  hidden?: boolean;
}

const EmployeePayroll: React.FC<MyPayrollTableProps> = ({ headers }) => {
  const [status] = useState('Paid');

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
                  Feb 2025
                </div>
              </TableCell>
              <TableCell>$3,000 </TableCell>
              <TableCell>$600</TableCell>
              <TableCell>$0.00</TableCell>
              <TableCell>$0.00</TableCell>

              <TableCell>
                <span
                  className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                      ${
                        status === 'Paid'
                          ? 'text-green-600  border-[#89D8A9]  bg-[#F5FFFA]'
                          : 'text-red-600   border-[#F49E9E] bg-[#FFF5F5]'
                      }
                    `}
                >
                  {status}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/payroll/employee-payroll/${1}`}
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                  >
                    <Image
                      src="/assets/warn.svg"
                      alt="info icon"
                      width={15}
                      height={15}
                    />
                  </Link>{' '}
                  <button className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded">
                    <LuArrowDownToLine />
                  </button>
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
                  No Attendance Records
                </p>
                <p className="text-sm text-gray-500">
                  Clock in and out to track your attendance
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </div>
  );
};

export default EmployeePayroll;
