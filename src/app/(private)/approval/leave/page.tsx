"use client";

import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import LeaveTable from "@/src/components/data/Approval/LeaveTable";
import ApprovalFilter from "@/src/components/modals/ApprovalFilter";
import SearchInput from "@/src/components/ui/SearchInput";
import { useGetAllApprovals } from "@/src/hooks/approvals/useApprovals";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PiSlidersHorizontal } from "react-icons/pi";
import debounce from "lodash/debounce";

const LeavePage = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const currentPage = searchParams.get("page") || "1";
  const currentSearch = searchParams.get("search") || "";
  const currentStartDate = searchParams.get("start_date") || "";
  const currentEndDate = searchParams.get("end_date") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentExpenseType = searchParams.get("expense_type") || "";

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
  }, [currentSearch]);

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
    useGetAllApprovals("pending-leave-requests", queryFilters);

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
    console.log("Resetting filters...");

    setSearchTerm("");
    updateSearchParams({
      search: undefined,
      start_date: undefined,
      end_date: undefined,
      status: undefined,
      expense_type: undefined,
      page: "1",
    });
    // Optionally close the modal if the reset button is inside it
    // setIsFilterModalOpen(false);
  }, [updateSearchParams]);

  return (
    <div>
      <div>
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Approval - Leave
        </h2>
        <div className="flex mt-10 justify-between items-center gap-2 flex-wrap">
          <div className="h-[40px] max-w-[338px] w-full">
            <SearchInput
              placeholder="Search for relevant details"
              value={searchTerm}
              setValue={setSearchTerm} // This will trigger a refetch due to change in queryKey
            />
          </div>
          <button
            className="flex h-[40px] px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <span>Filter</span> <PiSlidersHorizontal size={24} />
          </button>
        </div>
        {/* Handle Loading and Error States */}
        {isLoading && (
          <p className="mt-4 text-center">Loading leave approvals...</p>
        )}
        {isFetching && !isLoading && (
          <p className="mt-4 text-center">Updating...</p>
        )}{" "}
      
        {isError && (
          <p className="mt-4 text-center text-red-600">
            Error fetching leave approvals.
          </p>
        )}
        {!isLoading && !isError && <LeaveTable approvals={approvals} />}
        {!isLoading && !isError && pagination?.total_pages > 1 && (
          <CustomPagination
            totalPages={pagination.total_pages}
            currentPage={+currentPage}
            goToPage={goToPage}
          />
        )}
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
export default LeavePage;
