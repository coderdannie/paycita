"use client";

import { useCallback, useMemo, useState } from "react";
import CustomTable from "../../common/CustomTable";
import { TableCell, TableRow } from "../../ui/table";
import TableEmptyState from "../../common/TableEmptyState";
import { Button } from "@/components/ui/button";
import RejectModal from "../../modals/RejectModal";
import StatusModal from "../../modals/StatusModal";
import {
  useResendApprovalOtp,
  useUpdateApproval,
  useVerifyApprovalOtp,
} from "@/src/hooks/approvals/useApprovals";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "react-activity";
import ApprovalModal from "../../modals/VerifyOtpModal";

const LeaveTable = ({
  approvals,
}: {
  approvals: Array<{
    employee: string;
    leave_type: string;
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
  const queryClient = useQueryClient();
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Approved");
  const [approvalId, setApprovalId] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(180);

  const { mutate: mutateUpdateApprovalStatus, isPending: isUpdatePending } =
    useUpdateApproval("update-leave-requests");
  const headers = useMemo(
    () => [
      { label: "Employee" },
      { label: "Leave Type" },
      { label: "Start Date" },
      { label: "End Date" },
      { label: "Status" },
      // { label: "Applied Date" },
      // { label: "Action Time" },
      { label: "Action" },
    ],
    []
  );

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] block px-[10px] rounded-md 
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

  const handleOpenStatusModal = (item: {
    status: string;
    approval_status_id: string;
  }) => {
    setSelectedStatus(item.status);

    setApprovalId(item.approval_status_id);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = (newStatus: string) => {
    console.log("Changed to:", newStatus);
    const payload = {
      id: approvalId,
      data: {
        status: newStatus.toLowerCase(),
      },
    };
    mutateUpdateApprovalStatus(payload, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        setTimeout(() => {
          if (res?.data?.data?.requires_otp) {
            setIsShow(true);
          }
        }, 200);

        queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS, "pending-leave-requests"],
        });

        setIsStatusModalOpen(false);
        setApprovalId("");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      },
    });
  };

  const { mutate: mutateVerifyOtp, isPending: isVerifying } =
    useVerifyApprovalOtp({
      onSuccess: (res: {
        data: { message: string; requires_otp: boolean };
      }) => {
        toast.success(res?.data?.message);
        setIsShow(false);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS],
        });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      },
    });

  const { mutate: mutateResendOtp, isLoading } = useResendApprovalOtp({
    onSuccess: (res: { message: string }) => {
      toast.success(res?.message);
      setTimeLeft(180);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
  });

  const handleVerify = (otpValue: string) => {
    mutateVerifyOtp({
      otp: otpValue,
    });
  };

  const handleResendOtp = () => {
    mutateResendOtp({
      id: approvalId,
    });
  };

  const handleApprove = useCallback(
    (approvalId: string) => {
      const payload = {
        id: approvalId,
        data: {
          status: "approved",
        },
      };
      mutateUpdateApprovalStatus(payload, {
        onSuccess: () => {
          toast.success("Status updated successfully");
          queryClient.refetchQueries({
            queryKey: [QUERY_KEYS.GET_ALL_APPROVALS, "pending-leave-requests"],
          });
          // setIsOpen("");
          setApprovalId("");
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(
              error?.response?.data?.message || "Something went wrong"
            );
          }
        },
      });
    },
    [mutateUpdateApprovalStatus, queryClient]
  );

  const renderActionButtons = useCallback(
    (item: { status: string; approval_status_id: string }) => {
      switch (item.status.toLowerCase()) {
        case "approved":
          return (
            <Button onClick={() => handleOpenStatusModal(item)}>
              Change status
            </Button>
          );
        case "pending":
          return (
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(item.approval_status_id)}
                disabled={isUpdatePending}
              >
                {isUpdatePending && <Spinner />} Approve
              </Button>
              <button
                className="border border-red-400 text-red-500 px-4 py-1 rounded-md"
                onClick={() => {
                  setIsRejectOpen(true);
                  setApprovalId(item.approval_status_id);
                }}
              >
                Reject
              </button>
            </div>
          );
        case "rejected":
          return (
            <button
              onClick={() => handleOpenStatusModal(item)}
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
    [handleApprove, isUpdatePending]
  );

  const handleReject = (comment: string) => {
    console.log("Request rejected with comment:", comment);
    const payload = {
      id: approvalId,
      data: {
        status: "rejected",
        reason: comment,
      },
    };
    mutateUpdateApprovalStatus(payload, {
      onSuccess: () => {
        toast.success("Status updated successfully");
        queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS, "pending-leave-requests"],
        });
        setIsRejectOpen(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      },
    });
  };

  return (
    <div className="mt-6">
      <CustomTable headers={headers}>
        {approvals?.length ? (
          approvals.map((row, index) => (
            <TableRow key={index} className="text-[#1D2939] text-sm">
              <TableCell>{row.employee}</TableCell>
              <TableCell>{row.leave_type}</TableCell>
              <TableCell>{row.start_date}</TableCell>
              <TableCell>{row.end_date}</TableCell>
              <TableCell>{renderStatusBadge(row.status)}</TableCell>
              {/* <TableCell>{row.applied_date}</TableCell>
              <TableCell>{row.action_time}</TableCell> */}
              <TableCell>{renderActionButtons(row)}</TableCell>
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
        isLoading={isUpdatePending}
      />

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onChangeStatus={handleStatusChange}
        currentStatus={selectedStatus}
      />

      <ApprovalModal
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        onVerify={handleVerify}
        isVerifying={isVerifying}
        onResend={handleResendOtp}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        isResending={isLoading}
      />
    </div>
  );
};

export default LeaveTable;
