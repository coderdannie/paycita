import React from "react";
import { Search, ChevronsUpDown } from "lucide-react";

interface FiltersProps {
  onSearchChange: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  onSearchChange,
  onTypeChange,
  onStatusChange,
}) => {
  return (
    <div className="flex space-x-4 mb-6">
      <div className="relative w-1/3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search employee name"
          className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-1/6 relative">
        <select
          className="w-full px-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">All Type</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Personal Leave">Personal Leave</option>
          <option value="Maternity Leave">Maternity Leave</option>
          <option value="Unpaid Leave">Unpaid Leave</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronsUpDown className="w-4 h-4" />
        </div>
      </div>
      <div className="w-1/6 relative">
        <select
          className="w-full px-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronsUpDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default Filters;
