"use client";

import React, { useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { TableCell, TableRow } from "../../components/ui/table";
import CustomTable from "../common/CustomTable";
import { formatDate } from "@/src/utils/helper";
import Image from "next/image";

interface LoanDetails {
  loan_number: string;
  amount: string;
  repayment_period: string;
  created_at: string;
}

// Interface for individual repayment history item
interface RepaymentHistoryItem {
  id: number;
  tenant_id: string;
  user_id: string;
  loan_number: string;
  amount: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "paid"
    | "success";
  created_at: string | null;
  updated_at: string | null;
}

interface ExtendedLoanData {
  loan_number: string;
  loan_amount: string;
  loan_period: string;
  loan_type: string;
  outstanding?: number | string;
  total_payment: string;
  payment_status: string;
  staff_name: string;
  status: string;
  created_at: string;
  disbursement_date?: string;
  due_date?: string;
  total_paid?: number;
  repayment_history?: RepaymentHistoryItem[];
  pending_with?: string;
}

// Main API response interface
interface LoanApiResponse {
  loan_details: LoanDetails;
  repayment_history: RepaymentHistoryItem[];
}

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details: LoanApiResponse;
  loanData: ExtendedLoanData;
  isLoading: boolean;
  setOpenComment?: (open: boolean) => void;
}

const loanHistoryHeaders = [
  { label: "NO" },
  { label: "Amount" },
  { label: "Date" },
  { label: "Status" },
];

const LoanDetailsDrawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  details,
  loanData,
  isLoading,
  setOpenComment,
}) => {
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return `₦${numAmount?.toLocaleString()}`;
  };

  const renderStatusBadge = useCallback((status: string) => {
    const statusLower = status?.toLowerCase();
    let badgeClass = "";

    switch (statusLower) {
      case "pending":
        badgeClass = "text-[#FFA80A] bg-[#FFFCF5] border-[#FFD384]";
        break;
      case "success":
      case "paid":
      case "successful":
      case "completed":
        badgeClass = "text-[#16A34A] bg-[#F0FDF4] border-[#16A34A]";
        break;
      case "failed":
      case "rejected":
        badgeClass = "text-[#DC2626] bg-[#FEF2F2] border-[#DC2626]";
        break;
      default:
        badgeClass = "text-[#3D7AEA] bg-[#FFFF] border-[#3D7AEA]";
    }

    return (
      <span
        className={`inline-block px-3 py-[2px] rounded-md w-fit capitalize border ${badgeClass}`}
      >
        {status}
      </span>
    );
  }, []);

  const getHistoryData = () => {
    if (details?.repayment_history?.length > 0) {
      return details.repayment_history.map((item) => ({
        id: item.id,
        amount: formatCurrency(item.amount),
        date: item.created_at ? formatDate(item.created_at) : "N/A",
        status: item.status,
      }));
    }
    return [];
  };

  const historyData = getHistoryData();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col h-full"
      >
        <SheetHeader className="px-4 md:px-6 py-4 border-b flex-shrink-0">
          <SheetTitle>Loan History</SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-6 py-4">
            {/* Loan Details Section */}
            <div className="grid gap-6 text-sm text-[#667085]">
              <div className="flex items-center justify-between">
                <p className="font-medium text-[#344054]">Loan No</p>
                <p className="text-[#1D2939] font-semibold">
                  {details?.loan_details?.loan_number || "N/A"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-medium text-[#344054]">Status</p>
                <div>
                  {renderStatusBadge(
                    loanData?.payment_status || loanData?.status || "N/A"
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-medium text-[#344054]">Loan Date</p>
                <p className="text-[#1D2939] font-semibold">
                  {formatDate(
                    loanData?.created_at || details?.loan_details?.created_at
                  ) || "N/A"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-medium text-[#344054]">Full Name</p>
                <p className="text-[#1D2939] font-semibold">
                  {loanData?.staff_name || "N/A"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-medium text-[#344054]">Loan Amount</p>
                <p className="text-[#1D2939] font-semibold">
                  {formatCurrency(
                    loanData?.loan_amount ||
                      details?.loan_details?.amount ||
                      "0"
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-medium text-[#344054]">Period</p>
                <p className="text-[#1D2939] font-semibold">
                  {loanData?.loan_period ||
                    details?.loan_details?.repayment_period ||
                    "N/A"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-medium text-[#344054]">Loan Purpose</p>
                <p className="text-[#1D2939] font-semibold">
                  {loanData?.loan_type || "N/A"}
                </p>
              </div>
              {loanData?.status?.toLocaleLowerCase() === "pending" && (
                <p className="font-bold text-sm">
                  Pending with:{" "}
                  <span className="text-orange-500">
                    {loanData?.pending_with}
                  </span>{" "}
                </p>
              )}
              {/* Comments section */}
              {setOpenComment && (
                <div className="flex justify-end">
                  <button
                    className="flex gap-1 items-center"
                    onClick={() => {
                      setOpenComment(true);
                      onOpenChange(false);
                    }}
                  >
                    <Image
                      src="/assets/messages.png"
                      alt="message icon"
                      width={20}
                      height={20}
                    />
                    <span className="text-sm text-[#344054] font-semibold">
                      0 comments
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Loan History Table */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#1D2939] mb-4">
                Repayment History
              </h3>

              {/* Table Container with horizontal scroll */}
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-full px-4 md:px-0">
                  <CustomTable
                    headers={loanHistoryHeaders}
                    isLoading={isLoading}
                  >
                    {historyData?.length > 0 ? (
                      historyData.map((item, index) => (
                        <TableRow
                          key={item.id}
                          className="text-sm text-[#1D2939]"
                        >
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.amount}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.date}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(item.status)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-[#667085]"
                        >
                          No repayment history available
                        </TableCell>
                      </TableRow>
                    )}
                  </CustomTable>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="border-t px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoanDetailsDrawer;
