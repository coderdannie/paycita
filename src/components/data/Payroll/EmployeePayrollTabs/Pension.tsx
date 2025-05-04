import CustomTable from "@/src/components/common/CustomTable";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import { TableCell, TableRow } from "@/src/components/ui/table";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetEmployeePension } from "@/src/hooks/payroll/usePayroll";
import { useAuthSelector } from "@/src/Redux/selectors";

const Pension = () => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || "NGN";

  const headers = useMemo(
    () => [
      { label: "Period" },
      { label: "Amount" },
      { label: "Status" },
      { label: "" },
    ],
    []
  );

  const { employeePensionData } = useGetEmployeePension();

  return (
    <div>
      <CustomTable headers={headers}>
        {employeePensionData?.length ? (
          employeePensionData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-[#1D2939]  text-sm">
              <TableCell className="py-5">
                <div className="flex gap-6">
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>{" "}
                  {row.month_year}
                </div>
              </TableCell>
              <TableCell>
                {currency} {row.total_amount}
              </TableCell>
              <TableCell>{row.status} </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/payroll/employee-payroll/pension?period=${row.month_year}`}
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                  >
                    <Image
                      src="/assets/warn.svg"
                      alt="info icon"
                      width={15}
                      height={15}
                    />
                  </Link>{" "}
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
