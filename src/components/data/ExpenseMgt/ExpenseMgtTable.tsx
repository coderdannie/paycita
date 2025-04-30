'use client';

import Image from 'next/image';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import { Dispatch, SetStateAction } from 'react';
import { formatLongCurrency } from '@/src/utils/helper';
import { FaRegEdit } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';

export interface ExpenseData {
  id: string;
  expenses_number: string;
  quantity: string;
  total_cost: string;
  status: 'Successful' | 'Pending' | 'Rejected' | string;
}

interface ExpenseTableProps {
  tableData: ExpenseData[];
  setIsShow: (value: boolean) => void;
  setExpenseId: Dispatch<SetStateAction<string>>;
  handleEdit: () => void;
  handleDelete: (procurement: ExpenseData) => void;
}

const ExpenseMgtTable: React.FC<ExpenseTableProps> = ({
  tableData,
  setIsShow,
  setExpenseId,
  handleEdit,
  handleDelete,
}) => {
  const headers = [
    { label: 'Request ID' },

    { label: 'Total Cost' },
    // { label: "Quantity" },
    { label: 'Status' },
    { label: '' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-green-600 border-[#89D8A9] bg-[#F5FFFA]';
      case 'pending':
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
              <TableCell className="py-5">
                {row.expenses_number ?? 'N/A'}
              </TableCell>
              <TableCell className="py-5">{'Office tools'}</TableCell>
              <TableCell>
                {formatLongCurrency(+row.total_cost) ?? 'N/A'}
              </TableCell>
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
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                    onClick={() => {
                      setIsShow(true);
                      setExpenseId(row.id);
                    }}
                    aria-label={`View details for ${row.expenses_number}`}
                  >
                    <Image
                      src="/assets/warn.svg"
                      alt="info icon"
                      width={15}
                      height={15}
                    />
                  </button>

                  <button
                    onClick={() => {
                      handleEdit();
                      setExpenseId(row.id);
                    }}
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                  >
                    <FaRegEdit className="w-4 h-4" />
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
