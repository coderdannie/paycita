'use client';

import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';
import { useDashboardSelector } from '@/src/Redux/selectors';
import { useDashboard } from '@/src/context/dashboardContext';
import { formatDate, formatTime } from '@/src/utils/helper';

const TableLayer = () => {
  // Function to update filters

  const headers = [
    { label: 'Date' },
    {
      label: 'Clock In',
      // filterOptions: ['All', 'New York', 'Los Angeles'],
      // onFilterChange: (value: string) => handleFilterChange('location', value),
    },
    {
      label: 'Clock Out',
      // filterOptions: ['All', 'New York', 'Los Angeles'],
      // onFilterChange: (value: string) => handleFilterChange('location', value),
    },
    {
      label: 'Location',
      // filterOptions: ['All', 'New York', 'Los Angeles'],
      // onFilterChange: (value: string) => handleFilterChange('location', value),
    },
    {
      label: 'Status',
    },
  ];

  const { attendance } = useDashboardSelector();
  const { isAttendanceLoading } = useDashboard();

  console.log(attendance?.attendance);

  return (
    <div className="mt-[20px]">
      <CustomTable headers={headers} isLoading={isAttendanceLoading}>
        {attendance?.attendance?.length ? (
          attendance?.attendance?.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="f text-sm">
              <TableCell className="py-5">
                {formatDate(row.created_at)}
              </TableCell>
              <TableCell>{formatTime(row?.clock_in)}</TableCell>
              <TableCell>{formatTime(row?.clock_out)}</TableCell>
              <TableCell>{row?.location}</TableCell>
              <TableCell>
                <span
                  className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                    ${
                      row?.status === 'present'
                        ? 'text-green-600  border-[#89D8A9]  bg-[#F5FFFA]'
                        : 'text-red-600   border-[#F49E9E] bg-[#FFF5F5]'
                    }
                  `}
                >
                  {row?.status}
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={headers.length} className="text-center py-6">
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/emptystate.svg"
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
export default TableLayer;
