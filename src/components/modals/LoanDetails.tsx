'use client';

import React, { useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/src/components/ui/table';
import CustomTable from '../common/CustomTable';
import { formatDate } from '@/src/utils/helper';
import Image from 'next/image';

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
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'paid';
  created_at: string;
  updated_at: string;
}

interface ExtendedLoanData {
  loan_number: string;
  loan_amount: string;
  loan_period: string;
  loan_type: string;
  outstanding: number;
  total_payment: string;
  payment_status: string;
  staff_name: string;
  status: string;
  created_at: string;
  disbursement_date?: string;
  due_date?: string;
  total_paid?: number;
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
  { label: 'NO' },
  { label: 'Amount' },
  { label: 'Date' },
  { label: 'Status' },
];

// Dummy data for loan history table
const dummyLoanHistory = [
  {
    id: 1,
    amount: '₦5,000',
    date: '1 Aug 2024',
    status: 'Paid',
  },
  {
    id: 2,
    amount: '₦5,000',
    date: '1 Oct 2024',
    status: 'Paid',
  },
  {
    id: 3,
    amount: '₦5,000',
    date: '3 Nov 2024',
    status: 'Paid',
  },
  {
    id: 4,
    amount: '₦5,000',
    date: '4 Dec 2024',
    status: 'Paid',
  },
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
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₦${numAmount?.toLocaleString()}`;
  };

  const renderStatusBadge = useCallback((status: string) => {
    const statusLower = status?.toLowerCase();
    let badgeClass = '';

    switch (statusLower) {
      case 'pending':
        badgeClass = 'text-[#FFA80A] bg-[#FFFCF5] border-[#FFD384]';
        break;
      case 'paid':
      case 'successful':
      case 'completed':
        badgeClass = 'text-[#16A34A] bg-[#F0FDF4] border-[#16A34A]';
        break;
      case 'failed':
      case 'rejected':
        badgeClass = 'text-[#DC2626] bg-[#FEF2F2] border-[#DC2626]';
        break;
      default:
        badgeClass = 'text-[#3D7AEA] bg-[#FFFF] border-[#3D7AEA]';
    }

    return (
      <span
        className={`inline-block px-3 py-[2px] rounded-md w-fit capitalize border ${badgeClass}`}
      >
        {status}
      </span>
    );
  }, []);

  const getHistoryStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();

    switch (statusLower) {
      case 'paid':
      case 'successful':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[#16A34A] text-sm">
            <div className="w-2 h-2 bg-[#16A34A] rounded-full"></div>
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[#FFA80A] text-sm">
            <div className="w-2 h-2 bg-[#FFA80A] rounded-full"></div>
            Pending
          </span>
        );
      case 'failed':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[#DC2626] text-sm">
            <div className="w-2 h-2 bg-[#DC2626] rounded-full"></div>
            Failed
          </span>
        );
      default:
        return status;
    }
  };

  // Use actual loan history if available, otherwise use dummy data
  const historyData =
    details?.repayment_history?.length > 0
      ? details.repayment_history.map((item, index) => ({
          id: item.id,
          amount: formatCurrency(item.amount),
          date: formatDate(item.created_at),
          status: item.status,
        }))
      : dummyLoanHistory;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl px-4 md:px-8 py-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Loan History</DialogTitle>
        </DialogHeader>

        {/* Loan Details Section */}
        <div className="grid gap-6 text-sm text-[#667085] mt-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Loan No</p>
            <p className="text-[#1D2939] font-semibold">
              {loanData?.loan_number ||
                details?.loan_details?.loan_number ||
                'N/A'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Status</p>
            <div>
              {renderStatusBadge(
                loanData?.payment_status || loanData?.status || 'N/A'
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Loan Date</p>
            <p className="text-[#1D2939] font-semibold">
              {formatDate(
                loanData?.created_at || details?.loan_details?.created_at
              ) || 'N/A'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Full Name</p>
            <p className="text-[#1D2939] font-semibold">
              {loanData?.staff_name || 'N/A'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Loan Amount</p>
            <p className="text-[#1D2939] font-semibold">
              {formatCurrency(
                loanData?.loan_amount || details?.loan_details?.amount || '0'
              )}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Period</p>
            <p className="text-[#1D2939] font-semibold">
              {loanData?.loan_period ||
                details?.loan_details?.repayment_period ||
                'N/A'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-[#344054]">Loan Purpose</p>
            <p className="text-[#1D2939] font-semibold">
              {loanData?.loan_type || 'N/A'}
            </p>
          </div>

          {/* Comments section - similar to expense drawer */}
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
                <span className="text-sm text-[#344054] text-semibold gap-1">
                  0 comments
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Loan History Table */}
        <div className="mt-6">
          <CustomTable headers={loanHistoryHeaders} isLoading={isLoading}>
            {historyData.map((item, index) => (
              <TableRow key={item.id} className="text-sm text-[#1D2939]">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{getHistoryStatusBadge(item.status)}</TableCell>
              </TableRow>
            ))}
          </CustomTable>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanDetailsDrawer;
