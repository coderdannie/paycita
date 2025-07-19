import React from "react";
import { FaSort } from "react-icons/fa";

interface TableHeaderProps {
  label: string;
  sortable?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  label,
  sortable = true,
}) => {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider whitespace-nowrap">
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sortable && <FaSort className="text-gray-400" />}
      </div>
    </th>
  );
};

export default TableHeader;
