'use client';

import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { TableCell, TableRow } from '../../components/ui/table';
import CustomTable from '../common/CustomTable';
import { formatDate } from '@/src/utils/helper';
import { ProcurementData, ProcurementRequest } from '@/src/types/procurement';
import { useAuthSelector } from '@/src/Redux/selectors';

const expenseHeaders = [
  { label: 'Item Name' },
  { label: 'Quantity' },
  { label: 'Unit Price' },
  { label: 'Total Cost' },
];

interface ProcurementRequestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procurement: ProcurementData;
  selectedProcurement: ProcurementRequest;
}

const ProcurementRequestDrawer = ({
  procurement,
  open,
  onOpenChange,
  selectedProcurement,
}: ProcurementRequestProps) => {
  console.log('pro', procurement);
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

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
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Procurement Request- View Details</DialogTitle>
        </DialogHeader>

        {/* Info Section */}
        <div className="grid gap-6 text-sm text-[#667085] mt-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Employee Name</p>
            <p className="text-[#1D2939] font-semibold">
              {selectedProcurement?.employee_name}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Request Id</p>
            <p className="text-[#1D2939] font-semibold">
              {selectedProcurement?.procurement_number}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Request Date</p>
            <p className="text-[#1D2939] font-semibold">
              {formatDate(selectedProcurement?.date)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Department</p>
            <p className="text-[#1D2939] font-semibold">
              {selectedProcurement?.department}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Status</p>
            <span
              className={`inline-block ${getStatusBadgeColor(
                selectedProcurement?.status
              )} px-3 py-[2px] rounded-md w-fit capitalize`}
            >
              {selectedProcurement?.status}
            </span>
          </div>
        </div>

        {/* Items Table */}
        <CustomTable headers={expenseHeaders}>
          {procurement?.items?.map((item) => (
            <TableRow key={item.id} className="text-sm text-[#1D2939]">
              <TableCell>{item.item}</TableCell>
              <TableCell>{item.quantity} Items</TableCell>
              <TableCell>
                {currency}
                {formatCurrency(Number(item.price))}
              </TableCell>
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

export default ProcurementRequestDrawer;
