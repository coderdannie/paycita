import { formatDate } from '@/src/utils/helper';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';

interface Transaction {
  transaction_id: string;
  transaction_type: string;
  provider: string;
  phone_number: string;
  amount: string;
  date: string;
  status: string;
}

interface TransactionsTableProps {
  tableData: Transaction[];
  isLoading: boolean;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  tableData,
  isLoading,
}) => {
  const headers = [
    {
      label: 'Transaction ID',
    },
    {
      label: 'Transaction Type',
    },
    {
      label: 'Provider',
    },
    {
      label: 'Phone Number',
    },
    {
      label: 'Amount',
    },
    {
      label: 'Date',
    },
    {
      label: 'Status',
    },
  ];

  return (
    <div className="mt-5">
      {' '}
      <CustomTable headers={headers} center={true} isLoading={isLoading}>
        {tableData?.length ? (
          tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className=" text-center text-sm">
              <TableCell className="py-5">{row['transaction_id']}</TableCell>
              <TableCell>{row['transaction_type']}</TableCell>
              <TableCell>{row['provider']}</TableCell>
              <TableCell>{row['phone_number']}</TableCell>
              <TableCell>{row['amount']}</TableCell>
              <TableCell>{formatDate(row['date'])}</TableCell>
              <TableCell>
                <span
                  className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                  ${
                    row['status'].toLowerCase() === 'success'
                      ? 'text-green-600  border-[#89D8A9]  bg-[#F5FFFA]'
                      : 'text-red-600   border-[#F49E9E] bg-[#FFF5F5]'
                  }
                `}
                >
                  {row['status']}
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={headers.length} className="text-center py-6">
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold text-gray-700">
                  No Transaction Records
                </p>
                <p className="text-sm text-gray-500">
                  Transactions will appear here.
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </div>
  );
};
export default TransactionsTable;
