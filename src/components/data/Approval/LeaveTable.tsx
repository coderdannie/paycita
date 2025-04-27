"use client";

import { useCallback, useMemo, useState } from "react";
import CustomTable from "../../common/CustomTable";
import { TableCell, TableRow } from "../../ui/table";
import TableEmptyState from "../../common/TableEmptyState";
import { Button } from "@/components/ui/button";
import RejectModal from "../../modals/RejectModal";
import StatusModal from "../../modals/StatusModal";

const LeaveTable = ({
  approvals,
}: {
  approvals: Array<{
    employee_name: string;
    type: string;
    start_date: string;
    end_date: string;
    applied_date: string;
    action_time: string;
    amount: string;
    approval_status_id: string;
    expenses_id: string;
    expenses_number: string;
    status: string;
  }>;
}) => {
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [canChangeStatus, setCanChangeStatus] = useState(true); // For simulating the 30min logic

  const headers = useMemo(
    () => [
      { label: "Employee" },
      { label: "Leave Type" },
      { label: "Start Date" },
      { label: "End Date" },
      { label: "Status" },
      { label: "Applied Date" },
      { label: "Action Time" },
      { label: "Action" },
    ],
    []
  );

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] text-center block px-[10px] rounded-md 
        ${
          status === "approved"
            ? "text-[#008000] bg-[#EDFCED]"
            : status === "pending"
            ? "text-[#5252FF] bg-[#EDEDFB]"
            : "text-red-600 bg-[#FFF5F5]"
        }`}
      >
        {status}
      </span>
    );
  }, []);

  const handleOpenStatusModal = (status: string, actionTime: string) => {
    setSelectedStatus(status);

    // Fake check for 30-minute window
    const isWithin30Min = actionTime.includes("min"); // Replace with real timestamp logic
    setCanChangeStatus(isWithin30Min);

    setIsStatusModalOpen(true);
  };

  const handleStatusChange = (newStatus: string) => {
    console.log("Changed to:", newStatus);
    setIsStatusModalOpen(false);
  };

  const renderActionButtons = useCallback(
    (status: string, actionTime: string) => {
      switch (status.toLowerCase()) {
        case "approved":
          return (
            <Button onClick={() => handleOpenStatusModal(status, actionTime)}>
              Change status
            </Button>
          );
        case "pending":
          return (
            <div className="flex gap-2">
              <Button>Approve</Button>
              <button
                className="border border-red-400 text-red-500 px-4 py-1 rounded-md"
                onClick={() => setIsRejectOpen(true)}
              >
                Reject
              </button>
            </div>
          );
        case "rejected":
          return (
            <button
              className="bg-gray-200 text-gray-500 px-4 py-1 rounded-md cursor-not-allowed"
              disabled
            >
              Change status
            </button>
          );
        default:
          return null;
      }
    },
    []
  );

  const handleReject = (comment: string) => {
    console.log("Request rejected with comment:", comment);
  };

  return (
    <div className="mt-6">
      <CustomTable headers={headers}>
        {approvals?.length ? (
          approvals.map((row, index) => (
            <TableRow key={index} className="text-[#1D2939] text-sm">
              <TableCell>{row.employee_name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.start_date}</TableCell>
              <TableCell>{row.end_date}</TableCell>
              <TableCell>{renderStatusBadge(row.status)}</TableCell>
              <TableCell>{row.applied_date}</TableCell>
              <TableCell>{row.action_time}</TableCell>
              <TableCell>
                {renderActionButtons(row.status, row.action_time)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState headers={headers} />
        )}
      </CustomTable>

      {/* Modals */}
      <RejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onReject={handleReject}
      />

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onChangeStatus={handleStatusChange}
        currentStatus={selectedStatus}
        disabled={!canChangeStatus}
      />
    </div>
  );
};

export default LeaveTable;
