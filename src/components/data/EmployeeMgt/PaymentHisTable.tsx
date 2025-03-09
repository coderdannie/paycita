'use client';

import { useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';

const PaymentHisTable = () => {
  const [status] = useState('Paid');
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
  ];

  return (
    <div>
      <div className="mt-[20px]">
        <CustomTable headers={headers} center={true}>
          {['', '']?.length ? (
            ['', ''].map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="text-[#1D2939] text-center text-sm"
              >
                <TableCell className="py-5">
                  <div className="flex gap-6">
                    <div className="border-2 border-[#E4E7EC] w-5 aspect-square rounded bg-white"></div>{' '}
                    Jan 2025
                  </div>
                </TableCell>
                <TableCell>$3,000 </TableCell>
                <TableCell>$600</TableCell>
                <TableCell>Staff</TableCell>

                <TableCell>$600</TableCell>
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
                    Paid
                  </span>
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
    </div>
  );
};
export default PaymentHisTable;
