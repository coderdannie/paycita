'use client';

import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';

import { formatBackendTime, formatDate } from '@/src/utils/helper';
import { EmployeeAttendanceData } from '@/src/types/attendance';
import TableEmptyState from '../../common/TableEmptyState';

const TableLayer = ({
  attendance,
}: {
  attendance: EmployeeAttendanceData[] | AttendanceRecord[];
}) => {
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

  return (
    <div className="mt-[20px]">
      <CustomTable headers={headers} isLoading={false}>
        {attendance?.length ? (
          attendance?.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="f text-sm">
              <TableCell className="py-5">
                {formatDate(row.created_at)}
              </TableCell>
              <TableCell>
                {row.clock_in ? formatBackendTime(row.clock_in) : 'N/A'}
              </TableCell>
              <TableCell>
                {row.clock_out ? formatBackendTime(row.clock_out) : 'N/A'}
              </TableCell>
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
          <TableEmptyState
            headers={headers}
            messageTitle="No Attendance Records"
            desc="Clock in and out to track your attendance"
          />
        )}
      </CustomTable>
    </div>
  );
};
export default TableLayer;
