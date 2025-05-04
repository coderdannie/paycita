"use client";

import { useState } from "react";
import CustomTable from "../../common/CustomTable";
import { TableCell, TableRow } from "../../ui/table";
import Image from "next/image";
import { formatDate } from "@/src/utils/helper";
import { useAuthSelector } from "@/src/Redux/selectors";

const PaymentHisTable = ({
  payroll,
}: {
  payroll: {
    date: string;
    deductions: string;
    gross_income: string;
    net_pay: string;
    paye: string;
    pension: string;
  }[];
}) => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || "NGN";

  const [status] = useState("Paid");
  const headers = [
    {
      label: "Period",
    },

    {
      label: "Base Salary",
    },
    {
      label: "Deductions",
    },
    {
      label: "PAYE",
    },
    {
      label: "Net Pay",
    },
    {
      label: "Status",
    },
  ];

  return (
    <div>
      <div className="mt-[20px]">
        <CustomTable headers={headers} center={true}>
          {payroll?.length ? (
            payroll.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="text-[#1D2939] text-center text-sm"
              >
                <TableCell className="py-5">
                  <div className="flex gap-6">
                    <div className="border-2 border-[#E4E7EC] w-5 aspect-square rounded bg-white"></div>
                    {formatDate(row.date)}
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
                  {row.paye}
                </TableCell>
                <TableCell>
                  {currency}
                  {row.net_pay}
                </TableCell>
                <TableCell>
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                    ${
                      status === "Paid"
                        ? "text-green-600  border-[#89D8A9]  bg-[#F5FFFA]"
                        : "text-red-600   border-[#F49E9E] bg-[#FFF5F5]"
                    }
                  `}
                  >
                    Paid
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center py-6">
                <div className="flex flex-col items-center">
                  <Image
                    src="/assets/avatar.jpeg"
                    alt="No Attendance Records"
                    className="w-20 h-20 mb-4"
                  />
                  <p className="text-lg font-semibold text-gray-700">
                    No Attendance Records
                  </p>
                  <p className="text-sm text-gray-500">
                    Clock in and out to track your attendance
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </CustomTable>
      </div>
    </div>
  );
};
export default PaymentHisTable;
