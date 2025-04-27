"use client";

import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import TableLayer from "@/src/components/data/Reimbursement/TableLayer";
import AddReimbursementDrawer from "@/src/components/modals/AddReimbursementDrawer";
import { Button } from "@/src/components/ui/button";
import SearchInput from "@/src/components/ui/SearchInput";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import debounce from "lodash/debounce";
import { useGetAllReimbursements } from "@/src/hooks/re-imbursement/useReImbursement";
import CustomPagination from "@/src/components/common/pagination/Pagination";

const ReimbursementPage = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const currentPage = searchParams.get("page") || "1";
  const currentSearch = searchParams.get("search") || "";

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
    const filters: { page: string; title: string } = {
      page: currentPage,
      title: "",
    };
    if (currentSearch) filters.title = currentSearch;

    return filters;
  }, [currentPage, currentSearch]);

  const { reimbursements, isLoading, isError, isFetching, pagination } =
    useGetAllReimbursements(queryFilters);

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() });
    },
    [updateSearchParams]
  );

  return (
    <div>
      <div>
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Reimbursement
        </h2>
        <div className="flex mt-10 justify-between items-center gap-2 flex-wrap">
          <div className="h-[40px] max-w-[338px] w-full">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              setValue={setSearchTerm}
            />
          </div>
          <Button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2"
          >
            <FaPlus /> <span> Add Reimbursement</span>
          </Button>
        </div>
      </div>
      <AddReimbursementDrawer
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
      {isLoading && (
        <p className="mt-4 text-center">Loading expense approvals...</p>
      )}
      {isFetching && !isLoading && (
        <p className="mt-4 text-center">Updating...</p>
      )}
      {isError && (
        <p className="mt-4 text-center text-red-600">
          Error fetching expense approvals.
        </p>
      )}
      {!isLoading && !isError && <TableLayer reimbursements={reimbursements} />}

      {!isLoading && !isError && pagination?.total_pages > 1 && (
        <CustomPagination
          totalPages={pagination.total_pages}
          currentPage={+currentPage}
          goToPage={goToPage}
        />
      )}
    </div>
  );
};
export default ReimbursementPage;
