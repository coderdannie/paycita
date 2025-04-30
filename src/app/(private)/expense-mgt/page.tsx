'use client';

import { useCallback, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import ExpenseMgtTable, {
  ExpenseData,
} from '@/src/components/data/ExpenseMgt/ExpenseMgtTable';
import AddExpenseDrawer from '@/src/components/modals/AddExpenseDrawer';
import ExpenseMgtDetailDrawer from '@/src/components/modals/ExpenseDetailsDrawer';
import { useSearchParams } from 'next/navigation';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import {
  useDeleteExpense,
  useGetAllExpenses,
  useGetSingleExpense,
} from '@/src/hooks/expenses/useExpenses';
import CustomPagination from '@/src/components/common/pagination/Pagination';
import LoadingOverlay from '@/src/components/common/LoadingOverlay';
import ConfirmationModal from '@/src/components/common/ConfirmationModal';
import toast from 'react-hot-toast';
import CommentModal from '@/src/components/modals/CommentModal';
import { Comments } from '@/src/types/procurement';
import { useAddApprovalComment } from '@/src/hooks/approvals/useApprovals';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const ExpenseMgt = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseData | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [expenseId, setExpenseId] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const currentPage = searchParams.get('page') || '1';

  const {
    expenses,
    pagination,
    isLoading: isPending,
  } = useGetAllExpenses({
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

  const { expense } = useGetSingleExpense(expenseId);

  const currentComments: Comments[] = expense?.comment_thread?.comments || [];
  const currentThreadId = expense?.comment_thread?.thread_id;

  const { mutate: mutateAddComment, isPending: isAddingComment } =
    useAddApprovalComment('add-expense-comment');

  const handleSend = (message: string) => {
    if (!currentThreadId) {
      toast.error('Cannot add comment: Thread ID is missing.');
      return;
    }
    if (!expenseId) {
      toast.error('Cannot add comment: Expense ID is missing.');
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
          queryKey: [QUERY_KEYS.GET_SINGLE_EXPENSE, expenseId],
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

  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();

  const handleDelete = useCallback((expense: ExpenseData) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setIsOpen(true);
  }, []);

  const handleDeleteExpense = () => {
    deleteExpense(expenseToDelete?.id, {
      onSuccess: () => {
        toast.success('Expense deleted successfully');
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
          Expense management
        </h2>
        <div className="flex justify-between flex-wrap items-center gap-6">
          <button
            className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
            onClick={() => setIsOpen(true)}
          >
            <span> Add </span>
            <AiOutlinePlus />
          </button>
        </div>
      </div>
      <ExpenseMgtTable
        tableData={expenses}
        setIsShow={setIsShow}
        setExpenseId={setExpenseId}
        handleEdit={handleEdit}
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
      <AddExpenseDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        expense={expense}
        isEditing={isEditing}
      />
      <ExpenseMgtDetailDrawer
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        expense={expense}
        setOpenComment={setOpenModal}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleDeleteExpense}
        title="Delete Expense"
        actionLabel="Delete"
        isLoading={isDeleting}
      />
      <CommentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        comments={currentComments}
        onSend={handleSend}
        isLoading={isAddingComment}
      />
    </>
  );
};
export default ExpenseMgt;
