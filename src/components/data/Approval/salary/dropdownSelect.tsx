import React from "react";
import { FiChevronDown } from "react-icons/fi";

interface DropdownSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label?: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  value,
  onChange,
  options,
  label,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className="block w-full pl-3 pr-10  p-3 px-6 text-base border bg-white border-gray-300 focus:outline-none focus:ring-[#692E9F] focus:border-[#692E9F] sm:text-sm rounded-md appearance-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {(options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <FiChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default DropdownSelect;
