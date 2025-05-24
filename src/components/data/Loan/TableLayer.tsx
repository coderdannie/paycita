'use client';

import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import TableEmptyState from '../../common/TableEmptyState';
import { useCallback, useState } from 'react';
import LoanDetails from '../../modals/LoanDetails';
import { Info, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useDeleteLoanRequest,
  useGetLoanHistory,
} from '@/src/hooks/loan/useLoan';
import ConfirmationModal from '../../common/ConfirmationModal';

export type loanData = {
  loan_date: string;
  id: string;
  payment_status: string;
  total_payment: string;
  loan_period: string;
  loan_amount: string;
  outstanding?: string;
  loan_number: string;
  staff_name: string;
};

const TableLayer = ({ loans }: { loans: loanData[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState<loanData | null>(null);

  const handleOpen = (data: loanData) => {
    setDetails(data);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const headers = [
    {
      label: 'Loan No',
    },

    {
      label: 'Loan Amount',
    },
    {
      label: 'Loan Period',
    },
    {
      label: 'Outstanding',
    },
    {
      label: 'Total Payment',
    },
    {
      label: 'Status',
    },
    {
      label: 'Actions',
    },
  ];

  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px] w-[50%] text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
        ${
          status === 'pending'
            ? 'text-[#FFA80A] border-[#FFD384] bg-[#FFFF]'
            : 'text-[#3D7AEA] border-[#3D7AEA] bg-[#FFFF]'
        }`}
      >
        {status}
      </span>
    ),
    []
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<loanData | null>(null);

  const { loanHistory, isLoading } = useGetLoanHistory(details?.loan_number);

  console.log('history', loanHistory);

  const handleDelete = useCallback((loan: loanData) => {
    setLoanToDelete(loan);
    setIsDeleteModalOpen(true);
  }, []);

  const { mutate: mutateDeleteLoanRequest, isPending: isPendingDeleteLoan } =
    useDeleteLoanRequest();

  const handleConfirmDelete = useCallback(() => {
    if (loanToDelete) {
      mutateDeleteLoanRequest(loanToDelete.id.toString(), {
        onSuccess: () => {
          toast.success('Loan request deleted successfully');
          setIsDeleteModalOpen(false);
          setLoanToDelete(null);
        },
        onError: () => {
          toast.error('Failed to delete loan request');
        },
      });
    }
  }, [loanToDelete, mutateDeleteLoanRequest]);

  return (
    <div className="mt-[20px]">
      <CustomTable headers={headers}>
        {loans?.length ? (
          loans.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-[#1D2939] text-sm">
              <TableCell className="py-5">
                <div className="flex gap-2">{row.loan_number}</div>
              </TableCell>
              <TableCell>₦{row.loan_amount}</TableCell>
              <TableCell>{row.loan_period}</TableCell>
              <TableCell className="text-[#EA3D3D]">
                ₦{row.outstanding}
              </TableCell>
              <TableCell>₦{row.total_payment}</TableCell>
              <TableCell>{renderStatusBadge(row.payment_status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpen(row)}
                    className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    className="text-red-400 hover:text-red-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState headers={headers} />
        )}
      </CustomTable>
      <LoanDetails
        isOpen={isOpen}
        onClose={handleClose}
        details={loanHistory}
        loanData={details}
        isLoading={isLoading}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setLoanToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Loan Request"
        actionLabel="Delete"
        isLoading={isPendingDeleteLoan}
      />
    </div>
  );
};
export default TableLayer;
