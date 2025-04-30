'use client';

import { useCallback, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import ProcurementTable, {
  ProcurementData,
} from '@/src/components/data/Procurement/ProcurementTable';
import AddProcurement from '@/src/components/modals/AddProcurementDrawer';
import ProcurementDetailDrawer from '@/src/components/modals/ProcurementDetailsDrawer';
import { useSearchParams } from 'next/navigation';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import {
  useDeleteProcurement,
  useGetAllProcurements,
  useGetSingleProcurement,
} from '@/src/hooks/procurement/useProcurement';
import CustomPagination from '@/src/components/common/pagination/Pagination';
import LoadingOverlay from '@/src/components/common/LoadingOverlay';
import ConfirmationModal from '@/src/components/common/ConfirmationModal';
import toast from 'react-hot-toast';
import CommentModal from '@/src/components/modals/CommentModal';
import { useAddApprovalComment } from '@/src/hooks/approvals/useApprovals';
import { useQueryClient } from '@tanstack/react-query';
import { Comments } from '@/src/types/procurement';
import { AxiosError } from 'axios';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';

const Procurement = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [procurementId, setProcurementId] = useState('');
  const [procurementToDelete, setProcurementToDelete] =
    useState<ProcurementData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const currentPage = searchParams.get('page') || '1';

  const {
    procurements,
    pagination,
    isLoading: isPending,
  } = useGetAllProcurements({
    page: currentPage.toString(),
  });

  const { procurement, isFetching: isLoadingSingle } =
    useGetSingleProcurement(procurementId);

  const currentComments: Comments[] =
    procurement?.comment_thread?.comments || [];
  const currentThreadId = procurement?.comment_thread?.thread_id;

  const { mutate: mutateAddComment, isPending: isAddingComment } =
    useAddApprovalComment('add-procurement-comment');

  const handleSend = (message: string) => {
    if (!currentThreadId) {
      toast.error('Cannot add comment: Thread ID is missing.');
      return;
    }
    if (!procurementId) {
      toast.error('Cannot add comment: Procurement ID is missing.');
      return;
    }

    const payload = {
      thread_id: currentThreadId,
      comment: message,
    };

    mutateAddComment(payload, {
      onSuccess: () => {
        toast.success('Comment added successfully');
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_SINGLE_PROCUREMENT, procurementId],
        });
        setOpenModal(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError)
          toast.error(
            error?.response?.data?.message || 'Failed to add comment'
          );
        else toast.error('An unexpected error occurred while adding comment.');
      },
    });
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

  const { mutate: deleteProcurement, isPending: isDeleting } =
    useDeleteProcurement();

  const handleDelete = useCallback((procurement: ProcurementData) => {
    setProcurementToDelete(procurement);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteProcurement = () => {
    if (!procurementToDelete?.id) return;
    deleteProcurement(procurementToDelete.id, {
      onSuccess: () => {
        toast.success('Procurement deleted successfully');
        setIsDeleteModalOpen(false);
        setProcurementToDelete(null);
        queryClient.invalidateQueries({ queryKey: ['procurements'] });
      },
      onError: (error) => {
        if (error instanceof AxiosError)
          toast.error(
            error?.response?.data?.message || 'Failed to delete procurement'
          );
        else toast.error(error?.message || 'Failed to delete procurement');
      },
    });
  };

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setIsOpen(true);
  }, []);

  const handleOpenCommentModal = (id: string) => {
    setProcurementId(id);
    setOpenModal(true);
    setIsShow(false);
  };

  const handleCloseCommentModal = () => {
    setOpenModal(false);
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
        handleEdit={handleEdit}
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
      <AddProcurement
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        procurement={procurement}
        isEditing={isEditing}
      />
      <ProcurementDetailDrawer
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        procurement={procurement}
        setOpenComment={() => handleOpenCommentModal(procurementId)}
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
      <CommentModal
        isOpen={openModal}
        onClose={handleCloseCommentModal}
        comments={currentComments}
        onSend={handleSend}
        isLoading={isAddingComment}
      />
    </>
  );
};
export default Procurement;
