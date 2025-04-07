"use client";
import React, { useCallback, useMemo } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

import CustomTable from "@/src/components/common/CustomTable";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import { TableRow, TableCell } from "@/src/components/ui/table";
import { formatDate } from "@/src/utils/helper";
import { Leave } from "@/src/components/data/EmployeeMgt/Tabs/LeaveHistory";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";

interface LeaveHistoryProps {
  leaves: Leave[];
  onInfoClick: (leave: Leave) => void;
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ leaves, onInfoClick }) => {
  const updateSearchParams = useUpdateSearchParams();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  const leavesPerPage = 5;

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() }, { scroll: true });
    },
    [updateSearchParams]
  );

  const headers = [
    {
      label: "Leave Type",
    },

    {
      label: "Start Date",
    },
    {
      label: "End Date",
    },
    {
      label: "Duration (Days)",
    },

    {
      label: "Status",
    },
    {
      label: "",
    },
  ];

  const paginatedLeave = useMemo(() => {
    return leaves?.slice(
      (currentPage - 1) * leavesPerPage,
      currentPage * leavesPerPage
    );
  }, [leaves, currentPage, leavesPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(leaves.length / leavesPerPage);
  }, [leaves, leavesPerPage]);

  
  return (
    <div className={cn("mt-6 w-full", "hide-sidebar:px-4")}>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Leave History
      </h2>
      <div className="rounded-lg shadow-sm">
        <CustomTable headers={headers} center={true}>
          {paginatedLeave?.length ? (
            paginatedLeave.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="text-[#1D2939] text-center text-sm"
              >
                <TableCell>{row.leave_type}</TableCell>

                <TableCell className="py-5">
                  {formatDate(row.start_date)}
                </TableCell>
                <TableCell>{formatDate(row.end_date)}</TableCell>

                <TableCell>{row.duration}</TableCell>
                <TableCell>
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                            ${
                              row?.status?.toLowerCase() === "approved"
                                ? "text-green-600  border-[#89D8A9]  bg-[#F5FFFA]"
                                : "text-red-600   border-[#F49E9E] bg-[#FFF5F5]"
                            }
                          `}
                  >
                    {row?.status}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onInfoClick(row)}
                    className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState
              headers={headers}
              messageTitle="No Leave Records"
              desc="Make a leave request to track your leave"
            />
          )}
        </CustomTable>
      </div>
      {totalPages > 1 && (
        <div className="mt-6">
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            goToPage={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
