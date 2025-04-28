import CustomTable from "@/src/components/common/CustomTable";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import { TableCell, TableRow } from "@/src/components/ui/table";
import { useGetMyTax } from "@/src/hooks/payroll/usePayroll";
import { useAuthSelector } from "@/src/Redux/selectors";
import { formatDate } from "@/src/utils/helper";
import { useCallback, useMemo } from "react";

const Tax = () => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || "NGN";
  
  const headers = useMemo(
    () => [
      { label: "Name" },
      { label: "Date" },
      { label: "Amount" },
      { label: "Status" },
    ],
    []
  );

  const { taxData } = useGetMyTax();

  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px] w-[50%] text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
      ${
        status.toLowerCase() === "paid"
          ? "text-green-600 border-[#89D8A9] bg-[#F5FFFA]"
          : "text-red-600 border-[#F49E9E] bg-[#FFF5F5]"
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
        {taxData?.length ? (
          taxData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-[#1D2939] text-sm">
              <TableCell className="py-5">
                <div className="flex gap-6">{row.name}</div>
              </TableCell>
              <TableCell>{formatDate(row.date)}</TableCell>
              <TableCell>
                {currency}
                {row.amount}
              </TableCell>
              <TableCell>
                {renderStatusBadge(row.status.replace("_", " "))}
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
export default Tax;
