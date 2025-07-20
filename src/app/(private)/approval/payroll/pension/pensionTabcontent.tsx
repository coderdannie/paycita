"use client";
import React, { useState, useEffect, useMemo } from "react";

import toast from "react-hot-toast";
import TableHeader from "@/src/components/data/Approval/salary/tableHeader";
import StatusBadge, {
  StatusBadgeProps,
} from "@/src/components/data/Approval/salary/statusBadge";
import ApiPagination from "@/src/components/common/General/TanTable/apiPagination";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import ActionModal from "@/src/components/data/Approval/salary/actionModal";
import { formatCurrency } from "@/src/utils/helper";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateApproval } from "@/src/hooks/approvals/useApprovals";
import { AxiosError } from "axios";

interface PensionData {
  month_year: string;
  total_amount: string;
  id: string;
  status: "approved" | "pending" | "rejected" | "All";
  date: string;
  actionTime: string;
}

interface PensionTabContentProps {
  //   isFilterOpen: boolean;
  //   setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialPensionData?: PensionData[];
  searchTerm?: string;
}

const PensionTabContent: React.FC<PensionTabContentProps> = ({
  //   isFilterOpen,
  //   setIsFilterOpen,
  initialPensionData = [],
  searchTerm: externalSearchTerm = "",
}) => {
  const queryClient = useQueryClient();
  const { mutate: mutateUpdateApprovalStatus, isPending: isUpdatePending } =
    useUpdateApproval("update-pension-requests");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  //   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PensionData | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const [activeFilters, setActiveFilters] = useState<PensionData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [pensionData, setPensionData] = useState<PensionData[]>(
    initialPensionData.length > 0 ? initialPensionData : []
  );

  useEffect(() => {
    if (initialPensionData && initialPensionData.length > 0) {
      setPensionData(initialPensionData);
      setCurrentPage(1);
    }
  }, [initialPensionData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [externalSearchTerm]);

  const filteredAndSearchedData = useMemo(() => {
    let processedData = pensionData || [];

    // Apply search term FIRST
    if (externalSearchTerm.trim() !== "") {
      const lowerSearchTerm = externalSearchTerm.toLowerCase();

      processedData = processedData.filter((entry) => {
        // Search by name or ID
        const nameMatch = entry.month_year
          ?.toLowerCase()
          .includes(lowerSearchTerm);
        const idMatch = entry.id?.toString().includes(externalSearchTerm);

        return nameMatch || idMatch;
      });
    }

    // Apply filters AFTER search
    if (activeFilters) {
      if (activeFilters.status && activeFilters.status !== "All") {
        processedData = processedData.filter(
          (entry) => entry.status === activeFilters.status
        );
      }
    }

    return processedData;
  }, [pensionData, externalSearchTerm, activeFilters]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSearchedData.length / ITEMS_PER_PAGE);
  }, [filteredAndSearchedData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSearchedData.slice(startIndex, endIndex);
  }, [filteredAndSearchedData, currentPage]);

  // Reset selected items when data changes
  useEffect(() => {
    setSelectedItems([]);
  }, [paginatedData]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    const allIds = paginatedData.map((item) => item.id);
    const allSelected =
      selectedItems.length === paginatedData.length && paginatedData.length > 0;

    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allIds);
    }
  };

  const handleOpenStatusModal = (item: PensionData) => {
    setCurrentItem(item);
    // setIsStatusModalOpen(true);
  };

  const handleOpenApproveModal = (item: PensionData) => {
    setCurrentItem(item);
    setIsApproveModalOpen(true);
  };

  const handleOpenRejectModal = (item: PensionData) => {
    setCurrentItem(item);
    setIsRejectModalOpen(true);
  };

  const handleApprove = (comment?: string) => {
    if (currentItem) {
      const payload = {
        data: {
          status: "approved" as const,
          month: currentItem.month_year.split(" ")[0],
          year: currentItem.month_year.split(" ")[1],
          ...(comment && { reason: comment }),
        },
      };

      mutateUpdateApprovalStatus(payload, {
        onSuccess: (res) => {
          toast.success(res.data.message || "Entry approved successfully");
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
      setIsApproveModalOpen(false);
      setCurrentItem(null);
    }
  };

  const handleReject = (comment?: string) => {
    if (currentItem) {
      const payload = {
        data: {
          status: "rejected" as const,
          month: currentItem.month_year.split(" ")[0],
          year: currentItem.month_year.split(" ")[1],
          ...(comment && { reason: comment }),
        },
      };

      mutateUpdateApprovalStatus(payload, {
        onSuccess: (res) => {
          toast.success(res.data.message || "Entry rejected successfully");
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
              error.response?.data?.message || "Failed to reject entry";
            toast.error(errorMessage);
          }
        },
      });
      setIsRejectModalOpen(false);
      setCurrentItem(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg">
        {/* Table Component */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {" "}
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    checked={
                      selectedItems.length === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <TableHeader label="Period" />
                {/* <TableHeader label="No of Staffs" /> */}
                <TableHeader label="Amount Remitted" />
                <TableHeader label="Status" />
                {/* <TableHeader label="Date" />
                <TableHeader label="Action Time" /> */}
                <th className="px-4 py-3 text-xs font-medium text-gray-600 tracking-wider whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>{" "}
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {externalSearchTerm.trim() !== "" ? (
                      <div>
                        <p>
                          No pension entries found matching &apos;
                          {externalSearchTerm}&apos;
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
                      "No pension entries available"
                    )}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#692E9F] focus:ring-[#692E9F]"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    {/* <td className="px-4 py-4 whitespace-nowrap">{item.name}</td> */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {item.month_year}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {formatCurrency(+item.total_amount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={
                          item.status?.toLowerCase() as StatusBadgeProps["status"]
                        }
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      {" "}
                      <div className="flex justify-end items-center space-x-2">
                        {item.status === "approved" ? (
                          <button
                            className="px-4 py-2 bg-[#692E9F]/50 text-white rounded-md hover:bg-purple-800 transition-colors"
                            disabled
                          >
                            {item.status}
                          </button>
                        ) : item.status === "pending" ? (
                          <div className="flex space-x-2">
                            <button
                              className="px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 transition-colors"
                              onClick={() => handleOpenApproveModal(item)}
                            >
                              Approve
                            </button>
                            <button
                              className="px-4 py-2 border border-[#CB0606] text-[#970404] rounded-md hover:bg-red-50 transition-colors"
                              onClick={() => handleOpenRejectModal(item)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            className="px-4 py-2 bg-[#692E9F]/50 text-white rounded-md hover:bg-purple-800 transition-colors"
                            onClick={() => handleOpenStatusModal(item)}
                            disabled
                          >
                            {item.status}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Filter Sidebar */}
        {/* {isFilterOpen && (
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApplyFilter={(filters: any) => {
              setActiveFilters(filters);
              setCurrentPage(1); // Reset to first page when filters change
              setIsFilterOpen(false);
            }}
          />
        )} */}

        {isApproveModalOpen && (
          <ActionModal
            isOpen={isApproveModalOpen}
            onClose={() => setIsApproveModalOpen(false)}
            onConfirm={handleApprove}
            actionType="approve"
            loading={isUpdatePending}
          />
        )}
        {isRejectModalOpen && (
          <ActionModal
            isOpen={isRejectModalOpen}
            onClose={() => setIsRejectModalOpen(false)}
            onConfirm={handleReject}
            actionType="reject"
            loading={isUpdatePending}
          />
        )}
      </div>{" "}
      <div className="flex justify-center p-4">
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
    </>
  );
};

export default PensionTabContent;
