'use client';
import { useCallback, useMemo, useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';
import { useDashboardSelector } from '@/src/Redux/selectors';
import { useDashboard } from '@/src/context/dashboardContext';
import { formatBackendTime, formatDate } from '@/src/utils/helper';
import SearchInput from '../../ui/SearchInput';
import { PiSlidersHorizontal } from 'react-icons/pi';
import FilterDrawer from '../../modals/FilterDrawer';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useSearchParams } from 'next/navigation';
import CustomPagination from '../../common/pagination/Pagination';
import { useDispatch } from 'react-redux';
import { setFilters } from '@/src/Redux/features/dashboardSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  employeeFilterSchema,
  EmployeeFilterSchemaType,
} from '@/src/utils/validations';

const TableLayer = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { employeeAttendance, employeeAttendancePagination, filters } =
    useDashboardSelector();
  const { isEmployeeAttendanceLoading } = useDashboard();
  const updateSearchParams = useUpdateSearchParams();

  const currentPage = searchParams.get('page') || '1';
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';
  const title = searchParams.get('job_title') || '';

  const [searchTerm, setSearchTerm] = useState(search);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const form = useForm<EmployeeFilterSchemaType>({
    resolver: zodResolver(employeeFilterSchema),
    defaultValues: {
      status,
      job_title: title,
    },
  });

  const headers = useMemo(
    () => [
      { label: 'Attendance Date' },
      { label: 'Employee Name' },
      { label: 'Job Title' },
      { label: 'Clock In' },
      { label: 'Clock Out' },
      { label: 'Clock out comment' },
      { label: 'Hours Worked' },
      { label: 'Overtime' },
      { label: 'Location' },
      { label: 'Status' },
    ],
    []
  );

  const onSubmit = useCallback(
    (data: EmployeeFilterSchemaType) => {
      updateSearchParams({ ...filters, ...data, page: '1' });
      dispatch(setFilters({ ...filters, ...data, page: '1' }));
      setIsDrawerOpen(false);
    },
    [dispatch, filters, updateSearchParams]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateSearchParams({
        ...filters,
        employee_name: value,
        page: '1',
      });
      dispatch(
        setFilters({
          ...filters,
          employee_name: value,
          page: '1',
        })
      );
    },
    [dispatch, filters, updateSearchParams]
  );

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams(
        { ...filters, page: page.toString() },
        {
          scroll: true,
        }
      );
      dispatch(setFilters({ ...filters, page: page.toString() }));
    },
    [dispatch, filters, updateSearchParams]
  );

  const handleResetFilters = useCallback(() => {
    const resetFilters = { ...filters, status: '', job_title: '', page: '1' };
    dispatch(setFilters(resetFilters));
    updateSearchParams(resetFilters);
    setIsDrawerOpen(false);
    form.reset({ status: '', job_title: '' });
  }, [dispatch, filters, form, updateSearchParams]);

  const renderEmptyState = useMemo(
    () => (
      <TableRow>
        <TableCell colSpan={headers.length} className="text-center py-6">
          <div className="flex flex-col items-center">
            <Image
              src="/assets/emptystate.svg"
              alt="No Attendance Records"
              width={80}
              height={80}
              className="mb-4"
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
    ),
    [headers.length]
  );

  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px] w-[50%] text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
      ${
        status === 'present'
          ? 'text-green-600 border-[#89D8A9] bg-[#F5FFFA]'
          : 'text-red-600 border-[#F49E9E] bg-[#FFF5F5]'
      }`}
      >
        {status}
      </span>
    ),
    []
  );
 
  return (
    <div className="mt-10">
      <div className="flex items-center gap-4">
        <div className="h-[40px] max-w-[338px] w-full">
          <SearchInput
            placeholder="Search employee name"
            value={searchTerm}
            setValue={handleSearchChange}
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
        <CustomTable headers={headers} isLoading={isEmployeeAttendanceLoading}>
          {employeeAttendance?.length > 0
            ? employeeAttendance.map((row, rowIndex) => (
                <TableRow
                  key={`${row.id}-${rowIndex}`}
                  className="text-[#1D2939] text-sm"
                >
                  <TableCell className="py-5">
                    {formatDate(row.created_at)}
                  </TableCell>
                  <TableCell>{row.employee_name}</TableCell>
                  <TableCell>{row.job_title}</TableCell>
                  <TableCell>
                    {row.clock_in ? formatBackendTime(row.clock_in) : 'N/A'}
                  </TableCell>

                  <TableCell>
                    {row.clock_out ? formatBackendTime(row.clock_out) : 'N/A'}
                  </TableCell>
                  <TableCell>{row.clock_out_comment ?? 'N/A'}</TableCell>
                  <TableCell>{row.hours_worked ?? 'N/A'}</TableCell>
                  <TableCell>{row.overtime}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{renderStatusBadge(row.status)}</TableCell>
                </TableRow>
              ))
            : renderEmptyState}
        </CustomTable>

        {employeeAttendancePagination?.total_pages > 1 && (
          <CustomPagination
            totalPages={employeeAttendancePagination.total_pages}
            currentPage={+currentPage}
            goToPage={goToPage}
          />
        )}

        <FilterDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          employeeAttendance={employeeAttendance}
          form={form}
          onSubmit={onSubmit}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
};

export default TableLayer;
