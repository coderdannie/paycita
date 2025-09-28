"use client";
import { useCallback, useState } from "react";
import NoTransaction from "@/src/components/data/BillPayment/NoTransaction";
import TopUpModal from "@/src/components/modals/TopUpModal";
import SearchInput from "@/src/components/ui/SearchInput";
import { PiSlidersHorizontal } from "react-icons/pi";
import TransactionsTable from "@/src/components/data/BillPayment/TransactionHistory";
import BillsFilter from "@/src/components/modals/BillsFilter";
import { useGetTransactionHistory } from "@/src/hooks/bill-payment/useBillPayments";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import { useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

const BillPayment = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const currentPage = searchParams.get("page") || "1";
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShow, setIsShow] = useState(false);

  const { transactionHistory, pagination, isLoading } =
    useGetTransactionHistory({
      page: currentPage.toString(),
    });

  const data = transactionHistory.length ? transactionHistory : [];

  const handleBuyNow = () => {
    setIsOpen(true);
  };

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
  return (
    <>
      {data.length ? (
        <div>
          <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
            Transaction History
          </h2>
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <div className="mt-10 flex items-center gap-4 ">
              <div className="h-[40px] max-w-[338px] w-full">
                <SearchInput
                  placeholder="Search"
                  value={searchTerm}
                  setValue={setSearchTerm}
                />
              </div>
              <button
                className="flex h-[40px] px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
                onClick={() => setIsShow(true)}
              >
                <span>Filter</span> <PiSlidersHorizontal size={24} />
              </button>
            </div>
            <button
              className="bg-primary text-white py-[10px] px-4 rounded-md"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
          <TransactionsTable tableData={data} isLoading={isLoading} />{" "}
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
      ) : (
        <NoTransaction setIsOpen={handleBuyNow} />
      )}
      <BillsFilter isOpen={isShow} onClose={() => setIsShow(false)} />

      <TopUpModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
export default BillPayment;
