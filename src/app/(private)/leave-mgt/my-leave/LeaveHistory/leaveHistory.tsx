"use client";
import React, { useState } from "react";
import { Info, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "../../Pagination/pagination";

interface Leave {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: "Approved" | "Rejected";
}

interface LeaveHistoryProps {
  leaves: Leave[];
  onInfoClick: (leave: Leave) => void;
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ leaves, onInfoClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState<number[]>([]);
  const leavesPerPage = 5;
  const totalPages = Math.ceil(leaves.length / leavesPerPage);

  const paginatedLeaves = leaves.slice(
    (currentPage - 1) * leavesPerPage,
    currentPage * leavesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedLeaves(paginatedLeaves.map((leave) => leave.id));
    } else {
      setSelectedLeaves([]);
    }
  };

  const handleSelectLeave = (id: number) => {
    if (selectedLeaves.includes(id)) {
      setSelectedLeaves(selectedLeaves.filter((leaveId) => leaveId !== id));
    } else {
      setSelectedLeaves([...selectedLeaves, id]);
    }
  };

  return (
    <div className={cn("mt-6 w-full", "hide-sidebar:px-4")}>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Leave History
      </h2>
      <div className="rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "5%" }} />
            </colgroup>
            <thead className="bg-white">
              <tr className="border-b">
                <th className="py-3 px-4 text-left text-sm text-gray-500 font-medium">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-3 px-4 text-left text-sm text-gray-500 font-medium">
                  Leave Type <ChevronsUpDown className="w-4 h-4 inline ml-1" />
                </th>
                <th className="py-3 px-4 text-left text-sm text-gray-500 font-medium">
                  Start Date <ChevronsUpDown className="w-4 h-4 inline ml-1" />
                </th>
                <th className="py-3 px-4 text-left text-sm text-gray-500 font-medium">
                  End Date <ChevronsUpDown className="w-4 h-4 inline ml-1" />
                </th>
                <th className="py-3 px-4 text-center text-sm text-gray-500 font-medium">
                  Duration (Days){" "}
                  <ChevronsUpDown className="w-4 h-4 inline ml-1" />
                </th>
                <th className="py-3 px-4 text-left text-sm text-gray-500 font-medium">
                  Status <ChevronsUpDown className="w-4 h-4 inline ml-1" />
                </th>
                <th className="py-3 px-4 text-center text-sm text-gray-500 font-medium"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedLeaves.map((leave) => (
                <tr key={leave.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedLeaves.includes(leave.id)}
                      onChange={() => handleSelectLeave(leave.id)}
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {leave.type}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {leave.startDate}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {leave.endDate}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-center">
                    {leave.duration}
                  </td>
                  <td className="py-3 px-4">
                    {leave.status === "Approved" ? (
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded border border-solid border-[#89D8A9] text-[#00AA4F] bg-white">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded border border-solid border-[#F49E9E] text-[#EA3D3D] bg-white">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onInfoClick(leave)}
                      className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <Pagination
                  currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default LeaveHistory;