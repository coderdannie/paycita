import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FilterOptions } from "./approvalLoan";
import { useScrollLock } from "@/src/components/common/useScrollLock";


interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filterOptions: FilterOptions) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    amountRequested: "Below ₦100.00",
    paymentPeriod: "3 months",
    status: "Pending",
  });

  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleChange = (field: keyof FilterOptions, value: string) => {
    setFilterOptions({
      ...filterOptions,
      [field]: value,
    });
  };

  const handleApply = () => {
    onApply(filterOptions);
  };

  const handleReset = () => {
    setFilterOptions({
      amountRequested: "Below ₦100.00",
      paymentPeriod: "3 months",
      status: "Pending",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen text-center md:block">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel for mobile - full screen */}
        <div className="md:hidden fixed inset-0 overflow-y-auto">
          <div className="flex flex-col h-full bg-white rounded-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Filter</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onClose}
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Amount Requested
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filterOptions.amountRequested}
                  onChange={(e) =>
                    handleChange("amountRequested", e.target.value)
                  }
                >
                  <option>Below ₦100.00</option>
                  <option>₦100.00 - ₦1,000.00</option>
                  <option>₦1,000.00 - ₦10,000.00</option>
                  <option>Above ₦10,000.00</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Payment Period
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filterOptions.paymentPeriod}
                  onChange={(e) =>
                    handleChange("paymentPeriod", e.target.value)
                  }
                >
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                  <option>24 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Status
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filterOptions.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>

            <div className="border-t p-4 flex justify-between mt-auto gap-2">
              <button
                className="flex-1 px-4 py-2 border border-red-300 text-red-500 rounded-md hover:bg-red-50 focus:outline-none"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Modal panel for desktop - sidebar */}
        <div className="hidden md:block fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl overflow-y-auto rounded-lg">
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-lg font-medium">Filter</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onClose}
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Amount Requested
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filterOptions.amountRequested}
                  onChange={(e) =>
                    handleChange("amountRequested", e.target.value)
                  }
                >
                  <option>Below ₦100.00</option>
                  <option>₦100.00 - ₦1,000.00</option>
                  <option>₦1,000.00 - ₦10,000.00</option>
                  <option>Above ₦10,000.00</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Payment Period
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filterOptions.paymentPeriod}
                  onChange={(e) =>
                    handleChange("paymentPeriod", e.target.value)
                  }
                >
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                  <option>24 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Status
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filterOptions.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>

            <div className="mt-auto pt-6 flex justify-between gap-2">
              <button
                className="flex-1 px-4 py-2 border border-[#EA3D3D] text-[#EA3D3D] rounded-md hover:bg-red-50 focus:outline-none"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="flex-1 px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 focus:outline-none"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
