"use client";
import React from "react";
import { ChevronDown, X } from "lucide-react";

const FilterModal = ({
  isOpen,
  onClose,
  jobLevelFilter,
  setJobLevelFilter,
  statusFilter,
  setStatusFilter,
  onApply,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  jobLevelFilter: string;
  setJobLevelFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 p-2 bg-black bg-opacity-30 flex justify-end z-50">
      <div className="bg-white border rounded-[.5rem] h-full w-full max-w-sm flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-medium">Filter</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6 flex-grow overflow-y-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Job Level
            </label>
            <div className="relative">
              <select
                value={jobLevelFilter}
                onChange={(e) => setJobLevelFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md appearance-none"
              >
                <option>All Level</option>
                <option>Staff</option>
                <option>Manager</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md appearance-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>On Leave</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 text-[.8rem] font-light mt-auto flex space-x-4">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2 border border-[#EA3D3D] text-[#EA3D3D] text-center rounded-lg hover:bg-gray-50 focus:outline-none"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2 bg-[#692E9F] text-white text-center rounded-lg hover:bg-[#5c2787] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
