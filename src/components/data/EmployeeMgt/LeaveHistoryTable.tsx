"use client";

import CustomTable from "../../common/CustomTable";
import { TableCell, TableRow } from "../../ui/table";

import { Leave } from "./Tabs/LeaveHistory";
import TableEmptyState from "../../common/TableEmptyState";
import { formatDate } from "@/src/utils/helper";

const LeaveHistoryTable = ({ leave }: { leave: Leave[] }) => {
  const headers = [
    {
      label: "Request Date",
    },

    {
      label: "Leave Type",
    },
    {
      label: "Leave Date",
    },
    {
      label: "Duration",
    },

    {
      label: "Status",
    },
  ];

  return (
    <div>
      <div className="mt-[20px]">
        <CustomTable headers={headers} center={true}>
          {leave?.length ? (
            leave.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="text-[#1D2939] text-center text-sm"
              >
                <TableCell className="py-5">
                  {formatDate(row.request_date)}
                </TableCell>
                <TableCell>{row.leave_type}</TableCell>
                <TableCell>
                  {formatDate(row.start_date).split(" ").slice(0, 2).join(" ")}{" "}
                  - {formatDate(row.end_date)}
                </TableCell>
                <TableCell>{row.duration} Days</TableCell>
                <TableCell>
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                    ${row?.status?.toLowerCase() === "approved"
                        ? "text-green-600  border-[#89D8A9]  bg-[#F5FFFA]"
                        : "text-red-600   border-[#F49E9E] bg-[#FFF5F5]"
                      }
                  `}
                  >
                    {row?.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState
              headers={headers}
              messageTitle="No Attendance Records"
              desc="Clock in and out to track your attendance"
            />
          )}
        </CustomTable>
      </div>
    </div>
  );
};
export default LeaveHistoryTable;
