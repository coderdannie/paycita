'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TableLayer from '@/src/components/data/QueryMgt/TableLayer';
import CreateQueryModal from '@/src/components/modals/CreateQueryModal';
import QueryDetailsDrawer from '@/src/components/modals/QueryDetailsDrawer';
import { DeleteModal } from '@/src/components/modals/DeleteLoanPolicy';
import {
  useAddComment,
  useAddQuery,
  useDeleteQuery,
  useGetQueryDetails,
} from '@/src/hooks/query-mgt/useQueryMgt';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { EmployeeQuery } from '@/src/types/queryMgt';
import toast from 'react-hot-toast';

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [queryId, setQueryId] = useState('');

  const queryClient = useQueryClient();

  const { mutate, isPending } = useAddQuery();
  const { mutate: mutateComment, isPending: isAdding } = useAddComment();
  const { queryDetails } = useGetQueryDetails(selectedQuery);

  const handleViewQuery = (queryData: string) => {
    setSelectedQuery(queryData);
    setIsDrawerOpen(true);
  };

  console.log('queryDetails', queryDetails);

  const { mutateDeleteQuery, isPending: isDeleting } = useDeleteQuery();

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = (index: string): void => {
    setIsDeleteModalOpen(true);
    setQueryId(index);
  };

  const handleDelete = () => {
    if (queryId) {
      mutateDeleteQuery(queryId, {
        onSuccess: () => {
          toast.success('Query deleted successfully');
          setIsDeleteModalOpen(false);
          handleCancel();
        },
        onError: () => {
          toast.error('Failed to delete query');
        },
      });
    }
  };

  const handleSendComment = async (comment: string) => {
    const payload = {
      query_id: selectedQuery,
      message: comment,
    };
    mutateComment(payload, {
      onSuccess: (res) => {
        toast.success(res.data.message || 'Query Added Successfully');
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_QUERY_DETAILS],
          exact: false,
        });
        setIsModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleCreateQuery = async (queryData: EmployeeQuery) => {
    mutate(queryData, {
      onSuccess: (res) => {
        toast.success(res.data.message || 'Query Added Successfully');
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ALL_QUERY],
          exact: false,
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Query Management
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>Create Query</Button>
      </div>

      <p className="font-medium text-lg text-[#1D2939] py-6">All Queries</p>

      <TableLayer
        onViewQuery={handleViewQuery}
        handleOpenDeleteModal={handleOpenDeleteModal}
      />

      <CreateQueryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateQuery}
        isPending={isPending}
      />

      <QueryDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        queryData={queryDetails}
        onSendComment={handleSendComment}
        isPendingSendComment={isAdding}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Query ?"
        description="This action is permanent and cannot be undone. Are you really want to delete this query?"
        onCancel={handleCancel}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Page;
