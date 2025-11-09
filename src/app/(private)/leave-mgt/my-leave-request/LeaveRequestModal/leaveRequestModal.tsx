"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, ChevronDown, Check, Upload } from "lucide-react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { LeaveRequestSchemaType } from "@/src/utils/validations";
import { Spinner } from "react-activity";

interface LeaveRequestModalProps {
  onClose: () => void;
  onSubmit: SubmitHandler<LeaveRequestSchemaType>;
  leaveTypes: any;
  form: UseFormReturn<LeaveRequestSchemaType>;
  isPending: boolean;
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  onClose,
  onSubmit,
  leaveTypes,
  form,
  isPending,
}) => {
  const { register, handleSubmit, setValue, watch } = form;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const leave_type = watch("leave_type");
  const start_date = watch("start_date");
  const end_date = watch("end_date");

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Set the default leave type if not set
    if (!leave_type && leaveTypes.length > 0) {
      setValue("leave_type", leaveTypes[0].leave_name);
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectLeaveType = (type: string) => {
    setValue("leave_type", type);
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

  const formatDateToLocalString = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDateSelection = (date: Date, isStartDate: boolean) => {
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    if (isStartDate) {
      setValue("start_date", formattedDate, { shouldValidate: true });
      setShowStartDatePicker(false);
    } else {
      setValue("end_date", formattedDate, { shouldValidate: true });
      setShowEndDatePicker(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("leave_document", file);
      setSelectedFileName(file.name);
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
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

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
                type="button"
                onClick={toggleYearDropdown}
                className="flex items-center px-2 py-1 text-sm hover:text-primary"
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
            <button type="button" onClick={prevMonth} className="p-1 mx-1">
              &lt;
            </button>
            <button type="button" onClick={nextMonth} className="p-1 mx-1">
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
                if (!day) {
                  return <div key={dayIndex} className="invisible" />;
                }

                const date = new Date(year, month, day);
                const formattedDate = `${year}-${String(month + 1).padStart(
                  2,
                  "0"
                )}-${String(day).padStart(2, "0")}`;
                const isSelected = isStartDate
                  ? start_date === formattedDate
                  : end_date === formattedDate;

                return (
                  <div
                    key={dayIndex}
                    className={`cursor-pointer text-center py-1 px-2 text-sm hover:bg-gray-100 rounded ${
                      isSelected
                        ? "bg-primary text-white hover:bg-purple-700"
                        : ""
                    }`}
                    onClick={() => handleDateSelection(date, isStartDate)}
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
    <div className="fixed inset-0 z-50 overflow-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>
      <div className="absolute top-0 right-0 bottom-0 w-[350px] bg-white shadow-xl flex flex-col h-[96%] my-4 mx-4 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Add new Leave Request</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Leave Type Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full flex items-center justify-between border rounded-md px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  onClick={toggleDropdown}
                >
                  <span>{leave_type || "Select leave type"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                <input
                  type="hidden"
                  {...register("leave_type", { required: true })}
                />

                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                    {leaveTypes.length > 0 &&
                      leaveTypes?.map((type: any) => (
                        <div
                          key={type?.leave_name}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                          onClick={() => selectLeaveType(type.leave_name)}
                        >
                          {type?.leave_name}
                          {type?.leave_name === leave_type && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {form.formState.errors.leave_type && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.leave_type.message as string}
                </p>
              )}
            </div>

            {/* Start Date Picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div
                  className="w-full flex items-center border rounded-md px-3 py-2 text-left cursor-pointer"
                  onClick={toggleStartDatePicker}
                >
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-500">
                    {start_date
                      ? formatDateToLocalString(start_date)
                      : "Select date"}
                  </span>
                </div>
                <input
                  type="hidden"
                  {...register("start_date", { required: true })}
                />

                {showStartDatePicker && (
                  <div className="mt-1">{renderCalendar(true)}</div>
                )}
              </div>
              {form.formState.errors.start_date && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.start_date.message as string}
                </p>
              )}
            </div>

            {/* End Date Picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div
                  className="w-full flex items-center border rounded-md px-3 py-2 text-left cursor-pointer"
                  onClick={toggleEndDatePicker}
                >
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-500">
                    {end_date
                      ? formatDateToLocalString(end_date)
                      : "Select date"}
                  </span>
                </div>
                <input
                  type="hidden"
                  {...register("end_date", { required: true })}
                />

                {showEndDatePicker && (
                  <div className="mt-1">{renderCalendar(false)}</div>
                )}
              </div>
              {form.formState.errors.end_date && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.end_date.message as string}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                {...register("message")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
                placeholder="Enter your leave reason or additional information..."
              />
              {form.formState.errors.message && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.message.message as string}
                </p>
              )}
            </div>

            {/* File Upload Field */}
            <div className="space-y-2">
              <label
                htmlFor="leave_document"
                className="block text-sm font-medium text-gray-700"
              >
                Supporting Document (Optional)
              </label>
              <div className="relative">
                <input
                  id="leave_document"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="leave_document"
                  className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-3 py-3 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <Upload className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {selectedFileName || "Choose file or drag here"}
                  </span>
                </label>
                {selectedFileName && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {selectedFileName}
                  </p>
                )}
              </div>
              {form.formState.errors.leave_document?.message && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.leave_document.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 border-t">
            <button
              type="submit"
              disabled={!leave_type || !start_date || !end_date || isPending}
              className="w-full bg-primary hover:bg-purple-700 disabled:bg-purple-300 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
            >
              {isPending && <Spinner className="w-4 h-4 mr-2" />} Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
