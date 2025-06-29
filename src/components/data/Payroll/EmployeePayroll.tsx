'use client';

import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';
import Link from 'next/link';
import { LuArrowDownToLine } from 'react-icons/lu';
import { useGetPayRoll } from '@/src/hooks/payroll/usePayroll';
import { useAuthSelector } from '@/src/Redux/selectors';
import { formatDate } from '@/src/utils/helper';
import TableEmptyState from '../../common/TableEmptyState';

interface Header {
  label: string;
}

interface MyPayrollTableProps {
  headers: Header[];
  hidden?: boolean;
}

const EmployeePayroll: React.FC<MyPayrollTableProps> = ({ headers }) => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || 'NGN';

  const { payrolls, isLoading } = useGetPayRoll();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mt-[20px]">
      <CustomTable headers={headers} center={true}>
        {payrolls?.length ? (
          payrolls.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="text-[#1D2939] text-center text-sm"
            >
              <TableCell className="py-5">
                <div className="flex gap-6">
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>
                  {row.month}
                </div>
              </TableCell>
              <TableCell>
                {currency}
                {row.total_gross_income}
              </TableCell>
              <TableCell> {formatDate(row.transaction_date)}</TableCell>
              <TableCell>
                {currency} {row.total_deductions}
              </TableCell>
              <TableCell>
                {currency}
                {row.total_net_pay}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/payroll/employee-payroll/${row.transaction_date}`}
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                  >
                    <Image
                      src="/assets/warn.svg"
                      alt="info icon"
                      width={15}
                      height={15}
                    />
                  </Link>{' '}
                  <button className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded">
                    <LuArrowDownToLine />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState
            headers={headers}
            messageTitle="No Payroll Records"
            desc="Employee Payroll details will appear here once they’re available."
          />
        )}
      </CustomTable>
    </div>
  );
};

export default EmployeePayroll;
