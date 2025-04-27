"use client";

import { useCallback, useMemo, useState } from "react";
import CustomTable from "../../common/CustomTable";
import { TableCell, TableRow } from "../../ui/table";
import TableEmptyState from "../../common/TableEmptyState";
import { Button } from "@/components/ui/button";
import ReimbursementDetails from "../../modals/ReimbursementDetails";
import { Reimbursement } from "@/src/service/api/re-imbursement.service";

const TableLayer = ({
  reimbursements,
}: {
  reimbursements: Reimbursement[];
}) => {
  const [isOpen, setIsOpen] = useState("");
  const headers = useMemo(
    () => [
      { label: "RN" },
      { label: "Amount" },
      { label: "Description" },
      { label: "Employee Name" },
      { label: "Date" },
      { label: "Status" },
      { label: "Action" },
    ],
    []
  );

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] w-[70%] text-center block px-[10px] rounded-md 
        ${
          status === "approved"
            ? "text-[#008000] bg-[#EDFCED]"
            : status === "pending"
            ? "text-[#5252FF] bg-[#EDEDFB]"
            : "text-red-600 bg-[#FFF5F5]"
        }`}
      >
        {status}
      </span>
    );
  }, []);

  return (
    <div className="mt-6">
      <CustomTable headers={headers}>
        {reimbursements?.length ? (
          reimbursements.map((row, index) => (
            <TableRow key={index} className="text-[#1D2939] text-sm">
              <TableCell className="text-primary">{row.rb_number}</TableCell>
              <TableCell>₦{row.amount}</TableCell>
              <TableCell>{row.description || "-"}</TableCell>
              <TableCell>{row.employee_name || "-"}</TableCell>
              <TableCell>{row.date_of_purchase}</TableCell>
              <TableCell>{renderStatusBadge(row.status)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="border-primary bg-transparent"
                  onClick={() => setIsOpen(row.id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState headers={headers} />
        )}
      </CustomTable>
      <ReimbursementDetails
        isOpen={!!isOpen}
        onClose={() => setIsOpen("")}
        id={isOpen}
      />
    </div>
  );
};

export default TableLayer;
