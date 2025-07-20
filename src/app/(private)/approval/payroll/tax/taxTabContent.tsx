"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect, useMemo } from "react";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import TableHeader from "@/src/components/data/Approval/salary/tableHeader";
import { formatCurrency } from "@/src/utils/helper";
import StatusBadge, {
  StatusBadgeProps,
} from "@/src/components/data/Approval/salary/statusBadge";
import ActionButton from "@/src/components/data/Approval/salary/actionButton";
import ApiPagination from "@/src/components/common/General/TanTable/apiPagination";
import ActionModal from "@/src/components/data/Approval/salary/actionModal";
import { useUpdateApproval } from "@/src/hooks/approvals/useApprovals";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface TaxEntry {
  total_amount: string;
  month_year: string;
  id: string;
  period: string;
  totalAmount: string;
  status: string;
  date: string;
  actionTime: string;
}

interface TaxTabContentProps {
  //   isFilterOpen?: boolean;
  //   setIsFilterOpen?: (isOpen: boolean) => void;
  initialTaxData?: TaxEntry[];
  searchTerm?: string;
}

const TaxTabContent: React.FC<TaxTabContentProps> = ({
  //   isFilterOpen = false,
  //   setIsFilterOpen = () => {},
  initialTaxData = [],
  searchTerm: externalSearchTerm = "",
}) => {
  const queryClient = useQueryClient();
  const { mutate: mutateUpdateApprovalStatus, isPending: isUpdatePending } =
    useUpdateApproval("update-tax-requests");

  // Sample data for the tax entries
  const [taxEntries, setTaxEntries] = useState<TaxEntry[]>(
    initialTaxData.length > 0 ? initialTaxData : []
  );

  const [selectedEntry, setSelectedEntry] = useState<TaxEntry | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  //   const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

  const ITEMS_PER_PAGE = 10;
  const [activeFilters, setActiveFilters] = useState<TaxEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (initialTaxData && initialTaxData.length > 0) {
      setTaxEntries(initialTaxData);
      setCurrentPage(1);
    }
  }, [initialTaxData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [externalSearchTerm]);

  const filteredAndSearchedData = useMemo(() => {
    let processedData = taxEntries || [];

    if (externalSearchTerm.trim() !== "") {
      const lowerSearchTerm = externalSearchTerm.toLowerCase();

      processedData = processedData.filter((entry) => {
        const periodMatch = entry.month_year
          ?.toLowerCase()
          .includes(lowerSearchTerm);
        const idMatch = entry.id?.toString().includes(externalSearchTerm);

        return periodMatch || idMatch;
      });
    }

    if (activeFilters) {
      if (activeFilters.status && activeFilters.status !== "all") {
        processedData = processedData.filter(
          (entry) => entry.status === activeFilters.status
        );
      }

      if (activeFilters.period && activeFilters.period !== "") {
        processedData = processedData.filter((entry) => {
          return entry.period === activeFilters.period;
        });
      }
    }

    return processedData;
  }, [taxEntries, externalSearchTerm, activeFilters]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSearchedData.length / ITEMS_PER_PAGE);
  }, [filteredAndSearchedData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSearchedData.slice(startIndex, endIndex);
  }, [filteredAndSearchedData, currentPage]);

  // Reset selected entries when data changes
  useEffect(() => {
    setSelectedEntries([]);
  }, [paginatedData]);

  const handleOpenActionModal = (
    entry: TaxEntry,
    type: "approve" | "reject"
  ) => {
    setSelectedEntry(entry);
    setActionType(type);
    setIsActionModalOpen(true);
  };

  const handleOpenStatusChangeModal = (entry: TaxEntry) => {
    setSelectedEntry(entry);
    // setIsStatusChangeModalOpen(true);
  };
  const handleActionConfirm = (comment?: string) => {
    if (selectedEntry) {
      const status = actionType === "approve" ? "approved" : "rejected";
      const payload = {
        data: {
          status,
          month: selectedEntry.month_year.split(" ")[0],
          year: selectedEntry.month_year.split(" ")[1],
          ...(comment && { reason: comment }),
        },
      };

      mutateUpdateApprovalStatus(payload, {
        onSuccess: (res) => {
          toast.success(res.data.message || `Entry ${status} successfully`);
          queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEYS.GET_ALL_APPROVALS,
              "pending-approval-salary-requests",
            ],
          });
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const errorMessage =
              error.response?.data?.message || "Failed to update approval";
            toast.error(errorMessage);
          }
        },
      });
      setIsActionModalOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleSelectEntry = (id: string) => {
    setSelectedEntries((prev) => {
      if (prev.includes(id)) {
        return prev.filter((entryId) => entryId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    const allIds = paginatedData.map((entry) => entry.id);
    const allSelected =
      selectedEntries.length === paginatedData.length &&
      paginatedData.length > 0;

    if (allSelected) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(allIds);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#692E9F] focus:ring-[#692E9F] border-gray-300 rounded"
                  onChange={handleSelectAll}
                  checked={
                    selectedEntries.length === paginatedData.length &&
                    paginatedData.length > 0
                  }
                />
              </th>
              <TableHeader label="Period" />
              <TableHeader label="Total Amount" />
              <TableHeader label="Status" />

              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 tracking-wider">
                Action
              </th>
            </tr>
          </thead>{" "}
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {externalSearchTerm.trim() !== "" ? (
                    <div>
                      <p>
                        No tax entries found matching &apos;{externalSearchTerm}
                        &apos;
                      </p>
                      <button
                        onClick={() => {
                          setActiveFilters(null);
                          setCurrentPage(1);
                        }}
                        className="text-[#692E9F] hover:underline mt-2"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    "No tax entries available"
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[#692E9F] focus:ring-[#692E9F] border-gray-300 rounded"
                      checked={selectedEntries.includes(entry.id)}
                      onChange={() => handleSelectEntry(entry.id)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.month_year}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(+entry.total_amount)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={
                        entry.status?.toLowerCase() as StatusBadgeProps["status"]
                      }
                    />
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {entry.status === "pending" ||
                    entry.status === "awaiting mgt approval" ? (
                      <div className="flex space-x-2 justify-end">
                        <ActionButton
                          label="Approve"
                          variant="primary"
                          onClick={() =>
                            handleOpenActionModal(entry, "approve")
                          }
                        />
                        <ActionButton
                          label="Reject"
                          variant="reject"
                          onClick={() => handleOpenActionModal(entry, "reject")}
                        />
                      </div>
                    ) : (
                      <button
                        className="text-[#692E9F]/50 hover:underline"
                        disabled={true}
                        onClick={() => handleOpenStatusChangeModal(entry)}
                      >
                        {entry.status}
                      </button>
                    )}{" "}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <ApiPagination
          pagination={{
            current_page: currentPage,
            total_pages: totalPages,
            total_records: filteredAndSearchedData.length,
            per_page: ITEMS_PER_PAGE,
          }}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onConfirm={handleActionConfirm}
        actionType={actionType}
        loading={isUpdatePending}
      />

      {/* <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleApplyFilter}
      /> */}
    </div>
  );
};

export default TaxTabContent;
