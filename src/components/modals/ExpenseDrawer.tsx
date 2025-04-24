'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '../../components/ui/table';
import CustomTable from '../common/CustomTable';

const expenseHeaders = [
  { label: 'Item Name' },
  { label: 'Description' },
  { label: 'Vendor Name' },
  { label: 'Unit Price' },
  { label: 'Quantity' },
  { label: 'Total Cost' },
];
const expenseItems = [
  {
    item: 'Laptop',
    description: 'HP Elitebook',
    vendor: 'Slot',
    unitPrice: '₦750',
    quantity: '7 items',
    totalCost: '₦6,000',
  },
  {
    item: 'Mouse',
    description: 'Wireless',
    vendor: 'Jumia',
    unitPrice: '₦750',
    quantity: '15 items',
    totalCost: '₦1,250',
  },
  {
    item: 'Keyboard',
    description: 'Bluetooth Mouse',
    vendor: 'Konga',
    unitPrice: '₦750',
    quantity: '15 items',
    totalCost: '₦1,250',
  },
];

export default function ExpenseDrawer({
  open,
  onOpenChange,
  setIsShow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsShow: (open: boolean) => void;
}) {
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
            <p className="text-[#1D2939] font-semibold">Bunmi Tanny</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Expense Number</p>
            <p className="text-[#1D2939] font-semibold">NG-1254</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Request Date</p>
            <p className="text-[#1D2939] font-semibold">April 12, 2025</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Expected Delivery Date</p>
            <p className="text-[#1D2939] font-semibold">May 2, 2025</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Status</p>
            <span className="inline-block text-[#5252FF] bg-[#EDEDFB] px-3 py-[2px] rounded-md w-fit">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">No of requested item:</p>
            <p className="text-[#1D2939] font-semibold">3</p>
          </div>
        </div>

        {/* Items Table */}
        <CustomTable headers={expenseHeaders}>
          {expenseItems.map((item, i) => (
            <TableRow key={i} className="text-sm text-[#1D2939]">
              <TableCell>{item.item}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.vendor}</TableCell>
              <TableCell>{item.unitPrice}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.totalCost}</TableCell>
            </TableRow>
          ))}
        </CustomTable>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button>Approve</Button>
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
