'use client';

import { useEffect, useState, useMemo } from 'react';

import { attendanceCount } from '../../common/constants';
import Checkout from '../../modals/Checkout';

import { useDashboard } from '@/src/context/dashboardContext';
import { Skeleton } from '../../ui/skeleton';
import { Clock } from 'lucide-react';

const FirstLayer = ({ attendance }: { attendance: AttendanceSummary }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAttendanceLoading, currentDateTime, handleClockIn, isClockingIn, isClockingOut, handleClockOut } = useDashboard();


  const isClockedIn = attendance?.is_clocked_in;
  const currentAttendance = attendance?.attendance[0];
  const clockedInTime = currentAttendance?.clock_in;
  const [elapsedTime, setElapsedTime] = useState("00:00:00");


  const formatTimeElapsed = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };


  useEffect(() => {
    if (isClockedIn && clockedInTime) {
      setElapsedTime(formatTimeElapsed(clockedInTime));
      const timer = setInterval(() => {
        setElapsedTime(formatTimeElapsed(clockedInTime));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isClockedIn, clockedInTime]);

  const buttonClassName = useMemo(() => {
    const baseClasses = "flex py-2 px-4 capitalize text-md space-x-2 text-center items-center justify-center rounded-md text-white";
    const stateClasses = isClockedIn ? "bg-[#692E9F]" : "bg-[#9B73BF]";
    const loadingClasses = isClockingIn ? "opacity-50 cursor-not-allowed" : "";
    return `${baseClasses} ${stateClasses} ${loadingClasses}`;
  }, [isClockedIn, isClockingIn]);

  return (
    <div>
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
            My Attendance
          </h2>
          <p className="text-sm text-gray-800 pt-2">{currentDateTime}</p>
        </div>

        <button
          className={buttonClassName}
          onClick={() => (isClockedIn ? setIsOpen(true) : handleClockIn())}
          disabled={isClockingIn}
        >
          {isClockingIn ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <Clock fill="#fff" stroke="#8758B2" />
          )}
          <p className="text-sm">
            {isClockedIn ? `Time Elapsed: ${elapsedTime}` : "Check In"}
          </p>
        </button>

      </div>
      <div className="grid md:grid-cols-4 mt-5 gap-6 w-full">
        {isAttendanceLoading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="min-h-[140px]" />
          ))
        ) : (
          <>
            {attendanceCount.map((data, i) => (
              <div
                key={i}
                className="bg-[#FCFCFC] min-h-[140px]  rounded-[8px] border border-[#E4E7EC] py-6 px-[22px] grid "
              >
                <h4 className="text-[#808191] text-sm">{data?.title}</h4>
                <p
                  style={{ alignSelf: 'end' }}
                  className="text-[#11142D] text-2xl font-bold  "
                >
                  {i === 0
                    ? attendance?.total_working_days
                    : i === 1
                      ? attendance?.days_present
                      : i === 2
                        ? attendance?.days_absent
                        : attendance?.days_late}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
      <Checkout isOpen={isOpen} setIsOpen={setIsOpen}
        elapsedTime={elapsedTime}
        attendance={attendance}
        handleClockOut={handleClockOut}
        isClockingOut={isClockingOut}
         />
    </div>
  );
};
export default FirstLayer;
