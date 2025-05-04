"use client";
import CustomTable from "@/src/components/common/CustomTable";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import { TableCell, TableRow } from "@/src/components/ui/table";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "@/src/components/ui/SearchInput";
import { useGetEmployeePensionByCompany } from "@/src/hooks/payroll/usePayroll";
import { useSearchParams } from "next/navigation";
import { useAuthSelector } from "@/src/Redux/selectors";

const monthNameToNumber: { [key: string]: number } = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};
const Pension = () => {
  const params = useSearchParams();
  const period = params.get("period") || "";

  const month = period.split(" ")[0];
  const year = period.split(" ")[1];

  const monthNumber = monthNameToNumber[month];

  const { employeePensionDataByCompany } = useGetEmployeePensionByCompany({
    month: monthNumber.toString(),
    year: year,
  });

  const userData = useAuthSelector();

  const currency = userData?.user?.currency || "NGN";

  const headers = useMemo(
    () => [
      { label: "Pension Name" },
      { label: "No of Staffs" },
      { label: "Amount Remitted " },
      { label: "" },
    ],
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div className="w-full h-[40px] sm:w-64 my-6">
        <SearchInput
          placeholder="Search employee name"
          value={searchTerm}
          setValue={setSearchTerm}
        />
      </div>
      <CustomTable headers={headers}>
        {employeePensionDataByCompany?.length ? (
          employeePensionDataByCompany.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-[#1D2939]  text-sm">
              <TableCell className="py-5">
                <div className="flex gap-6">
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>
                  {row.pension_company}
                </div>
              </TableCell>
              <TableCell>{row.number_of_staff}</TableCell>
              <TableCell>
                {currency} {row.amount}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/payroll/employee-payroll/pension/${month}?company_name=${row.pension_company}&date=${row.date}`}
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                  >
                    <Image
                      src="/assets/warn.svg"
                      alt="info icon"
                      width={15}
                      height={15}
                    />
                  </Link>
                </div>
              </TableCell>
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
export default Pension;
