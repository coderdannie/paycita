'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLargeFill } from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/src/components/ui/table';
import CustomTable from '../common/CustomTable';
import { loanData } from '../data/Loan/TableLayer';
import { formatDate } from '@/src/utils/helper';

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
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
}

interface ExtendedLoanData extends loanData {
  disbursement_date?: string;
  due_date?: string;
  total_paid?: number;
  outstanding?: string;
}
// Main API response interface
interface LoanApiResponse {
  loan_details: LoanDetails;
  repayment_history: RepaymentHistoryItem[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: LoanApiResponse;
  loanData: ExtendedLoanData;
  isLoading: boolean;
}

const loanHistoryHeaders = [
  { label: 'Installment No.' },
  { label: 'Payment Date' },
  { label: 'Amount Paid' },
  { label: 'Status' },
];

const LoanDetails: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  details,
  loanData,
  isLoading,
}) => {
  const formatCurrency = (amount: number) => {
    return `₦${amount?.toLocaleString()}`;
  };

  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px] w-full text-center block px-[10px] relative border-2 rounded-md cursor-pointer
         ${
           status.toLowerCase() === 'pending'
             ? 'text-[#FFA80A] border-[#FFD384] bg-[#FFFCF5]'
             : status.toLowerCase() === 'successful'
             ? 'text-[#16A34A] border-[#16A34A] bg-[#F0FDF4]'
             : status.toLowerCase() === 'failed'
             ? 'text-[#DC2626] border-[#DC2626] bg-[#FEF2F2]'
             : 'text-[#3D7AEA] border-[#3D7AEA] bg-[#FFFF]'
         }`}
      >
        {status}
      </span>
    ),
    []
  );

  const getHistoryStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'successful':
        return (
          <span className="inline-flex items-center gap-1 text-[#16A34A] text-sm">
            <div className="w-2 h-2 bg-[#16A34A] rounded-full"></div>
            Successful
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-lg font-semibold text-[#1D2939]">
                Loan Summary
              </h2>
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <RiCloseLargeFill />
              </button>
            </div>

            {/* Loan Summary Details */}
            <div className="space-y-4 mb-6">
              <DetailRow
                label="Loan Amount"
                value={formatCurrency(+details?.loan_details.amount)}
              />
              <DetailRow
                label="Loan Period"
                value={details?.loan_details.repayment_period ?? 'N/A'}
              />
              <DetailRow
                label="Disbursement Date"
                value={loanData?.loan_date ?? loanData.loan_date ?? 'N/A'}
              />
              <DetailRow label="Due Date" value={loanData?.due_date ?? 'N/A'} />
              <DetailRow
                label="Total Paid"
                value={
                  loanData.total_paid
                    ? formatCurrency(loanData.total_paid)
                    : '₦0'
                }
              />
              <DetailRow
                label="Outstanding"
                value={
                  loanData.outstanding
                    ? formatCurrency(Number(loanData.outstanding))
                    : formatCurrency(Number(loanData.loan_amount))
                }
              />
              <DetailRow
                label="Status"
                value={renderStatusBadge(loanData.payment_status ?? 'N/A')}
              />
            </div>

            {/* Loan History Section */}
            {details.repayment_history &&
              details.repayment_history.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-base font-medium text-[#1D2939] mb-4">
                    Loan History
                  </h3>
                  <CustomTable
                    headers={loanHistoryHeaders}
                    isLoading={isLoading}
                  >
                    {details.repayment_history.map((item) => (
                      <TableRow
                        key={item.id}
                        className="text-sm text-[#1D2939]"
                      >
                        <TableCell className="font-medium">
                          {item.loan_number}
                        </TableCell>
                        <TableCell>{formatDate(item?.created_at)}</TableCell>
                        <TableCell>{formatCurrency(+item?.amount)}</TableCell>
                        <TableCell>
                          {getHistoryStatusBadge(item.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </CustomTable>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Detail Row Component
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) => (
  <div className="flex justify-between items-center">
    <p className="text-sm text-[#667085] font-medium">{label}</p>
    <div className="text-sm font-semibold text-[#344054]">
      {typeof value === 'string' ? value : value}
    </div>
  </div>
);

export default LoanDetails;
