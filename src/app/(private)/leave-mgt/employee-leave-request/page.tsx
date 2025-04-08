"use client";
import React, { useState, useMemo, useCallback } from "react";
import Filters from "./Filters/filters";

import {
  useDeleteLeaveRequest,
  useGetEmployeeLeave,
  useUpdateEmployeeLeave,
} from "@/src/api/hooks/leave/useLeave";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import { useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import CustomTable from "@/src/components/common/CustomTable";
import { TableCell, TableRow } from "@/src/components/ui/table";
import { formatDate } from "@/src/utils/helper";
import { Info, Trash2 } from "lucide-react";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import EmployeeLeaveDetailsModal from "./Modals/EmployeeLeaveDetailsModal";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import { toast } from "react-hot-toast";

interface LeaveRequest {
  id: number;
  created_at: string;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: string;
}

interface LeaveRequestType {
  id: number;
  requestDate: string;
  employeeName: string;
  leaveType: string;
  leaveDate: string;
  duration: number;
  status: "Pending" | "Approved" | "Rejected";
  comment?: string;
}

const LeaveRequest: React.FC = () => {
  const searchParams = useSearchParams();

  const updateSearchParams = useUpdateSearchParams();

  const currentPage = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const leaveType = searchParams.get("leave_type") || "";
  const status = searchParams.get("status") || "";

  const [searchTerm, setSearchTerm] = useState<string>(search);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequestType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);
  const [rejectionComment, setRejectionComment] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState<LeaveRequestType | null>(
    null
  );

  const filters = useMemo(
    () => ({
      page: currentPage,
      employee_name: searchTerm,
      leave_type: leaveType,
      status: status,
    }),
    [currentPage, leaveType, searchTerm, status]
  );

  const { employeeLeave, pagination, isPending } = useGetEmployeeLeave(filters);

  const { mutateUpdateEmployeeLeave, isPending: isPendingUpdateLeave } =
    useUpdateEmployeeLeave();

  const { mutateDeleteLeaveRequest, isPending: isPendingDeleteLeave } =
    useDeleteLeaveRequest();

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams(
        { ...filters, page: page.toString() },
        { scroll: true }
      );
    },
    [filters, updateSearchParams]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateSearchParams(
        {
          ...filters,
          employee_name: value,
          page: "1",
        },
        { debounce: 300 }
      );
    },
    [filters, updateSearchParams]
  );

  const onInfoClick = useCallback((row: LeaveRequest) => {
    const transformedData: LeaveRequestType = {
      ...row,
      id: row.id,
      requestDate: row.created_at,
      employeeName: row.employee_name,
      leaveType: row.leave_type,
      leaveDate: `${formatDate(row.start_date)} - ${formatDate(row.end_date)}`,
      duration: row.duration,
      status: row.status as "Pending" | "Approved" | "Rejected",
    };
    setSelectedLeave(transformedData);
    setIsModalOpen(true);
  }, []);

  const handleApprove = useCallback(() => {
    if (selectedLeave) {
      setActionType("approve");
      setSelectedLeaveId(selectedLeave.id);
      setIsConfirmationModalOpen(true);
    }
  }, [selectedLeave]);

  const handleReject = useCallback(() => {
    if (selectedLeave) {
      setActionType("reject");
      setSelectedLeaveId(selectedLeave.id);
      setRejectionComment("");
      setIsConfirmationModalOpen(true);
    }
  }, [selectedLeave]);

  const handleConfirmAction = useCallback(() => {
    if (selectedLeaveId) {
      // For rejection, require a comment
      if (actionType === "reject" && !rejectionComment.trim()) {
        toast.error("Please provide a reason for rejection");
        return;
      }

      mutateUpdateEmployeeLeave(
        {
          id: selectedLeaveId.toString(),
          status: actionType === "approve" ? "approved" : "rejected",
          comment: actionType === "reject" ? rejectionComment : undefined,
        },
        {
          onSuccess: () => {
            toast.success(
              `Leave request ${
                actionType === "approve" ? "approved" : "rejected"
              } successfully`
            );
            setIsConfirmationModalOpen(false);
            setIsModalOpen(false);
          },
          onError: () => {
            toast.error(`Failed to ${actionType} leave request`);
          },
        }
      );
    }
  }, [
    selectedLeaveId,
    actionType,
    rejectionComment,
    mutateUpdateEmployeeLeave,
  ]);

  const handleDelete = useCallback((leave: LeaveRequestType) => {
    setLeaveToDelete(leave);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (leaveToDelete) {
      mutateDeleteLeaveRequest(leaveToDelete.id.toString(), {
        onSuccess: () => {
          toast.success("Leave request deleted successfully");
          setIsDeleteModalOpen(false);
          setLeaveToDelete(null);
        },
        onError: () => {
          toast.error("Failed to delete leave request");
        },
      });
    }
  }, [leaveToDelete, mutateDeleteLeaveRequest]);

  if (isPending) {
    return <LoadingOverlay />;
  }

  const headers = [
    {
      label: "Request Date",
    },
    {
      label: "Employee Name",
    },
    {
      label: "Leave Type",
    },

    {
      label: "Leave Date",
    },

    {
      label: "Duration (Days)",
    },

    {
      label: "Line Manager Status",
    },

    {
      label: "Status",
    },
    {
      label: "Actions",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Employee Leave Request
      </h1>
      <Filters
        onSearchChange={handleSearchChange}
        onTypeChange={(value) =>
          updateSearchParams({
            ...filters,
            leave_type: value === "All Type" ? "" : value,
            page: "1",
          })
        }
        onStatusChange={(value) =>
          updateSearchParams({
            ...filters,
            status: value === "All Status" ? "" : value,
            page: "1",
          })
        }
      />

      <div className="rounded-lg shadow-sm">
        <CustomTable headers={headers} center={true}>
          {employeeLeave?.length ? (
            employeeLeave.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="text-[#1D2939] text-center text-sm"
              >
                <TableCell>{formatDate(row.created_at)}</TableCell>
                <TableCell>{row.employee_name}</TableCell>
                <TableCell>{row.leave_type}</TableCell>
                <TableCell>
                  {formatDate(row.start_date).split(" ").slice(0, 2).join(" ")}{" "}
                  - {formatDate(row.end_date)}
                </TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell>
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                            ${
                              row?.line_manager_status?.toLowerCase() ===
                              "approved"
                                ? "text-green-600  border-[#89D8A9]  bg-[#F5FFFA]"
                                : row?.line_manager_status?.toLowerCase() ===
                                  "rejected"
                                ? "text-red-600 border-[#F49E9E] bg-[#FFF5F5]"
                                : "text-yellow-600 border-[#FCD34D] bg-[#FFFBEB]"
                            }
                          `}
                  >
                    {row?.line_manager_status || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                            ${
                              row?.status?.toLowerCase() === "approved"
                                ? "text-green-600  border-[#89D8A9]  bg-[#F5FFFA]"
                                : row?.status?.toLowerCase() === "rejected"
                                ? "text-red-600 border-[#F49E9E] bg-[#FFF5F5]"
                                : "text-yellow-600 border-[#FCD34D] bg-[#FFFBEB]"
                            }
                          `}
                  >
                    {row?.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onInfoClick(row)}
                      className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="text-red-400 hover:text-red-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
      {pagination?.total_pages > 1 && (
        <div className="mt-6">
          <CustomPagination
            totalPages={pagination.total_pages}
            currentPage={+currentPage}
            goToPage={goToPage}
          />
        </div>
      )}

      <EmployeeLeaveDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leaveRequest={selectedLeave as LeaveRequestType}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onCancel={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={`${
          actionType === "approve" ? "Approve" : "Reject"
        } Leave Request`}
        actionLabel={actionType === "approve" ? "Approve" : "Reject"}
        isReject={actionType === "reject"}
        comment={rejectionComment}
        onCommentChange={setRejectionComment}
        isLoading={isPendingUpdateLeave}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setLeaveToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Leave Request"
        actionLabel="Delete"
        isLoading={isPendingDeleteLeave}
      />
    </div>
  );
};
export default LeaveRequest;
