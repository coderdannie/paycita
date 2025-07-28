'use client';

import ApiPagination from '@/src/components/common/General/TanTable/apiPagination';
import ActionModal from '@/src/components/data/Approval/salary/actionModal';
import { FilterValues } from '@/src/components/data/Approval/salary/filter';
import SalaryTable from '@/src/components/data/Approval/salary/salaryTable';
import { useUpdateApproval } from '@/src/hooks/approvals/useApprovals';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { PayrollEntry } from '@/src/types/payrollEntry';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface SalaryTabContentProps {
  //   isFilterOpen: boolean;
  //   setIsFilterOpen: (isOpen: boolean) => void;
  salaryData?: PayrollEntry[];
  searchTerm?: string;
}

const SalaryTabContent: React.FC<SalaryTabContentProps> = ({
  //   isFilterOpen,
  //   setIsFilterOpen,
  salaryData,
  searchTerm: externalSearchTerm = '',
}) => {
  const queryClient = useQueryClient();
  const { mutate: mutateUpdateApprovalStatus, isPending: isUpdatePending } =
    useUpdateApproval('update-payroll-requests');

  // State for modals
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  //   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  //   const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  // Selected entry for actions
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);

  const [payrollData, setPayrollData] = useState<PayrollEntry[]>(
    salaryData || []
  );

  const ITEMS_PER_PAGE = 10;
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (salaryData) {
      setPayrollData(salaryData);
      setCurrentPage(1);
    }
  }, [salaryData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [externalSearchTerm]);
  const filteredAndSearchedData = useMemo(() => {
    let processedData = payrollData || [];

    if (externalSearchTerm.trim() !== '') {
      const lowerSearchTerm = externalSearchTerm.toLowerCase();

      processedData = processedData.filter((entry) => {
        const nameMatch = entry.staff_name
          ?.toLowerCase()
          .includes(lowerSearchTerm);

        const idMatch = entry.id?.toString().includes(externalSearchTerm);

        return nameMatch || idMatch;
      });
    }
    if (activeFilters) {
      if (activeFilters.status && activeFilters.status !== 'All') {
        processedData = processedData.filter(
          (entry) => entry.status === activeFilters.status
        );
      }

      if (activeFilters.period && activeFilters.period !== '') {
        processedData = processedData.filter((entry) => {
          // Convert the entry date to match the period format (e.g., "Feb, 2025")
          const entryDate = new Date(entry.date);
          const entryMonth = entryDate.toLocaleDateString('en-US', {
            month: 'short',
          });
          const entryYear = entryDate.getFullYear();
          const entryPeriod = `${entryMonth}, ${entryYear}`;
          return entryPeriod === activeFilters.period;
        });
      }
    }
    return processedData;
  }, [payrollData, externalSearchTerm, activeFilters]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSearchedData.length / ITEMS_PER_PAGE);
  }, [filteredAndSearchedData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSearchedData.slice(startIndex, endIndex);
  }, [filteredAndSearchedData, currentPage]);

  const handleApproveClick = (entry: PayrollEntry) => {
    setSelectedEntry(entry);
    setIsApproveModalOpen(true);
  };

  const handleRejectClick = (entry: PayrollEntry) => {
    setSelectedEntry(entry);
    setIsRejectModalOpen(true);
  };

  const handleChangeStatusClick = (entry: PayrollEntry) => {
    setSelectedEntry(entry);
    // setIsStatusModalOpen(true);
  };

  const handleApproveConfirm = () => {
    if (selectedEntry) {
      const payload = {
        id: selectedEntry.id.toString() as string,
        data: {
          status: 'approved' as const,
        },
      };

      mutateUpdateApprovalStatus(payload, {
        onSuccess: (res) => {
          toast.success(res.data.message || 'Entry approved successfully');
          if (res.data.data.requires_otp) {
            // setIsOTPModalOpen(true);
          }
          queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEYS.GET_ALL_APPROVALS,
              'pending-approval-salary-requests',
            ],
          });
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const errorMessage =
              error.response?.data?.message || 'Failed to update approval';
            toast.error(errorMessage);
          }
        },
      });
    }
    setIsApproveModalOpen(false);
  };

  const handleRejectConfirm = (comment?: string) => {
    if (selectedEntry) {
      const payload = {
        id: selectedEntry.id.toString() as string,
        data: {
          status: 'rejected' as const,
          ...(comment && { reason: comment }),
        },
      };

      mutateUpdateApprovalStatus(payload, {
        onSuccess: (res) => {
          toast.success(res.data.message || 'Entry rejected successfully');
          queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEYS.GET_ALL_APPROVALS,
              'pending-approval-salary-requests',
            ],
          });
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const errorMessage =
              error.response?.data?.message || 'Failed to reject entry';
            toast.error(errorMessage);
          }
        },
      });
    }
    setIsRejectModalOpen(false);
  };

  //   const handleApplyFilter = (filters: FilterValues) => {
  //     setActiveFilters(filters);
  //     setCurrentPage(1);
  //   };

  return (
    <div>
      {paginatedData.length > 0 ? (
        <>
          <SalaryTable
            data={paginatedData}
            onApprove={handleApproveClick}
            onReject={handleRejectClick}
            onChangeStatus={handleChangeStatusClick}
          />

          <div className="mt-6">
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
      ) : (
        <div className="text-center py-12">
          <div className="flex flex-col items-center">
            <svg
              className="h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.9-6.174-2.374L5 12h.01M19 12l-.826.626A7.962 7.962 0 0112 15c-2.34 0-4.5-.9-6.174-2.374L5 12h.01"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>{' '}
            <p className="text-gray-500 mb-4">
              {externalSearchTerm || activeFilters
                ? `No payroll entries match your ${
                    externalSearchTerm ? 'search' : 'filter'
                  } criteria.`
                : 'No payroll entries available.'}
            </p>
            {(externalSearchTerm || activeFilters) && (
              <button
                onClick={() => {
                  setActiveFilters(null);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}
      <ActionModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleApproveConfirm}
        actionType="approve"
        loading={isUpdatePending}
      />
      <ActionModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        actionType="reject"
        loading={isUpdatePending}
      />

      {/* <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleApplyFilter}
      /> */}
      {/* <ExpensesOTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        approvalStatusId={selectedEntry?.id || ""}
        url={`/user/verify-payroll-otp/${selectedEntry?.id}`}
        callback={() => {
          setIsOTPModalOpen(false);
          setSelectedEntry(null);
          queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEYS.GET_ALL_APPROVALS,
              "pending-approval-salary-requests",
            ],
          });
        }}
      /> */}
    </div>
  );
};

export default SalaryTabContent;
