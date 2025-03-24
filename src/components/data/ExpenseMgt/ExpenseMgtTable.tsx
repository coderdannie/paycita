'use client';

import Image from 'next/image';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';

interface ExpenseData {
  requestID: string;
  itemName: string;
  quantity: string;
  totalCost: string;
  status: 'Successful' | 'Pending' | 'Rejected' | string; // Explicit status types
}

interface ExpenseTableProps {
  tableData: ExpenseData[];
  setIsShow: (value: boolean) => void;
}

const ExpenseMgtTable: React.FC<ExpenseTableProps> = ({
  tableData,
  setIsShow,
}) => {
  const headers = [
    { label: 'Request ID' },
    { label: 'Item Name' },
    { label: 'Quantity' },
    { label: 'Total Cost' },
    { label: 'Status' },
    { label: '' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Successful':
        return 'text-green-600 border-[#89D8A9] bg-[#F5FFFA]';
      case 'Pending':
        return 'text-yellow-600 border-[#F4D03F] bg-[#FEF9E7]';
      default: // For Rejected or any other status
        return 'text-red-600 border-[#F49E9E] bg-[#FFF5F5]';
    }
  };

  return (
    <div className="mt-5">
      <CustomTable headers={headers} center={true}>
        {tableData?.length ? (
          tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-center text-sm">
              <TableCell className="py-5">{row.requestID}</TableCell>
              <TableCell>{row.itemName}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.totalCost}</TableCell>
              <TableCell>
                <span
                  className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer ${getStatusStyle(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </TableCell>
              <TableCell>
                <button
                  className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                  onClick={() => setIsShow(true)}
                  aria-label={`View details for ${row.itemName}`}
                >
                  <Image
                    src="/assets/warn.svg"
                    alt="info icon"
                    width={15}
                    height={15}
                  />
                </button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={headers.length} className="text-center py-6">
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold text-gray-700">
                  No Expense Records
                </p>
                <p className="text-sm text-gray-500">
                  Expense Records will appear here.
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </div>
  );
};

export default ExpenseMgtTable;
