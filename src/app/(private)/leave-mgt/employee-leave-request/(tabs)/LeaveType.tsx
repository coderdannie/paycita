"use client";

import React, { useCallback, useMemo, useState } from "react";
import Filters from "../Filters/filters";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import CustomTable from "@/src/components/common/CustomTable";
import { TableCell, TableRow } from "@/src/components/ui/table";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import { Button } from "@/src/components/ui/button";
import { AddLeaveTypeDialog } from "../../../../../components/modals/AddLeaveType";
import SearchInput from "@/src/components/ui/SearchInput";
import {
  useDeleteLeaveType,
  useGetAllLeaveTypes,
  useUpdateLeaveType,
  useAddLeaveType,
} from "@/src/hooks/leave/useLeave";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DeleteModal } from "@/src/components/modals/DeleteLoanPolicy";

const headers = [
  {
    label: "Leave Type",
  },
  { label: "" },
  {
    label: "Actions",
  },
];

const LeaveType = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const search = searchParams.get("search") || "";
  const currentPage = searchParams.get("page") || "1";
  const [searchTerm, setSearchTerm] = useState<string>(search);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [leaveTypeName, setLeaveTypeName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState(null);

  const filters = useMemo(
    () => ({
      page: currentPage,
      leave_type: searchTerm,
    }),
    [currentPage, searchTerm]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateSearchParams(
        {
          ...filters,
          employee_name: value,
          page: "1",
        },
        { debounce: 300 }
      );
    },
    [filters, updateSearchParams]
  );

  const { leaveTypes, isPending } = useGetAllLeaveTypes({
    page: currentPage.toString(),
    leave_type: search,
  });

  const { mutate, isPending: isUpdating } = useUpdateLeaveType();
  const { mutateAddLeaveType, isPending: isAdding } = useAddLeaveType({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_LEAVE_TYPES],
      });
      toast.success("Leave Type added successfully");
      handleCloseDialog();
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: mutateDeleteLeaveType, isPending: isDeleting } =
    useDeleteLeaveType();

  const handleSaveLeaveType = () => {
    if (isEdit) {
      console.log("Updating leave type:", editingId, leaveTypeName);
      mutate(
        {
          id: editingId,
          leave_name: leaveTypeName,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.GET_ALL_LEAVE_TYPES],
            });
            toast.success("Leave type updated successfully");
            handleCloseDialog();
          },
        }
      );
    } else {
      mutateAddLeaveType({
        leave_name: leaveTypeName,
      });
    }
  };

  const handleCloseDialog = () => {
    setLeaveTypeName("");
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditingId(null);
  };

  const handleAddNew = () => {
    setIsEdit(false);
    setEditingId(null);
    setLeaveTypeName("");
    setIsDialogOpen(true);
  };

  const handleEdit = (id: string, name: string) => {
    setIsEdit(true);
    setEditingId(id);
    setLeaveTypeName(name);
    setIsDialogOpen(true);
  };

  const handleDelete = (benefit: any) => {
    setLeaveToDelete(benefit);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setLeaveToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!leaveToDelete) return;
    mutateDeleteLeaveType(
      {
        id: leaveToDelete.id,
        leave_name: leaveToDelete.name,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_LEAVE_TYPES],
          });
          toast.success("Leave Type updated successfully");
          setIsDeleteModalOpen(false);
          setLeaveToDelete(null);
        },
        onError: (error: {
          response: {
            data: {
              message: string;
            };
          };
        }) => {
          toast.error(
            error.response?.data?.message || "Failed to delete leave type"
          );
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Type</h1>
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="w-full h-10 sm:w-64">
          <SearchInput
            placeholder="Search employee name"
            value={searchTerm}
            setValue={handleSearchChange}
          />
        </div>
        <Button onClick={handleAddNew}>Add New Leave Type</Button>
      </div>

      <div className="rounded-lg shadow-sm">
        <CustomTable headers={headers} isLoading={isPending}>
          {leaveTypes?.length ? (
            leaveTypes.map((leaveType) => (
              <TableRow key={leaveType.id} className="text-[#1D2939]  text-sm">
                <TableCell>{leaveType.leave_name}</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <div className="flex items-center gap3">
                    <button
                      className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-8 h-8 rounded hover:border-red-500 transition-colors"
                      aria-label={`Delete ${leaveType.leave_name}`}
                      onClick={() => handleDelete(leaveType)}
                      disabled={isDeleting}
                    >
                      <RiDeleteBin6Line
                        size={16}
                        className="text-gray-600 hover:text-red-500"
                      />
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleEdit(leaveType.id, leaveType.leave_name)
                      }
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState
              headers={headers}
              messageTitle="No Leave Type"
              desc="Create a leave Type"
            />
          )}
        </CustomTable>
      </div>

      <AddLeaveTypeDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
          setIsDialogOpen(open);
        }}
        leaveTypeName={leaveTypeName}
        onLeaveTypeNameChange={setLeaveTypeName}
        onSave={handleSaveLeaveType}
        isEdit={isEdit}
        isPending={isUpdating || isAdding}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Leave Type"
        description={`Are you sure you want to delete this leave type? This action cannot be undone.`}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default LeaveType;
