import { useCallback, useMemo } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import { Info } from 'lucide-react';
import TableEmptyState from '../../common/TableEmptyState';
import Link from 'next/link';

const LoanTable = () => {
  const headers = useMemo(
    () => [
      { label: 'Full Name' },
      { label: 'Department' },
      { label: 'Requested Amount' },
      { label: 'Loan Period' },
      { label: 'Status' },
      { label: '' },
    ],
    []
  );

  // Dummy data based on your screenshot
  const loans = useMemo(
    () => [
      {
        loan_number: 'Sarah Johnson',
        department: 'Finance',
        loan_amount: '20,000',
        loan_period: '4 months',
        payment_status: 'pending',
      },
      {
        loan_number: 'Sarah Johnson',
        department: 'Human Resources',
        loan_amount: '10,000',
        loan_period: '4 months',
        payment_status: 'approved',
      },
      {
        loan_number: 'Sarah Johnson',
        department: 'IT Support',
        loan_amount: '20,000',
        loan_period: '4 months',
        payment_status: 'rejected',
      },
      {
        loan_number: 'Sarah Johnson',
        department: 'Marketing',
        loan_amount: '20,000',
        loan_period: '4 months',
        payment_status: 'repaid',
      },
      {
        loan_number: 'Sarah Johnson',
        department: 'Human Resources',
        loan_amount: '20,000',
        loan_period: '4 months',
        payment_status: 'rejected',
      },
      {
        loan_number: 'Sarah Johnson',
        department: 'Finance',
        loan_amount: '20,000',
        loan_period: '4 months',
        payment_status: 'repaid',
      },
    ],
    []
  );

  const renderStatusBadge = useCallback((status: string) => {
    const getStatusStyles = (status: string) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'text-[#FFA80A] border-[#FFD384] bg-white w-fit';
        case 'approved':
          return 'text-[#00AA4F] border-[#00AA4F] bg-white w-fit';
        case 'rejected':
          return 'text-[#EA3D3D] border-[#EA3D3D] bg-white w-fit';
        case 'repaid':
          return 'text-[#3D7AEA] border-[#3D7AEA] bg-white w-fit';
        default:
          return 'text-[#6C757D] border-[#6C757D] bg-white w-fit ';
      }
    };

    return (
      <span
        className={`py-[5px] w-[70px] text-center block px-[10px] text border rounded-md capitalize font-semibold ${getStatusStyles(
          status
        )}`}
      >
        {status}
      </span>
    );
  }, []);

  const handleOpen = useCallback((row: any) => {
    console.log('Opening details for:', row);
    // Add your logic here
  }, []);

  return (
    <CustomTable headers={headers}>
      {loans?.length ? (
        loans.map((row, rowIndex) => (
          <TableRow key={rowIndex} className="text-[#1D2939] text-sm">
            <TableCell className="py-5">
              <div className="flex gap-2">{row.loan_number}</div>
            </TableCell>
            <TableCell>{row.department}</TableCell>
            <TableCell>₦{row.loan_amount}</TableCell>
            <TableCell>{row.loan_period}</TableCell>
            <TableCell>{renderStatusBadge(row.payment_status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link
                  onClick={() => handleOpen(row)}
                  href={`/loan-management/${rowIndex}`}
                  className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                >
                  <Info className="w-4 h-4" />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableEmptyState headers={headers} />
      )}
    </CustomTable>
  );
};

export default LoanTable;
