'use client';
import { useMemo, useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';
import { useDashboardSelector } from '@/src/Redux/selectors';
import { useDashboard } from '@/src/context/dashboardContext';
import { formatDate, formatTime } from '@/src/utils/helper';
import SearchInput from '../../ui/SearchInput';
import { PiSlidersHorizontal } from 'react-icons/pi';
import FilterDrawer from '../../modals/FilterDrawer';

const TableLayer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { employeeAttendance } = useDashboardSelector();
  const { isAttendanceLoading } = useDashboard();

  // Updated filter state to include job_title instead of location
  const [filter, setFilters] = useState({
    status: '', // Default value
    job_title: '',
  });

  // Function to update filters
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const headers = [
    { label: 'Attendance Date' },
    { label: 'Employee Name' },
    { label: 'Job Title' },
    { label: 'Clock In' },
    { label: 'Clock Out' },
    { label: 'Clock out comment' },
    { label: 'Hours Worked' },
    { label: 'Location' },
    { label: 'Overtime' },
    { label: 'Status' },
  ];

  const filteredAttendance = useMemo(() => {
    return employeeAttendance?.filter((attendance) => {
      // Search by employee name (case insensitive)
      const matchesSearch = attendance.employee_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filter by status if specified - make sure to match exact values
      const matchesStatus =
        !filter.status ||
        attendance.status.toLowerCase() === filter.status.toLowerCase();

      // Filter by job title if specified
      const matchesJobTitle =
        !filter.job_title || attendance.job_title === filter.job_title;

      return matchesSearch && matchesStatus && matchesJobTitle;
    });
  }, [employeeAttendance, searchTerm, filter.status, filter.job_title]);
  return (
    <>
      <div className="mt-10 flex items-center gap-4">
        <div className="h-[40px] max-w-[338px] w-full">
          <SearchInput
            placeholder="Search employee name"
            value={searchTerm}
            setValue={setSearchTerm}
          />
        </div>
        <button
          className="flex h-[40px] px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
          onClick={() => setIsDrawerOpen(true)}
        >
          <span>Filter</span> <PiSlidersHorizontal size={24} />
        </button>
      </div>

      <div className="mt-[20px]">
        <CustomTable headers={headers} isLoading={isAttendanceLoading}>
          {filteredAttendance?.length ? (
            filteredAttendance.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="text-[#1D2939] text-sm">
                <TableCell className="py-5">
                  {formatDate(row.created_at)}
                </TableCell>
                <TableCell>{row?.employee_name}</TableCell>
                <TableCell>{row?.job_title}</TableCell>
                <TableCell>{formatTime(row?.clock_in)}</TableCell>
                <TableCell>{formatTime(row?.clock_out)}</TableCell>
                <TableCell>{row?.clock_out_comment ?? 'N/A'}</TableCell>
                <TableCell>{row?.hours_worked ?? 'N/A'}</TableCell>
                <TableCell>{row?.overtime}</TableCell>
                <TableCell>{row?.location}</TableCell>
                <TableCell>
                  <span
                    className={`py-[5px] w-[50%] text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
                    ${
                      row.status === 'present'
                        ? 'text-green-600 border-[#89D8A9] bg-[#F5FFFA]'
                        : 'text-red-600 border-[#F49E9E] bg-[#FFF5F5]'
                    }`}
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
                    src="/assets/emptystate.svg"
                    alt="No Attendance Records"
                    width={30}
                    height={30}
                    className="w-20 h-20 mb-4"
                  />
                  <p className="text-lg font-semibold text-gray-700">
                    No Matching Records Found
                  </p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </CustomTable>

        <FilterDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          employeeAttendance={employeeAttendance}
          filter={filter}
          onFilterChange={handleFilterChange}
          onResetFilters={() => setFilters({ status: '', job_title: '' })}
        />
      </div>
    </>
  );
};
export default TableLayer;
