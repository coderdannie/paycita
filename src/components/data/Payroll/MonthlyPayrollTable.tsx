'use client';

import { useAuthSelector } from '@/src/Redux/selectors';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import Image from 'next/image';
import Link from 'next/link';
import TableEmptyState from '../../common/TableEmptyState';
import {useCallback} from 'react';



const MonthlyPayrollTable = ({
  payrollByMonthData,
}: {
  payrollByMonthData: {
    id: string;
    employee_name: string;
    pension: number;
    gross_income: number;
    paye: number;
    deductions: number;
    net_pay: number;
    status: string;
  }[];
}) => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || 'NGN';

  const headers = [
    {
      label: 'Pension',
    },
    {
      label: 'Employee Name',
    },
    {
      label: 'Base Salary',
    },
    {
      label: 'PAYE',
    },
    {
      label: 'Deductions',
    },
    {
      label: 'Net Pay',
    },    {
      label: 'Status',
    },
    { label: '' },
  ];

  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px]  text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
        ${
          status?.toLowerCase() === "paid"
            ? "text-green-600 border-[#89D8A9] bg-[#F5FFFA]"
            : "text-red-600 border-[#F49E9E] bg-[#FFF5F5]"
        }`}
      >
        {status}
      </span>
    ),
    []
  );

  const formatStatus = (status: string) => {
    return status
      .replace('_', ' ')        
      .replace(/\b\w/g, c => c.toUpperCase()); 
  };
  
  
  return (
    <div className="mt-[20px]">
      <CustomTable headers={headers} center>
        {payrollByMonthData?.length ? (
          payrollByMonthData.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="text-[#1D2939] text-center text-sm"
            >
              <TableCell className="py-5">
                <div className="flex gap-6">
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>{' '}
                  {currency}
                  {row.pension}
                </div>
              </TableCell>
              <TableCell>{row.employee_name} </TableCell>
              <TableCell>
                {currency}
                {row.gross_income}
              </TableCell>
              <TableCell>
                {currency}
                {row.paye}
              </TableCell>
              <TableCell>
                {currency}
                {row.deductions}
              </TableCell>
              <TableCell>
                {currency}
                {row.net_pay}
                <div className="flex"></div>
              </TableCell>
              <TableCell>
                  {renderStatusBadge(formateStatus(row.status))}
                </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/payroll/employee-payroll/employee-details?id=${row.id}`}
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                  >
                    <Image
                      src="/assets/warn.svg"
                      alt="info icon"
                      width={15}
                      height={15}
                    />
                  </Link>{' '}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState
            headers={headers}
            messageTitle="No Payroll Records"
            desc="Payroll details will appear here once they’re available."
          />
        )}
      </CustomTable>
    </div>
  );
};

export default MonthlyPayrollTable;
