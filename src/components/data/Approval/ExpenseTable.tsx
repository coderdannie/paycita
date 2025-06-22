"use client";

import { useCallback, useMemo, useState } from "react";
import CustomTable from "../../common/CustomTable";
import { TableCell, TableRow } from "../../ui/table";
import TableEmptyState from "../../common/TableEmptyState";
import { Button } from "@/components/ui/button";
import ExpenseDrawer from "../../modals/ExpenseDrawer";
import { useGetSingleExpense } from "@/src/hooks/expenses/useExpenses";
import RejectModal from "../../modals/RejectModal";
import {
  useAddApprovalComment,
  useUpdateApproval,
} from "@/src/hooks/approvals/useApprovals";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import CommentModal from "../../modals/CommentModal";
import { Comments } from "@/src/types/procurement";

import {
  useVerifyApprovalOtp,
  useResendApprovalOtp,
} from "../../../hooks/approvals/useApprovals";
import ApprovalModal from "../../modals/VerifyOtpModal";

const ExpenseTable = ({
  approvals,
}: {
  approvals: Array<{
    amount: string;
    approval_status_id: string;
    expenses_id: string;
    expenses_number: string;
    status: string;
  }>;
}) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [dataId, setDataId] = useState("");

  const headers = useMemo(
    () => [
      // { label: "Employee Name" },
      { label: "Employee Number" },
      { label: "Total Cost" },
      { label: "Status" },
      { label: "Action" },
    ],
    []
  );

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] w-[70%] text-center block px-[10px] rounded-md 
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

  const [expenseId, setExpenseId] = useState("");
  const [approvalId, setApprovalId] = useState("");

  const { expense } = useGetSingleExpense(expenseId);

  const handleViewDetails = useCallback(
    (item: { expenses_id: string; approval_status_id: string }) => {
      setExpenseId(item.expenses_id);
      setApprovalId(item.approval_status_id);
      setDataId(item?.approval_status_id);
      setIsOpen(true);
    },
    [setExpenseId, setIsOpen]
  );

  const { mutate: mutateUpdateApprovalStatus, isPending: isUpdatePending } =
    useUpdateApproval("update-expenses-requests");

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const handleReject = (comment: string) => {
    const payload = {
      id: approvalId,
      data: {
        status: "rejected",
        reason: comment,
      },
    };
    mutateUpdateApprovalStatus(payload, {
      onSuccess: () => {
        setIsRejectOpen(false);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS, "pending-expenses-requests"],
        });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      },
    });
  };

  const handleApprove = () => {
    const payload = {
      id: approvalId,
      data: {
        status: "approved",
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

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS, "pending-expenses-requests"],
        });
        setIsOpen(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      },
    });
  };
  const [openModal, setOpenModal] = useState(false);

  const currentComments: Comments[] = expense?.comment_thread?.comments || [];
  const currentThreadId = expense?.comment_thread?.thread_id;

  const { mutate: mutateAddComment, isPending: isAddingComment } =
    useAddApprovalComment("add-expense-comment");

  const handleSend = (message: string) => {
    if (!currentThreadId) {
      toast.error("Cannot add comment: Thread ID is missing.");
      return;
    }
    if (!expenseId) {
      toast.error("Cannot add comment: Expense ID is missing.");
      return;
    }

    const payload = {
      thread_id: currentThreadId,
      comment: message,
    };

    mutateAddComment(payload, {
      onSuccess: () => {
        toast.success("Comment added successfully");
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_SINGLE_EXPENSE, expenseId],
        });
        setOpenModal(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError)
          toast.error(
            error?.response?.data?.message || "Failed to add comment"
          );
        else toast.error("An unexpected error occurred while adding comment.");
      },
    });
  };

  const { mutate: mutateVerifyOtp, isPending: isVerifying } =
    useVerifyApprovalOtp({
      onSuccess: (res: { data: { message: string } }) => {
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
      id: dataId,
    });
  };

  return (
    <div className="mt-6">
      <CustomTable headers={headers}>
        {approvals?.length ? (
          approvals.map((row, index) => (
            <TableRow key={index} className="text-[#1D2939] text-sm">
              {/* <TableCell>{row.name}</TableCell> */}
              <TableCell>{row.expenses_number}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{renderStatusBadge(row.status)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="border-primary"
                  onClick={() => handleViewDetails(row)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState headers={headers} />
        )}
      </CustomTable>
      <ExpenseDrawer
        open={isOpen}
        onOpenChange={() => setIsOpen(false)}
        setIsShow={setIsRejectOpen}
        expense={expense}
        handleApprove={handleApprove}
        isLoading={isUpdatePending}
        setOpenComment={setOpenModal}
      />

      <RejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onReject={handleReject}
        isLoading={isUpdatePending}
      />

      <CommentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        comments={currentComments}
        onSend={handleSend}
        isLoading={isAddingComment}
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

export default ExpenseTable;
