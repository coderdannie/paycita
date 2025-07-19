import { useScrollLock } from "@/src/components/common/useScrollLock";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import DropdownSelect from "./dropdownSelect";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterValues) => void;
}

export interface FilterValues {
  period: string;
  status: "Pending" | "Approved" | "Rejected" | "All";
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  onApplyFilter,
}) => {
  const [filters, setFilters] = useState<FilterValues>({
    period: "Feb, 2025",
    status: "Pending",
  });

  useScrollLock(isOpen);
  
  if (!isOpen) return null;
  
  const periodOptions = [
    { value: "Feb, 2025", label: "Feb, 2025" },
    { value: "Jan, 2025", label: "Jan, 2025" },
    { value: "Dec, 2024", label: "Dec, 2024" },
  ];

  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  const handleReset = () => {
    setFilters({
      period: "Feb, 2025",
      status: "Pending",
    });
  };

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-72 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-medium">Filter</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <DropdownSelect
              label="Period"
              value={filters.period}
              onChange={(value) => setFilters({ ...filters, period: value })}
              options={periodOptions}
            />
          </div>
          <div className="mb-4">
            <DropdownSelect
              label="Status"
              value={filters.status}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  status: value as "Pending" | "Approved" | "Rejected" | "All",
                })
              }
              options={statusOptions}
            />
          </div>
        </div>
        <div className="p-4 flex justify-between gap-2">
          <button
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-center"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="w-full px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 text-center"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
