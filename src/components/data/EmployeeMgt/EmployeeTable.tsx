'use client';

import { useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';
import Link from 'next/link';

const EmployeeTable = () => {
  const [status] = useState('Active');
  const headers = [
    {
      label: 'Employee Name',
    },

    {
      label: 'Employee Email',
    },
    {
      label: 'Job Title',
    },
    {
      label: 'Job Level',
    },
    {
      label: 'Employee Status ',
    },
    {
      label: '',
    },
  ];

  return (
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
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>{' '}
                  Sarah Johnson
                </div>
              </TableCell>
              <TableCell>sarah.johnson@email.com</TableCell>
              <TableCell>Product Development</TableCell>
              <TableCell>Staff</TableCell>

              <TableCell>
                <span
                  className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                    ${
                      status === 'Active'
                        ? 'text-green-600  border-[#89D8A9]  bg-[#F5FFFA]'
                        : 'text-red-600   border-[#F49E9E] bg-[#FFF5F5]'
                    }
                  `}
                >
                  {status}
                </span>
              </TableCell>
              <TableCell>
                {' '}
                <Link
                  href={`/employee-mgt/${1}`}
                  className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                >
                  <Image
                    src="/assets/warn.svg"
                    alt="info icon"
                    width={15}
                    height={15}
                  />
                </Link>{' '}
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
export default EmployeeTable;
