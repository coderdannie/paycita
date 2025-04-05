import CustomTable from '@/src/components/common/CustomTable';
import TableEmptyState from '@/src/components/common/TableEmptyState';
import { TableCell, TableRow } from '@/src/components/ui/table';
import { useCallback, useMemo } from 'react';

const Tax = () => {
  const headers = useMemo(() => [{ label: 'Name' }, { label: 'Status' }], []);
  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px] w-[50%] text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
      ${
        status === 'paid'
          ? 'text-green-600 border-[#89D8A9] bg-[#F5FFFA]'
          : 'text-red-600 border-[#F49E9E] bg-[#FFF5F5]'
      }`}
      >
        {status}
      </span>
    ),
    []
  );

  return (
    <div>
      <CustomTable headers={headers}>
        {['', '']?.length ? (
          ['', ''].map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="text-[#1D2939] text-center text-sm"
            >
              <TableCell className="py-5">
                <div className="flex gap-6">
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>{' '}
                  Payee Tax
                </div>
              </TableCell>
              <TableCell>{renderStatusBadge('paid')}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState
            headers={headers}
            messageTitle="No Data Available"
            desc="There are no records to display at the moment."
          />
        )}
      </CustomTable>
    </div>
  );
};
export default Tax;
