import React, { useEffect, useState } from "react";
import TableHeader from "./tableHeader";
import StatusBadge, { StatusBadgeProps } from "./statusBadge";

import { PayrollEntry } from "@/src/types/payrollEntry";
import useApiRequest from "@/src/hooks/useApiRequest";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/src/utils/helper";

interface BulkPayrollResponse {
  requires_otp?: boolean;
}

interface SalaryTableProps {
  data: PayrollEntry[];
  onApprove: (entry: PayrollEntry) => void;
  onReject: (entry: PayrollEntry) => void;
  onChangeStatus: (entry: PayrollEntry) => void;
}

const SalaryTable: React.FC<SalaryTableProps> = ({
  data,
  onApprove,
  onReject,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const { postRequest } = useApiRequest();

  const handleStatusAll = async (status: string, reason?: string) => {
    try {
      setIsLoading(true);
      await postRequest(
        "/admin/update-bulk-payroll-requests",
        {
          status,
          payroll_id: selectedRows,
          reason,
        },
        (res) => {
          if (res.success) {
            if (res.data && (res.data as BulkPayrollResponse)?.requires_otp) {
              // setIsOTPModalOpen(true);
            } else {
              setSelectedRows([]);
              setSelectAll(false);
              setRejectReason("");
              setIsConfirmModalOpen(false);
              setIsRejectModalOpen(false);
            }
          }
        }
      );
      // Clear selections after successful action
    } catch (error) {
      console.error("Error updating bulk payroll requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = (type: "approve" | "reject") => {
    setActionType(type);
    if (type === "reject") {
      setIsRejectModalOpen(true);
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmAction = () => {
    if (actionType === "approve") {
      handleStatusAll("approved");
    } else {
      handleStatusAll("rejected", rejectReason);
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const allIds = data.map((entry) => entry.id.toString());
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((idx) => idx !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Update selectAll state based on selectedRows
  useEffect(() => {
    setSelectAll(selectedRows.length === data.length && data.length > 0);
  }, [selectedRows, data.length]);

  const formatCurrency = (amount: number | string) => {
    if (typeof amount === "string") {
      amount = parseFloat(amount.replace(/,/g, ""));
    }
    return `₦${Number(amount)?.toLocaleString()}`;
  };

  return (
    <>
      {selectedRows?.length > 0 && (
        <div className="flex flex-col md:flex-row gap-2 w-full lg:items-end lg:justify-end">
          <Button
            className="bg-pry p-3 px-6 capitalize font-normal text-base"
            onClick={() => handleBulkAction("approve")}
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : `Approve all (${selectedRows?.length})`}
          </Button>
          <Button
            className="bg-transparent border-2 text-red_pry border-red_pry p-3 px-6 capitalize font-normal text-base"
            onClick={() => handleBulkAction("reject")}
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : `Reject all (${selectedRows?.length})`}
          </Button>
        </div>
      )}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-500 text-pry focus:ring-pry"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <TableHeader label="Period" />
              <TableHeader label="Employee Name" />
              <TableHeader label="Base Salary" />
              <TableHeader label="Deductions" />
              <TableHeader label="Netpay" />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-pry focus:ring-pry"
                    checked={selectedRows.includes(entry.id.toString())}
                    onChange={() => handleSelectRow(entry.id.toString())}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(entry.date).split(" ")[0]}{" "}
                  {formatDate(entry.date).split(" ")[1].replace(",", "")}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.staff_name || "N/A"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(entry.gross_income)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(entry.deductions)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(entry.net_pay)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge
                    status={
                      entry.status.toLowerCase() as StatusBadgeProps["status"]
                    }
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.status.toLowerCase() === "pending" ||
                  entry.status.toLowerCase() === "awaiting_otp" ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onApprove(entry)}
                        className="bg-[#692E9F] text-white py-2 px-3 rounded text-xs hover:bg-purple-800 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(entry)}
                        className="border border-[#970404] text-[#970404] py-2 px-3 rounded text-xs hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button className="bg-gray_3 text-white py-2 px-3 rounded text-xs hover:bg-purple-800 transition-colors">
                      {entry.status}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Approve */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Bulk Action</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve {selectedRows.length} payroll
              entries?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Reason Input */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Reject Payroll Entries
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject {selectedRows.length} payroll
              entries?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection (optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#692E9F] focus:border-[#692E9F]"
                rows={3}
                placeholder="Enter reason for rejection..."
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <ExpensesOTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        approvalStatusId={selectedRows[0] || ""}
        payload={{
          payroll_id: selectedRows,
        }}
        url={`/admin/verify-bulk-payroll-otp`}
        callback={() => {
          setSelectedRows([]);
          setSelectAll(false);
          setRejectReason("");
          setIsConfirmModalOpen(false);
          setIsRejectModalOpen(false);
          queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEYS.GET_ALL_APPROVALS,
              "pending-approval-salary-requests",
            ],
          });
        }}
      /> */}
    </>
  );
};

export default SalaryTable;
