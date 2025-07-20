"use client";

import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import ApprovalFilter from "@/src/components/modals/ApprovalFilter";
import SearchInput from "@/src/components/ui/SearchInput";
import {
  useGetAllApprovals,
  useUpdateApproval,
} from "@/src/hooks/approvals/useApprovals";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
 
import debounce from "lodash/debounce";
import TanTable from "@/src/components/common/General/TanTable";
import { PendingLoan } from "@/src/types/loan";
import { Asset } from "@/src/types/assets-management";
import { formatDate } from "@/src/utils/helper";
import { useAuthSelector } from "@/src/Redux/selectors";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Spinner } from "react-activity";
import RejectModal from "@/src/components/modals/RejectModal";

const LoanApproval = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthSelector();

  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const currentPage = searchParams.get("page") || "1";
  const currentSearch = searchParams.get("search") || "";
  const currentStartDate = searchParams.get("start_date") || "";
  const currentEndDate = searchParams.get("end_date") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentExpenseType = searchParams.get("expense_type") || "";

  const [approvalId, setApprovalId] = useState("");
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const debouncedUpdateSearch = useMemo(() => {
    return debounce((newSearchTerm: string) => {
      if (newSearchTerm !== (searchParams.get("search") || "")) {
        updateSearchParams({ search: newSearchTerm, page: "1" });
      }
    }, 300);
  }, [updateSearchParams, searchParams]);

  useEffect(() => {
    debouncedUpdateSearch(searchTerm);
    return () => {
      debouncedUpdateSearch.cancel();
    };
  }, [searchTerm, debouncedUpdateSearch]);

  useEffect(() => {
    if (currentSearch !== searchTerm) {
      setSearchTerm(currentSearch);
    }
  }, [currentSearch, searchTerm]);

  const queryFilters = useMemo(() => {
    const filters: Record<string, string> = { page: currentPage };
    if (currentSearch) filters.search = currentSearch;
    if (currentStartDate) filters.start_date = currentStartDate;
    if (currentEndDate) filters.end_date = currentEndDate;
    if (currentStatus) filters.status = currentStatus;
    if (currentExpenseType) filters.expense_type = currentExpenseType;
    return filters;
  }, [
    currentPage,
    currentSearch,
    currentStartDate,
    currentEndDate,
    currentStatus,
    currentExpenseType,
  ]);

  const { approvals, isLoading, isError, isFetching, pagination } =
    useGetAllApprovals("pending-loan-requests", queryFilters);

  const handleApplyFilters = useCallback(
    (appliedFilters: Record<string, string>) => {
      const cleanFilters: Record<string, string> = {};
      for (const key in appliedFilters) {
        if (appliedFilters[key]) {
          cleanFilters[key] = appliedFilters[key];
        }
      }
      updateSearchParams({ ...cleanFilters, page: "1" });
      setIsFilterModalOpen(false);
    },
    [updateSearchParams]
  );

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() });
    },
    [updateSearchParams]
  );

  const currentModalFilters = useMemo(
    () => ({
      start_date: currentStartDate,
      end_date: currentEndDate,
      status: currentStatus,
      expense_type: currentExpenseType,
    }),
    [currentStartDate, currentEndDate, currentStatus, currentExpenseType]
  );

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    updateSearchParams({
      search: undefined,
      start_date: undefined,
      end_date: undefined,
      status: undefined,
      expense_type: undefined,
      page: "1",
    });
  }, [updateSearchParams]);

  const { mutate: mutateUpdateApprovalStatus, isPending: isUpdatePending } =
    useUpdateApproval("update-loan-requests");

  const handleApprove = useCallback(
    (approvalId: string) => {
      const payload = {
        id: approvalId,
        data: {
          status: "approved",
        },
      };
      mutateUpdateApprovalStatus(payload, {
        onSuccess: () => {
          toast.success("Status updated successfully");
          queryClient.refetchQueries({
            queryKey: [QUERY_KEYS.GET_ALL_APPROVALS, "pending-loan-requests"],
          });
          // setIsOpen("");
          setApprovalId("");
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(
              error?.response?.data?.message || "Something went wrong"
            );
          }
        },
      });
    },
    [mutateUpdateApprovalStatus, queryClient]
  );

  const renderActionButtons = useCallback(
    (item: { status: string; approval_status_id: string }) => {
      switch (item.status.toLowerCase()) {
        case "pending":
          return (
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(item.approval_status_id)}
                disabled={isUpdatePending}
              >
                {isUpdatePending && <Spinner />} Approve
              </Button>
              <button
                className="border border-red-400 text-red-500 px-4 py-1 rounded-md"
                onClick={() => {
                  setIsRejectOpen(true);
                  setApprovalId(item.approval_status_id);
                }}
              >
                Reject
              </button>
            </div>
          );

        default:
          return null;
      }
    },
    [handleApprove, isUpdatePending]
  );

  const handleReject = (comment: string) => {
    const payload = {
      id: approvalId,
      data: {
        status: "rejected",
        reason: comment,
      },
    };
    mutateUpdateApprovalStatus(payload, {
      onSuccess: () => {
        toast.success("Status updated successfully");
        queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS, "pending-loan-requests"],
        });
        setIsRejectOpen(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      },
    });
  };

  const columns = [
    {
      header: "Employee Name",
      accessorKey: "employee_name",
    },
    {
      header: "Amount Requested",
      accessorKey: "amount",
      cell: ({ row }: { row: { original: Asset } }) =>
        `${user?.currency}${(row.original as unknown as PendingLoan).amount}`,
    },
    {
      header: "Payment Period",
      accessorKey: "payment_period",
      cell: ({ row }: { row: { original: Asset } }) =>
        `${(row.original as unknown as PendingLoan).payment_period}`,
    },
    {
      header: "Purpose of Loan",
      accessorKey: "purpose_of_loan",
    },
    {
      header: "Date Requested",
      accessorKey: "date",
      cell: ({ row }: { row: { original: Asset } }) =>
        formatDate((row.original as unknown as PendingLoan).date),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: Asset } }) => {
        const status = (row.original as unknown as PendingLoan).status;
        const statusClasses = {
          pending: "bg-[#FFF7E4] text-[#FFA80A]",
          approved: "bg-[#EDFCED] text-[#008000]",
          rejected: "bg-[#FFF0F0] text-[#FF4B4B]",
        };
        return (
          <span
            className={`px-2 sm:px-3 py-2 inline-flex text-xs lg:text-xs leading-5 font-medium rounded capitalize ${
              statusClasses[status as keyof typeof statusClasses]
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: ({ row }: { row: { original: Asset } }) => {
        const loan = row.original as unknown as PendingLoan;
        return renderActionButtons({
          status: loan.status,
          approval_status_id: loan.approval_status_id.toString(),
        });
      },
    },
  ];

  return (
    <div>
      <div>
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Approval - loan
        </h2>
        <div className="flex mt-10 justify-between items-center gap-2 flex-wrap">
          <div className="h-[40px] max-w-[338px] w-full">
            <SearchInput
              placeholder="Search for relevant details"
              value={searchTerm}
              setValue={setSearchTerm} // This will trigger a refetch due to change in queryKey
            />
          </div>
          {/* <button
            className="flex h-[40px] px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <span>Filter</span> <PiSlidersHorizontal size={24} />
          </button> */}
        </div>
        {/* Handle Loading and Error States */}
        {isLoading && (
          <p className="mt-4 text-center">Loading loan approvals...</p>
        )}
        {isFetching && !isLoading && (
          <p className="mt-4 text-center">Updating...</p>
        )}{" "}
        {isError && (
          <p className="mt-4 text-center text-red-600">
            Error fetching loan approvals.
          </p>
        )}
        {!isLoading && !isError && (
          <TanTable
            columnData={columns}
            data={(approvals || []) as unknown as Asset[]}
            showSearch
            className="w-full"
            loadingState={isFetching}
          />
        )}
        {!isLoading && !isError && pagination?.total_pages > 1 && (
          <CustomPagination
            totalPages={pagination.total_pages}
            currentPage={+currentPage}
            goToPage={goToPage}
          />
        )}
        <RejectModal
          isOpen={isRejectOpen}
          onClose={() => setIsRejectOpen(false)}
          onReject={handleReject}
          isLoading={isUpdatePending}
        />
        <ApprovalFilter
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={currentModalFilters}
          handleResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
};
export default LoanApproval;
