'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { TableCell, TableRow } from '../../components/ui/table';
import CustomTable from '../common/CustomTable';
import { ExpenseRequest } from '@/src/types/allPurchaseExpenses';
import { Approvals, CommentThread } from '@/src/types/procurement';
import { useAuthSelector } from '@/src/Redux/selectors';

const expenseHeaders = [
  { label: 'Item Name' },
  // { label: 'Description' },
  // { label: 'Vendor Name' },
  { label: 'Unit Price' },
  { label: 'Quantity' },
  { label: 'Total Cost' },
];

interface ExpenseItem {
  id: string;
  item: string;
  description: string;
  price: number;
  quantity: number;
}

interface ExpenseDetails {
  vendor: string | null;
  comment_thread: CommentThread | null;
  approvals: Approvals | null;
  id: string;
  procurement_number: string;
  status: string;
  total_cost: number;
  created_at: string;
  expected_delivery_date?: string;
  items: ExpenseItem[];
  description?: string;
}

interface ExpenseRequestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedExpenses: ExpenseRequest;
  expense: ExpenseDetails;
}

const ExpenseRequestDrawer = ({
  open,
  onOpenChange,
  selectedExpenses,
  expense,
}: ExpenseRequestProps) => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || 'NGN';

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-[#EDEDFB] text-[#5252FF]';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl px-4 md:px-8 py-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Expenses request</DialogTitle>
        </DialogHeader>

        {/* Info Section */}
        <div className="grid gap-6 text-sm text-[#667085] mt-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Employee Name</p>
            <p className="text-[#1D2939] font-semibold">
              {selectedExpenses?.employee_name}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Expense Number</p>
            <p className="text-[#1D2939] font-semibold">
              {selectedExpenses?.expense_number}
            </p>
          </div>

          {/* <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Request Date</p>
            <p className="text-[#1D2939] font-semibold">
              {selectedExpenses?.requestDate}
            </p>
          </div> */}

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]"> Date</p>
            <p className="text-[#1D2939] font-semibold">
              {selectedExpenses?.date}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Department</p>
            <p className="text-[#1D2939] font-semibold">
              {selectedExpenses?.department}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Status</p>
            <span
              className={`inline-block ${getStatusBadgeColor(
                selectedExpenses?.status
              )} px-3 py-[2px] rounded-md w-fit capitalize`}
            >
              {selectedExpenses?.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">No of requested item</p>
            <p className="text-[#1D2939] font-semibold">
              {expense?.items?.length}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <CustomTable headers={expenseHeaders}>
          {expense?.items?.map((item) => (
            <TableRow key={item.id} className="border-b-2">
              <TableCell>{item.item}</TableCell>

              <TableCell>
                {currency}
                {Number(item.price).toLocaleString()}
              </TableCell>
              <TableCell>x{item.quantity}</TableCell>
              <TableCell>
                {currency}
                {(Number(item.price) * item.quantity).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button>
            Download
            <Download className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseRequestDrawer;
