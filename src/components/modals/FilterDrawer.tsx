"use client";
import { motion, AnimatePresence } from "framer-motion";
import Select, { StylesConfig } from "react-select";
import { IoClose } from "react-icons/io5";
import { useMemo, useCallback, useEffect } from "react";
import { Controller, SubmitHandler, UseFormReturn } from "react-hook-form";
import type {
  EmployeeAttendanceData,
  SingleValue,
} from "@/src/types/attendance";
import type { EmployeeFilterSchemaType } from "@/src/utils/validations";
import { IoIosArrowDown } from "react-icons/io";
import { jobOptions, statusOptions } from "@/src/utils/constants";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employeeAttendance: EmployeeAttendanceData[];
  form: UseFormReturn<EmployeeFilterSchemaType>;
  onSubmit: SubmitHandler<EmployeeFilterSchemaType>;
  onResetFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  form,
  onSubmit,
  onResetFilters,
}) => {
  const customStyles: StylesConfig<SingleValue, false> = useMemo(
    () => ({
      control: (provided) => ({
        ...provided,
        display: "flex",
        alignItems: "center",
        backgroundColor: "transparent",
        border: "2px solid #E4E7EC",
        borderRadius: "8px",
        boxShadow: "none",
        minHeight: "40px",
        padding: "0 12px",
        fontSize: "14px",
        color: "#1D2939",
        outline: "none",
        "&:hover": { borderColor: "#692E9F" },
      }),
      placeholder: (provided) => ({
        ...provided,
        fontSize: "12px",
        color: "#b3b3b3",
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: "10px",
        marginTop: "4px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        zIndex: 10,
      }),
      indicatorSeparator: () => ({ display: "none" }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#F0EAF5" : "transparent",
        color: "#333333",
        fontSize: "12px",
        padding: "10px 8px",
        cursor: "pointer",
        "&:active": { backgroundColor: "#EAEAEA" },
      }),
    }),
    []
  );

  // Handle escape key and body overflow
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = isOpen ? "hidden" : "auto";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Reset handler
  const handleReset = useCallback(() => {
    onResetFilters();
    onClose();
  }, [onResetFilters, onClose]);

  // Custom dropdown indicator
  const DropdownIndicator = useCallback(
    () => <IoIosArrowDown size="15px" color="#667085" />,
    []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl z-50 rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex px-6 items-center justify-between border-b border-[#E4E7EC] py-5">
              <h2 className="text-lg font-semibold">Filter</h2>
              <button onClick={onClose} aria-label="Close filter drawer">
                <IoClose className="text-2xl text-[#667085]" />
              </button>
            </div>

            {/* Filters Form - Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="pt-5 px-6"
              >
                <div className="space-y-6 pb-4">
                  {/* Job Title Select */}
                  <div>
                    <label className="block text-sm font-semibold pb-2">
                      Job Title
                    </label>
                    <Controller
                      name="job_title"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={jobOptions}
                          value={
                            jobOptions.find(
                              (opt) => opt.value === field.value
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption?.value || "");
                          }}
                          styles={customStyles}
                          placeholder="Select Job Title"
                          components={{
                            IndicatorSeparator: () => null,
                            DropdownIndicator,
                          }}
                          isClearable
                        />
                      )}
                    />
                  </div>

                  {/* Status Select */}
                  <div>
                    <label className="block text-sm font-semibold pb-2">
                      Status
                    </label>
                    <Controller
                      name="status"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={statusOptions}
                          value={
                            statusOptions.find(
                              (opt) => opt.value === field.value
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption?.value || "");
                          }}
                          styles={customStyles}
                          placeholder="Select Status"
                          components={{
                            IndicatorSeparator: () => null,
                            DropdownIndicator,
                          }}
                          isClearable
                        />
                      )}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Fixed Action Buttons at Bottom */}
            <div className="border-t border-[#E4E7EC] p-4 bg-white">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2 border border-[#EA3D3D] text-[#EA3D3D] font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="flex-1 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
