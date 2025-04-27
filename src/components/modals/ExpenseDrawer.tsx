"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "../../components/ui/table";
import CustomTable from "../common/CustomTable";
import { formatDate } from "@/src/utils/helper";
import { Spinner } from "react-activity";
import Image from "next/image";
import { CommentThread } from "@/src/types/procurement";

const expenseHeaders = [
  { label: "Item Name" },
  { label: "Description" },
  { label: "Vendor Name" },
  { label: "Unit Price" },
  { label: "Quantity" },
  { label: "Total Cost" },
];

export default function ExpenseDrawer({
  open,
  onOpenChange,
  setIsShow,
  expense,
  handleApprove,
  isLoading,
  setOpenComment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsShow: (open: boolean) => void;
  expense: {
    comment_thread: CommentThread | null;
    employee_name: {
      full_name: string;
      last_name: string;
    };
    expenses_number: string;
    created_at: string;
    expected_delivery_date: string;
    items: Array<{
      item: string;
      description: string;
      vendor: string;
      price: string;
      quantity: string;
    }>;
    total_cost: string;
    status: string;
  };
  handleApprove: () => void;
  isLoading: boolean;
  setOpenComment: (open: boolean) => void;
}) {
  const commentsCount = expense?.comment_thread?.comments?.length || 0;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl px-4 md:px-8 py-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Expenses request</DialogTitle>
        </DialogHeader>

        {/* Info Section */}
        <div className="grid  gap-6 text-sm text-[#667085] mt-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Employee Name</p>
            <p className="text-[#1D2939] font-semibold">
              {expense.employee_name?.full_name || "N/A"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Expense Number</p>
            <p className="text-[#1D2939] font-semibold">
              {expense.expenses_number}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Request Date</p>
            <p className="text-[#1D2939] font-semibold">
              {formatDate(expense.created_at)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Expected Delivery Date</p>
            <p className="text-[#1D2939] font-semibold">
              {expense.expected_delivery_date || "N/A"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Status</p>
            <span className="inline-block text-[#5252FF] bg-[#EDEDFB] px-3 py-[2px] rounded-md w-fit capitalize">
              {expense.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">No of requested item:</p>
            <p className="text-[#1D2939] font-semibold">
              {expense?.items?.length}
            </p>
          </div>
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

              <span className="text-sm text-[#344054] text-semibold gap-1">
                {commentsCount} comments
              </span>
            </button>
          </div>
        </div>

        {/* Items Table */}
        <CustomTable headers={expenseHeaders}>
          {expense?.items?.map((item, i) => (
            <TableRow key={i} className="text-sm text-[#1D2939]">
              <TableCell>{item.item}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.vendor || "N/A"}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{expense.total_cost}</TableCell>
            </TableRow>
          ))}
        </CustomTable>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button onClick={handleApprove} disabled={isLoading}>
            {isLoading ? <Spinner /> : "Approve"}
          </Button>
          <Button
            variant="outline"
            className="border border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => {
              setIsShow(true);
              onOpenChange(false);
            }}
          >
            Reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
