import { useCallback, useMemo } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import { Info } from 'lucide-react';
import TableEmptyState from '../../common/TableEmptyState';
import Link from 'next/link';
import { useGetAllLoanRequest } from '@/src/hooks/loan/useLoan';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useSearchParams } from 'next/navigation';
import CustomPagination from '../../common/pagination/Pagination';

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

  const { loanRequests, isPending } = useGetAllLoanRequest({
    page: '1',
  });

  console.log('loan request', loanRequests);
  // Dummy data based on your screenshot

  const updateSearchParams = useUpdateSearchParams();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page') || 1);

  const leavesPerPage = 5;

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() }, { scroll: true });
    },
    [updateSearchParams]
  );

  const paginatedData = useMemo(() => {
    return loanRequests?.slice(
      (currentPage - 1) * leavesPerPage,
      currentPage * leavesPerPage
    );
  }, [loanRequests, currentPage, leavesPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(loanRequests.length / leavesPerPage);
  }, [loanRequests, leavesPerPage]);

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

  return (
    <div>
      <CustomTable headers={headers} isLoading={isPending}>
        {paginatedData?.length ? (
          paginatedData?.map((row) => (
            <TableRow key={row?.id} className="text-[#1D2939] text-sm">
              <TableCell className="py-5">
                <div className="flex gap-2">{row?.employee_name}</div>
              </TableCell>
              <TableCell>{row?.department}</TableCell>
              <TableCell>₦{Number(row?.amount).toLocaleString()}</TableCell>
              <TableCell>{row?.months}</TableCell>
              <TableCell>{renderStatusBadge(row?.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/loan-management/${row?.id}`}
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
      {totalPages > 1 && (
        <div className="mt-6">
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            goToPage={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default LoanTable;
