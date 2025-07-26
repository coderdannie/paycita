'use client';

import { useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import CustomTable from '../../../../components/common/CustomTable';
import { TableCell, TableRow } from '../../../../components/ui/table';
import TableEmptyState from '../../../../components/common/TableEmptyState';
import { useRouter } from 'next/navigation';

const LoanDetailsPage = () => {
  const router = useRouter();
  // Loan summary data
  const loanSummary = useMemo(
    () => ({
      loanId: '#3425785535',
      loanCollected: '₦20,000',
      loanDuration: '4 months',
      startingDate: '1 Aug 2024',
      dueDate: '1 Dec 2024',
    }),
    []
  );

  // Table headers for installments
  const headers = useMemo(
    () => [
      { label: 'Instruments' },
      { label: 'Monthly Installment' },
      { label: 'Due Date' },
      { label: 'Status' },
      { label: 'Overdue Days' },
    ],
    []
  );

  // Installment data
  const installments = useMemo(
    () => [
      {
        instrument: '1',
        monthlyInstallment: '₦5,000',
        dueDate: '1 Sep 2024',
        status: 'paid',
        overdueDays: '0 Days',
      },
      {
        instrument: '2',
        monthlyInstallment: '₦5,000',
        dueDate: '1 Oct 2024',
        status: 'due',
        overdueDays: '4 Days',
      },
      {
        instrument: '2',
        monthlyInstallment: '₦5,000',
        dueDate: '1 Nov 2024',
        status: 'not due',
        overdueDays: '0 Days',
      },
      {
        instrument: '2',
        monthlyInstallment: '₦5,000',
        dueDate: '1 Dec 2024',
        status: 'not due',
        overdueDays: '0 Days',
      },
    ],
    []
  );

  const renderStatusBadge = useCallback((status: string) => {
    const getStatusStyles = (status: string) => {
      switch (status.toLowerCase()) {
        case 'paid':
          return 'text-[#00AA4F] border-[#00AA4F] bg-white';
        case 'due':
          return 'text-[#EA3D3D] border-[#EA3D3D] bg-white';
        case 'not due':
          return 'text-[#FFA80A] border-[#FFD384] bg-white';
        default:
          return 'text-[#6C757D] border-[#6C757D] bg-white';
      }
    };

    return (
      <span
        className={`py-[5px] px-[10px] text-center inline-block text border rounded-md capitalize font-semibold ${getStatusStyles(
          status
        )}`}
      >
        {status}
      </span>
    );
  }, []);

  const handleGoBack = () => {
    router.back();
  };
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
            <span className="text-lg font-semibold text-gray-900">
              Sarah Johnson
            </span>
          </button>
        </div>

        {/* Loan Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Loan ID
            </div>
            <div className="text-sm font-medium text-gray-900 ">
              {loanSummary.loanId}
            </div>
          </div>
          <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Loan Collected
            </div>
            <div className="text-sm font-medium text-gray-900">
              {loanSummary.loanCollected}
            </div>
          </div>
          <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Loan Duration
            </div>
            <div className="text-sm font-medium text-gray-900">
              {loanSummary.loanDuration}
            </div>
          </div>
          <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Starting Date
            </div>
            <div className="text-sm font-medium text-gray-900">
              {loanSummary.startingDate}
            </div>
          </div>
          <div className="bg-white p-6 text-center rounded-lg border border-gray-200">
            <div className="text-[#344054] text-base font-bold mb-1">
              Due Date
            </div>
            <div className="text-sm font-medium text-gray-900">
              {loanSummary.dueDate}
            </div>
          </div>
        </div>

        {/* Installments Table */}
        <div>
          <CustomTable headers={headers}>
            {installments?.length ? (
              installments.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="text-[#1D2939] text-sm">
                  <TableCell className="py-5">
                    <div className="flex gap-2">{row.instrument}</div>
                  </TableCell>
                  <TableCell>{row.monthlyInstallment}</TableCell>
                  <TableCell>{row.dueDate}</TableCell>
                  <TableCell>{renderStatusBadge(row.status)}</TableCell>
                  <TableCell>{row.overdueDays}</TableCell>
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
