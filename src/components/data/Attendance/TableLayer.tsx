'use client';
import { useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { myAttendanceTableData } from '../../common/constants';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';

const TableLayer = () => {
  const [filters, setFilters] = useState({
    status: '', // Default value
    location: '',
  });

  // Function to update filters
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  console.log(filters);
  const headers = [
    { label: 'Date' },
    {
      label: 'Clock In',
      filterOptions: ['All', 'New York', 'Los Angeles'],
      onFilterChange: (value: string) => handleFilterChange('location', value),
    },
    {
      label: 'Clock Out',
      filterOptions: ['All', 'New York', 'Los Angeles'],
      onFilterChange: (value: string) => handleFilterChange('location', value),
    },
    {
      label: 'Location',
      filterOptions: ['All', 'New York', 'Los Angeles'],
      onFilterChange: (value: string) => handleFilterChange('location', value),
    },
    {
      label: 'Status',
    },
  ];

  return (
    <div className="mt-[20px]">
      <CustomTable headers={headers}>
        {myAttendanceTableData?.length ? (
          myAttendanceTableData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-[#1D2939] text-sm">
              <TableCell className="py-5">{row.date}</TableCell>
              <TableCell>{row.clockIn}</TableCell>
              <TableCell>{row.clockOut}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>
                <span
                  className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                    ${
                      row.status === 'Present'
                        ? 'text-green-600  border-[#89D8A9]  bg-[#F5FFFA]'
                        : 'text-red-600   border-[#F49E9E] bg-[#FFF5F5]'
                    }
                  `}
                >
                  {row.status}
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
  );
};
export default TableLayer;
