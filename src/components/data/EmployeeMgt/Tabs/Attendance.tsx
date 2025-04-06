"use client";

import { useCallback, useMemo, useState } from "react";
import TableLayer from "../../Attendance/TableLayer";
import Calendar from "react-calendar";
import { formatDate, parseDateString } from "@/src/utils/helper";
import { LuCalendarDays } from "react-icons/lu";
import { EmployeeAttendanceData } from "@/src/types/attendance";
import { useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import { IoClose } from "react-icons/io5";

interface AttendanceProps {
  attendance: EmployeeAttendanceData[];
}

const Attendance = ({ attendance }: AttendanceProps) => {
  const updateSearchParams = useUpdateSearchParams();
  const [showCalendar, setShowCalendar] = useState(false);
  const searchParams = useSearchParams();

  const limit = 10;
  const currentPage = Number(searchParams.get("page") || 1);
  const dateFilter = searchParams.get("date") || "";

  const selectedDate = useMemo(() => {
    return dateFilter ? parseDateString(dateFilter) : null;
  }, [dateFilter]);

  const handleDateChange = useCallback(
    (value: Date | Date[] | [Date | null, Date | null] | null) => {
      if (value instanceof Date) {
        updateSearchParams({
          date: formatDate(value),
          page: "1",
        });
        setShowCalendar(false);
      }
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
      date: "",
      page: "1",
    });
  }, [updateSearchParams]);

  const filteredAttendance = useMemo(() => {
    if (!selectedDate) return attendance;

    return attendance.filter((item) => {
      const itemDate = parseDateString(item.attendance_date);
      return (
        itemDate.getFullYear() === selectedDate.getFullYear() &&
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getDate() === selectedDate.getDate()
      );
    });
  }, [attendance, selectedDate]);

  const paginatedAttendance = useMemo(() => {
    return filteredAttendance.slice(
      (currentPage - 1) * limit,
      currentPage * limit
    );
  }, [filteredAttendance, currentPage, limit]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAttendance.length / limit);
  }, [filteredAttendance, limit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <h2 className="text-[#1D2939] font-semibold text-lg">Attendance</h2>

        <div className="relative w-full max-w-[250px]">
          <div
            className="flex gap-2 border-2 bg-white border-[#E4E7EC] h-10 w-full rounded-lg cursor-pointer items-center px-3"
            onClick={() => setShowCalendar(!showCalendar)}
            aria-label="Select date"
          >
            <LuCalendarDays className="text-[#5B5B5B]" />
            <span className="text-sm text-[#292D32]">
              {selectedDate ? formatDate(selectedDate) : "Select date"}
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

          {showCalendar && (
            <div className="absolute z-30 mt-1 w-full">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate || new Date()}
                tileClassName={({ date, view }) =>
                  view === "month" &&
                  (date.getDay() === 0 || date.getDay() === 6)
                    ? "weekend"
                    : ""
                }
              />
            </div>
          )}
        </div>
      </div>

      <TableLayer attendance={paginatedAttendance} />

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

export default Attendance;
