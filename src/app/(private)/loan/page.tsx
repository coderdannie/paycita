"use client";

import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useGetAllLoan } from "@/src/hooks/loan/useLoan";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import TableLayer from "@/src/components/data/Loan/TableLayer";
import { Button } from "@/src/components/ui/button";
import SearchInput from "@/src/components/ui/SearchInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const Loan = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const currentPage = searchParams.get("page") || "1";
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const {
    loans,
    pagination,
    isLoading: isPending,
  } = useGetAllLoan({
    page: currentPage.toString(),
  });

  console.log(loans);

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams(
        { page: page.toString() },
        {
          scroll: true,
        }
      );
    },
    [updateSearchParams]
  );

  if (isPending) {
    return <LoadingOverlay />;
  }
  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">Loan</h2>
      <div className="flex items-center mt-9 justify-between space-x-2">
        <div className="relative flex-grow max-w-xs h-[40px]">
          <SearchInput
            placeholder="Search"
            value={searchTerm}
            setValue={setSearchTerm}
          />
        </div>
        <Button onClick={() => router.push("/loan/request")}>
          Create Loan
        </Button>
      </div>
      <TableLayer loans={loans} />{" "}
      <div className="mt-6">
        {pagination?.total_pages > 1 && (
          <CustomPagination
            totalPages={pagination?.total_pages}
            currentPage={+currentPage}
            goToPage={goToPage}
          />
        )}
      </div>
    </div>
  );
};
export default Loan;
