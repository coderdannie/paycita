"use client";

import React, { useState } from "react";
import { X, Calendar, ChevronDown, Check } from "lucide-react";

interface LeaveRequestModalProps {
  onClose: () => void;
  onSubmit: (leaveType: string, startDate: string, endDate: string) => void;
  leaveTypes: string[];
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  onClose,
  onSubmit,
  leaveTypes,
}) => {
  const [leaveType, setLeaveType] = useState(leaveTypes[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Generate a list of years (from 50 years in the past to 50 years in the future)
  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

  const handleSubmit = () => {
    if (leaveType && startDate && endDate) {
      onSubmit(leaveType, startDate, endDate);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectLeaveType = (type: string) => {
    setLeaveType(type);
    setShowDropdown(false);
  };

  const toggleStartDatePicker = () => {
    setShowStartDatePicker(!showStartDatePicker);
    if (showEndDatePicker) setShowEndDatePicker(false);
  };

  const toggleEndDatePicker = () => {
    setShowEndDatePicker(!showEndDatePicker);
    if (showStartDatePicker) setShowStartDatePicker(false);
  };

  const handleDateSelection = (date: Date, isStartDate: boolean) => {
    const formattedDate = date.toISOString().split("T")[0];
    if (isStartDate) {
      setStartDate(formattedDate);
      setShowStartDatePicker(false);
    } else {
      setEndDate(formattedDate);
      setShowEndDatePicker(false);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const toggleYearDropdown = () => {
    setShowYearDropdown(!showYearDropdown);
  };

  const selectYear = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearDropdown(false);
  };

  const renderCalendar = (isStartDate: boolean) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthName = currentMonth.toLocaleString("default", { month: "long" });

    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Create days array
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); // Empty cells for days before the first of the month
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Create weeks array from days
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = [];

    days.forEach((day, index) => {
      week.push(day);
      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    return (
      <div className="absolute z-10 left-0 bg-white shadow-lg rounded-lg border border-gray-200 w-full">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="font-medium flex items-center">
            <span>{monthName}</span>
            <div className="relative ml-2">
              <button
                onClick={toggleYearDropdown}
                className="flex items-center px-2 py-1 text-sm hover:text-purple-600"
              >
                <span>{year}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>

              {showYearDropdown && (
                <div className="absolute z-20 mt-1 w-24 bg-white shadow-lg rounded-md max-h-48 overflow-y-auto">
                  {yearRange.map((yearOption) => (
                    <div
                      key={yearOption}
                      className={`px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
                        yearOption === year
                          ? "bg-purple-100 text-purple-700 font-medium"
                          : ""
                      }`}
                      onClick={() => selectYear(yearOption)}
                    >
                      {yearOption}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex">
            <button onClick={prevMonth} className="p-1 mx-1">
              &lt;
            </button>
            <button onClick={nextMonth} className="p-1 mx-1">
              &gt;
            </button>
          </div>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 mt-1">
              {week.map((day, dayIndex) => {
                const date = day ? new Date(year, month, day) : null;
                const isSelected =
                  date &&
                  ((isStartDate &&
                    startDate === date.toISOString().split("T")[0]) ||
                    (!isStartDate &&
                      endDate === date.toISOString().split("T")[0]));

                return (
                  <div
                    key={dayIndex}
                    className={`
                      ${
                        !day
                          ? "invisible"
                          : "cursor-pointer text-center py-1 px-2 text-sm hover:bg-gray-100 rounded"
                      }
                      ${
                        isSelected
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : ""
                      }
                    `}
                    onClick={() =>
                      day &&
                      handleDateSelection(
                        new Date(year, month, day),
                        isStartDate
                      )
                    }
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-black bg-opacity-30 pointer-events-auto"
        onClick={onClose}
      ></div>
      <div className="absolute top-0 right-0 bottom-0 w-[350px] bg-white shadow-xl pointer-events-auto flex flex-col h-[96%] my-4 mx-4 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Add new Leave Request</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Leave Type Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between border rounded-md px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                onClick={toggleDropdown}
              >
                <span>{leaveType}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                  {leaveTypes.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                      onClick={() => selectLeaveType(type)}
                    >
                      {type}
                      {type === leaveType && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Start Date Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <div className="relative">
              <div
                className="w-full flex items-center border rounded-md px-3 py-2 text-left cursor-pointer"
                onClick={toggleStartDatePicker}
              >
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-500">
                  {startDate
                    ? new Date(startDate).toLocaleDateString()
                    : "Select date"}
                </span>
              </div>

              {showStartDatePicker && (
                <div className="mt-1">{renderCalendar(true)}</div>
              )}
            </div>
          </div>

          {/* End Date Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <div className="relative">
              <div
                className="w-full flex items-center border rounded-md px-3 py-2 text-left cursor-pointer"
                onClick={toggleEndDatePicker}
              >
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-500">
                  {endDate
                    ? new Date(endDate).toLocaleDateString()
                    : "Select date"}
                </span>
              </div>

              {showEndDatePicker && (
                <div className="mt-1">{renderCalendar(false)}</div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={handleSubmit}
            disabled={!leaveType || !startDate || !endDate}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
