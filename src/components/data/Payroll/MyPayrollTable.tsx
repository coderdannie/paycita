'use client';

import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';
import Link from 'next/link';
import { LuArrowDownToLine } from 'react-icons/lu';
import { useGetMyPayslip } from '@/src/hooks/payroll/usePayroll';
import { formatDate } from '@/src/utils/helper';
import { useAuthSelector } from '@/src/Redux/selectors';
import TableEmptyState from '../../common/TableEmptyState';

interface Header {
  label: string;
}

interface MyPayrollTableProps {
  headers: Header[];
  hidden?: boolean;
}

const MyPayrollTable: React.FC<MyPayrollTableProps> = ({ headers, hidden }) => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || 'NGN';

  const { payslipData } = useGetMyPayslip();

  return (
    <div className="mt-[20px]">
      <CustomTable headers={headers} center={true}>
        {payslipData?.length ? (
          payslipData?.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="text-[#1D2939] text-center text-sm"
            >
              <TableCell className="py-5">
                <div className="flex gap-6">
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>{' '}
                  {formatDate(row.date).split(' ').slice(1, 3).join(' ')}
                </div>
              </TableCell>
              <TableCell>
                {currency}
                {row.gross_income}
              </TableCell>
              <TableCell>
                {currency}
                {row.deductions}
              </TableCell>
              <TableCell>
                {currency}
                {row.net_pay}
              </TableCell>
              {!hidden && (
                <TableCell>
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                      ${
                        row.status.toLowerCase() === 'paid'
                          ? 'text-green-600  border-[#89D8A9]  bg-[#F5FFFA]'
                          : 'text-red-600   border-[#F49E9E] bg-[#FFF5F5]'
                      }
                    `}
                  >
                    {row.status.replace('_', ' ')}
                  </span>
                </TableCell>
              )}

              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/payroll/my-payroll/${row.id}`}
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                  >
                    <Image
                      src="/assets/warn.svg"
                      alt="info icon"
                      width={15}
                      height={15}
                    />
                  </Link>{' '}
                  {!hidden && (
                    <button className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded">
                      <LuArrowDownToLine />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState
            headers={headers}
            messageTitle="No Payroll Records"
            desc="Your Payroll details will appear here once they’re available."
          />
        )}
      </CustomTable>
    </div>
  );
};

export default MyPayrollTable;
