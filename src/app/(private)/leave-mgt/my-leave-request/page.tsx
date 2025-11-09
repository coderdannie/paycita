"use client";

import React, { useCallback, useState } from "react";
import LeaveRequestButton from "./LeaveRequest/leaveRequest";
import LeaveSummary from "./LeaveSummary/leaveSummary";
import LeaveHistory from "./LeaveHistory/leaveHistory";
import LeaveRequestModal from "./LeaveRequestModal/leaveRequestModal";
import LeaveDetailsModal from "./LeaveDetailsModal/leaveDetailsModal";
import {
  useCreateLeave,
  useDeleteLeaveRequest,
  useGetAllLeave,
  useGetAllLeaveTypes,
} from "@/src/hooks/leave/useLeave";
import { Leave } from "@/src/components/data/EmployeeMgt/Tabs/LeaveHistory";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  leaveRequestSchema,
  LeaveRequestSchemaType,
} from "@/src/utils/validations";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";

interface LeaveTypeInfo {
  type: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

const Page: React.FC = () => {
  const [showLeaveRequestModal, setShowLeaveRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState<Leave | null>(null);

  const { leave, isPending } = useGetAllLeave({ page: "1" });
  const { leaveTypes } = useGetAllLeaveTypes({
    page: "1",
  });

  const handleOpenLeaveRequest = () => {
    setShowLeaveRequestModal(true);
  };

  const handleCloseLeaveRequest = () => {
    setShowLeaveRequestModal(false);
  };

  const handleOpenDetails = (leave: Leave) => {
    setSelectedLeave(leave);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedLeave(null);
  };

  const { mutateCreateLeave, isPending: isPendingCreateLeave } =
    useCreateLeave();

  const { mutateDeleteLeaveRequest, isPending: isPendingDeleteLeave } =
    useDeleteLeaveRequest();

  const form = useForm<LeaveRequestSchemaType>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      leave_type: "",
      start_date: "",
      end_date: "",
      message: "",
      leave_document: undefined,
    },
  });

  const onSubmit = useCallback(
    (data: LeaveRequestSchemaType) => {
      mutateCreateLeave(data, {
        onSuccess: () => {
          form.reset();
          setShowLeaveRequestModal(false);
        },
        onError: (error: {
          response: {
            data: {
              message: string;
            };
          };
        }) => {
          toast.error(
            error.response?.data?.message || "Failed to create leave"
          );
        },
      });
    },
    [form, mutateCreateLeave]
  );

  const handleDelete = useCallback((leave: Leave) => {
    setLeaveToDelete(leave);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (leaveToDelete) {
      mutateDeleteLeaveRequest(leaveToDelete.id.toString(), {
        onSuccess: () => {
          toast.success("Leave request deleted successfully");
          setIsDeleteModalOpen(false);
          setLeaveToDelete(null);
        },
        onError: () => {
          toast.error("Failed to delete leave request");
        },
      });
    }
  }, [leaveToDelete, mutateDeleteLeaveRequest]);

  if (isPending) {
    return <LoadingOverlay />;
  }

  return (
    <div className="container">
      <div className="flex justify-end mb-6">
        <LeaveRequestButton onOpen={handleOpenLeaveRequest} />
      </div>
      <LeaveSummary
        used={leave?.approved_leave ?? "N/A"}
        pending={leave?.pending_leave ?? "N/A"}
        rejected={leave?.rejected_leave ?? "N/A"}
      />
      <LeaveHistory
        leaves={leave?.leave_requests ?? []}
        onInfoClick={handleOpenDetails}
        handleDelete={handleDelete}
      />

      {showLeaveRequestModal && (
        <LeaveRequestModal
          onClose={handleCloseLeaveRequest}
          onSubmit={onSubmit}
          form={form}
          isPending={isPendingCreateLeave}
          leaveTypes={leaveTypes}
        />
      )}

      {showDetailsModal && selectedLeave && (
        <LeaveDetailsModal leave={selectedLeave} onClose={handleCloseDetails} />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setLeaveToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Leave Request"
        actionLabel="Delete"
        isLoading={isPendingDeleteLeave}
      />
    </div>
  );
};

export default Page;
