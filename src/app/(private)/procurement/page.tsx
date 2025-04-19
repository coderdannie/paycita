"use client";

import { useCallback, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ProcurementTable, { ProcurementData } from "@/src/components/data/Procurement/ProcurementTable";
import AddProcurement from "@/src/components/modals/AddProcurementDrawer";
import ProcurementDetailDrawer from "@/src/components/modals/ProcurementDetailsDrawer";
import { useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import {
  useDeleteProcurement,
  useGetAllProcurements,
  useGetSingleProcurement,
} from "@/src/hooks/procurement/useProcurement";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import ConfirmationModal from "@/src/components/common/ConfirmationModal";
import toast from "react-hot-toast"; 

const Procurement = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [procurementId, setProcurementId] = useState("");
  const [procurementToDelete, setProcurementToDelete] = useState<ProcurementData | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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


  const { procurement } = useGetSingleProcurement(procurementId);

  const { mutate: deleteProcurement, isPending: isDeleting } =
    useDeleteProcurement();

  const handleDelete = useCallback((procurement: ProcurementData) => {
    setProcurementToDelete(procurement);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteProcurement = () => {
    deleteProcurement(procurementToDelete?.id, {
      onSuccess: () => {
        toast.success("Procurement deleted successfully");
        setIsDeleteModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

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
        handleDelete={handleDelete}
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setProcurementToDelete(null);
        }}
        onConfirm={handleDeleteProcurement}
        title="Delete Procurement"
        actionLabel="Delete"
        isLoading={isDeleting}
      />
    </>
  );
};
export default Procurement;
