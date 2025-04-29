import CustomTable from "@/src/components/common/CustomTable";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import { TableCell, TableRow } from "@/src/components/ui/table";
import { useGetPayRollTax } from "@/src/hooks/payroll/usePayroll";
import { useMemo } from "react";

const Tax = () => {
  const headers = useMemo(
    () => [{ label: "Period" }, { label: "Total PAYE" }, { label: "Date" }],
    []
  );

  const { payrollTaxData, isLoading } = useGetPayRollTax();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CustomTable headers={headers}>
        {payrollTaxData?.length ? (
          payrollTaxData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-[#1D2939] text-sm">
              <TableCell className="py-5">
                <div className="flex gap-6">
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>
                  {row.month_year}
                </div>
              </TableCell>
              <TableCell>{row.total_paye}</TableCell>
              <TableCell>{row.transaction_date}</TableCell>
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
