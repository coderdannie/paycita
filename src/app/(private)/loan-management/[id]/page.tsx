'use client';

import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import CustomTable from '../../../../components/common/CustomTable';
import { TableCell, TableRow } from '../../../../components/ui/table';
import TableEmptyState from '../../../../components/common/TableEmptyState';
import { useParams, useRouter } from 'next/navigation';
import { useGetLoanRepaymentHistoryById } from '@/src/hooks/loan/useLoan';
import LoadingOverlay from '@/src/components/common/LoadingOverlay';
import { formatCurrency, formatDate } from '@/src/utils/helper';

const LoanDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const loanId = id as string;

  const { history, isLoading } = useGetLoanRepaymentHistoryById(loanId || '');

  const headers = useMemo(
    () => [
      { label: 'Loan Id' },
      { label: 'Loan Collected' },
      { label: 'Monthly Installment' },
      { label: 'Start Date' },
    ],
    []
  );

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {/* <span className="text-lg font-semibold text-gray-900">
              Sarah Johnson
            </span> */}
          </button>
        </div>

        {/* Loan Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Loan ID
            </div>
            <div className="text-sm font-medium text-gray-900 ">
              {history?.loan_details?.loan_number}
            </div>
          </div>
          <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Loan Collected
            </div>
            <div className="text-sm font-medium text-gray-900">
              ₦ {history?.loan_details?.amount}
            </div>
          </div>
          <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Loan Duration
            </div>
            <div className="text-sm font-medium text-gray-900">
              {history?.loan_details?.repayment_period}
            </div>
          </div>
          <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Start Date
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(history?.loan_details?.created_at)}
            </div>
          </div>
          {/* <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Due Date
            </div>
            <div className="text-sm font-medium text-gray-900">
              {loanSummary.dueDate}
            </div>
          </div> */}
        </div>

        {/* Installments Table */}
        <div>
          <CustomTable headers={headers} isLoading={isLoading}>
            {history?.repayment_history?.length ? (
              history?.repayment_history.map((row) => (
                <TableRow
                  key={row?.loan_details?.loan_number}
                  className="text-[#1D2939] text-sm"
                >
                  <TableCell className="py-5">
                    <div className="flex gap-2">
                      {row?.loan_details?.loan_number}
                    </div>
                  </TableCell>
                  <TableCell>
                    ₦ {formatCurrency(row?.loan_details?.amount)}
                  </TableCell>
                  <TableCell>{row?.loan_details?.repayment_period}</TableCell>
                  <TableCell>{row?.loan_details?.createdAt}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableEmptyState headers={headers} />
            )}
          </CustomTable>
        </div>
      </div>
    </>
  );
};

export default LoanDetailsPage;
