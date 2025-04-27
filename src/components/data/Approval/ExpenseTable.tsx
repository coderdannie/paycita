"use client";

import { useCallback, useMemo, useState } from "react";
import CustomTable from "../../common/CustomTable";
import { TableCell, TableRow } from "../../ui/table";
import TableEmptyState from "../../common/TableEmptyState";
import { Button } from "@/components/ui/button";
import ExpenseDrawer from "../../modals/ExpenseDrawer";
import { useGetSingleExpense } from "@/src/hooks/expenses/useExpenses";
import RejectModal from "../../modals/RejectModal";
import { useUpdateApproval } from "@/src/hooks/approvals/useApprovals";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

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
  const [isOpen, setIsOpen] = useState(false);
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

  const { expense } = useGetSingleExpense(expenseId);

  const handleViewDetails = useCallback(
    (id: string) => {
      setExpenseId(id);
      setIsOpen(true);
    },
    [setExpenseId, setIsOpen]
  );

  const { mutate: mutateUpdateApprovalStatus, isPending: isUpdatePending } =
    useUpdateApproval("update-expenses-requests");

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const handleReject = (comment: string) => {
    const payload = {
      id: expenseId,
      data: {
        status: "rejected",
        reason: comment,
      },
    };
    mutateUpdateApprovalStatus(payload, {
      onSuccess: () => {
        toast.success("Status updated successfully");
        setIsRejectOpen(false);
        // queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_APPROVALS]);
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
              {/* <TableCell>{row.name}</TableCell> */}
              <TableCell>{row.expenses_number}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{renderStatusBadge(row.status)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="border-primary"
                  onClick={() => handleViewDetails(row.expenses_id)}
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
      />

      <RejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onReject={handleReject}
        isLoading={isUpdatePending}
      />
    </div>
  );
};

export default ExpenseTable;
