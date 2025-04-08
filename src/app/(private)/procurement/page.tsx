"use client";

import { useCallback, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ProcurementTable from "@/src/components/data/Procurement/ProcurementTable";
import AddProcurement from "@/src/components/modals/AddProcurementDrawer";
import ProcurementDetailDrawer from "@/src/components/modals/ProcurementDetailsDrawer";
import { useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import {
  useGetAllProcurements,
  useGetSingleProcurement,
} from "@/src/api/hooks/procurement/useProcurement";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";

const Procurement = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const currentPage = searchParams.get("page") || "1";

  const {
    procurements,
    pagination,
    isLoading: isPending,
  } = useGetAllProcurements({
    page: currentPage.toString(),
  });

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

  const [procurementId, setProcurementId] = useState("");

  const { procurement } = useGetSingleProcurement(procurementId);

  if (isPending) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Procurement
        </h2>
        <div className="flex justify-between flex-wrap items-center gap-6">
          <button
            className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
            onClick={() => setIsOpen(true)}
          >
            <AiOutlinePlus />
            <span> Add Procurement</span>
          </button>
        </div>
      </div>
      <ProcurementTable
        tableData={procurements}
        setIsShow={setIsShow}
        setProcurementId={setProcurementId}
      />
      <div className="mt-6">
        {pagination?.total_pages > 1 && (
          <CustomPagination
            totalPages={pagination?.total_pages}
            currentPage={+currentPage}
            goToPage={goToPage}
          />
        )}
      </div>
      <AddProcurement isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ProcurementDetailDrawer
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        procurement={procurement}
      />
    </>
  );
};
export default Procurement;
