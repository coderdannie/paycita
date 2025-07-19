'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { useCallback, useMemo, useState } from 'react';
import { formatDate, parseDateString } from '@/src/utils/helper';

import Calendar from 'react-calendar';

import { LuCalendarDays } from 'react-icons/lu';
import LeaveHistoryTable from '../LeaveHistoryTable';
import { useSearchParams } from 'next/navigation';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import CustomPagination from '@/src/components/common/pagination/Pagination';
import { IoClose } from 'react-icons/io5';
export interface Leave {
  line_manager_status: string;
  id: number | string;
  approved_by: string;
  comment: string;
  duration: string;
  end_date: string;
  leave_type: string;
  request_date: string;
  start_date: string;
  status: string;
  pending_with: string;
}
const LeaveHistory = ({ leave }: { leave: Leave[] }) => {
  const updateSearchParams = useUpdateSearchParams();
  const searchParams = useSearchParams();
  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [showCalendar, setShowCalendar] = useState(false);

  const leaveType = ['Annual', 'Sick', 'Personal', 'Maternity', 'Unpaid'];

  const limit = 10;
  const currentPage = Number(searchParams.get('page') || 1);
  const dateFilter = searchParams.get('date') || '';
  const typeFilter = searchParams.get('type') || '';
  const statusFilter = searchParams.get('status') || '';

  const selectedDate = useMemo(() => {
    return dateFilter ? parseDateString(dateFilter) : null;
  }, [dateFilter]);

  const handleDateChange = useCallback(
    (value: Date | Date[] | [Date | null, Date | null] | null) => {
      if (value instanceof Date) {
        const dateToSet = new Date(value);
        dateToSet.setHours(0, 0, 0, 0);
        updateSearchParams({
          date: formatDate(dateToSet),
          page: '1',
        });
        setShowCalendar(false);
      }
    },
    [updateSearchParams]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setType(value);
      updateSearchParams({
        type: value === 'all' ? '' : value,
        page: '1',
      });
    },
    [updateSearchParams]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatus(value);
      updateSearchParams({
        status: value === 'all' ? '' : value,
        page: '1',
      });
    },
    [updateSearchParams]
  );

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() }, { scroll: true });
    },
    [updateSearchParams]
  );

  const handleClearDate = useCallback(() => {
    updateSearchParams({
      date: '',
      page: '1',
    });
  }, [updateSearchParams]);

  const filteredLeave = useMemo(() => {
    let filtered = leave;

    // Apply date filter
    if (selectedDate) {
      filtered = filtered?.filter((item) => {
        const itemDate = parseDateString(item.request_date);
        const selectedDateObj = selectedDate;

        return (
          itemDate.getFullYear() === selectedDateObj.getFullYear() &&
          itemDate.getMonth() === selectedDateObj.getMonth() &&
          itemDate.getDate() === selectedDateObj.getDate()
        );
      });
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered?.filter((item) =>
        item.leave_type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered?.filter((item) =>
        item.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    return filtered;
  }, [leave, selectedDate, typeFilter, statusFilter]);

  const paginatedLeave = useMemo(() => {
    return filteredLeave?.slice((currentPage - 1) * limit, currentPage * limit);
  }, [filteredLeave, currentPage, limit]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredLeave.length / limit);
  }, [filteredLeave, limit]);

  return (
    <div>
      <div className="flex  flex-wrap gap-5 max-w-[780px] items-center">
        <p className="text-[#1D2939] font-semibold flex-1">Leave History</p>
        <div className="flex-1">
          <Select onValueChange={handleTypeChange} value={type || 'all'}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Type</SelectItem>
              {leaveType.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select onValueChange={handleStatusChange} value={status || 'all'}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Status</SelectItem>
              {['Approved', 'Rejected', 'Pending'].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-[2] box">
          <div className="w-full relative">
            <div
              className="flex gap-2 border-2 bg-white border-[#E4E7EC] h-10 w-full rounded-lg cursor-pointer items-center px-3"
              onClick={() => setShowCalendar(!showCalendar)}
              aria-label="Select date"
            >
              <LuCalendarDays className="text-[#5B5B5B]" />
              <span className="text-sm text-[#292D32]">
                {selectedDate ? formatDate(selectedDate) : 'Select date'}
              </span>
              {selectedDate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearDate();
                  }}
                  className="ml-auto"
                  aria-label="Clear date"
                >
                  <IoClose className="text-[#5B5B5B]" />
                </button>
              )}
            </div>

            {/* Calendar popup */}
            {showCalendar && (
              <div className="absolute max-w-[350px] mt-2 w-full z-30">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate || new Date()} // Default to today's date
                  tileClassName={
                    ({ date }) =>
                      date.getDay() === 0 || date.getDay() === 6
                        ? 'weekend'
                        : '' // Optional: Style weekends
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <LeaveHistoryTable leave={paginatedLeave} />
      {totalPages > 1 && (
        <div className="mt-6">
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            goToPage={goToPage}
          />
        </div>
      )}
    </div>
  );
};
export default LeaveHistory;
