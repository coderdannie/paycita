"use client";

import React from "react";
import SearchInput from "@/src/components/ui/SearchInput";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PiSlidersHorizontal } from "react-icons/pi";
import CustomTable from "@/src/components/common/CustomTable";
import {
  useAddApprovalComment,
  useGetAllApprovals,
  useUpdateApproval,
} from "@/src/hooks/approvals/useApprovals";
import { useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import debounce from "lodash/debounce";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import Image from "next/image";
import { TableCell, TableRow } from "@/src/components/ui/table";
import { formatLongCurrency } from "@/src/utils/helper";
import { ProcurementModal } from "@/src/components/data/Approval/procurement/procurementModal";
import { useGetSingleProcurement } from "@/src/hooks/procurement/useProcurement";
import { ProcurementRequestDetails } from "@/src/types/procurement-s";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";
import CommentModal from "@/src/components/data/Approval/procurement/commentModal";
import ExpensesOTPModal from "@/src/components/modals/ExpenseOtpModal";
import CommentThreadModal, {
  CommentsThreadType,
} from "@/src/components/modals/CommentThreadModal";
import CustomPagination from "@/src/components/common/pagination/Pagination";

const Procurement = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<ProcurementRequestDetails | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"Approve" | "Reject" | null>(
    null
  );
  const [openThreadModal, setOpenThreadModal] = useState(false);

  const headers = useMemo(
    () => [
      { label: "Pr" },
      { label: "Amount" },
      { label: "Status" },
      { label: "Action" },
    ],
    []
  );
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const currentPage = searchParams.get("page") || "1";
  const currentSearch = searchParams.get("search") || "";
  const currentStartDate = searchParams.get("start_date") || "";
  const currentEndDate = searchParams.get("end_date") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentDepartment = searchParams.get("department") || "";

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
  }, [currentSearch, searchTerm]);

  const queryFilters = useMemo(() => {
    const filters: Record<string, string> = { page: currentPage };
    if (currentSearch) filters.search = currentSearch;
    if (currentStartDate) filters.start_date = currentStartDate;
    if (currentEndDate) filters.end_date = currentEndDate;
    if (currentStatus) filters.status = currentStatus;
    if (currentDepartment) filters.expense_type = currentDepartment;
    return filters;
  }, [
    currentPage,
    currentSearch,
    currentStartDate,
    currentEndDate,
    currentStatus,
    currentDepartment,
  ]);

  const { approvals, isPending, isError, pagination } = useGetAllApprovals(
    "pending-procurement-requests",
    queryFilters
  );

  const { mutate: mutateUpdateApprovalStatus, isPending: isUpdatePending } =
    useUpdateApproval("update-procurement-requests");

  const { procurement, isPending: isLoading } = useGetSingleProcurement(
    selectedRequest?.procurement_id || ""
  );

  const handleApprove = () => {
    const payload = {
      id: selectedRequest?.approval_status_id || "",
      data: {
        status: "approved",
      },
    };

    mutateUpdateApprovalStatus(payload, {
      onSuccess: (data) => {
        toast.success("Status updated successfully");

        // This will invalidate ALL approval queries regardless of route/filters
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ALL_APPROVALS],
        });

        if (data?.data?.data?.requires_otp) {
          setIsOTPModalOpen(true);
        } else {
          closeModal();
        }
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      },
    });
  };

  const handleReject = (comment: string) => {
    const payload = {
      id: selectedRequest?.approval_status_id || "",
      data: {
        status: "rejected",
        reason: comment,
      },
    };
    mutateUpdateApprovalStatus(payload, {
      onSuccess: () => {
        toast.success("Status updated successfully");
        setShowCommentModal(false);
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.GET_ALL_APPROVALS,
            "pending-procurement-requests",
          ],
        });
        closeModal();
        handleCloseCommentModal();
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      },
    });
  };

  const { mutate: mutateAddComment, isPending: isAddingComment } =
    useAddApprovalComment("add-procurement-comment");

  const closeModal = () => {
    setIsModalOpen(false);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  };

  const handleAction = (action: "Approve" | "Reject") => {
    if (action === "Approve") {
      handleApprove();
    } else {
      setShowCommentModal(true);
    }
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setActionType(null);
  };

  const handleSubmitComment = (comment: string) => {
    handleReject(comment);
  };

  const handleOpenCommentThreadModal = (requestId: string) => {
    setOpenThreadModal(true);
  };

  const currentComments: CommentsThreadType[] =
    procurement?.comment_thread?.comments || [];

  const currentThreadId = procurement?.comment_thread?.thread_id;

  const handleSend = (message: string) => {
    if (!currentThreadId) {
      toast.error("Cannot add comment: Thread ID is missing.");
      return;
    }
    if (!selectedRequest?.procurement_id) {
      toast.error("Cannot add comment: Procurement ID is missing.");
      return;
    }

    const payload = {
      thread_id: currentThreadId,
      comment: message,
    };

    mutateAddComment(payload, {
      onSuccess: () => {
        toast.success("Comment added successfully");
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.GET_SINGLE_PROCUREMENT,
            selectedRequest?.procurement_id,
          ],
        });
        setOpenThreadModal(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError)
          toast.error(
            error?.response?.data?.message || "Failed to add comment"
          );
        else toast.error("An unexpected error occurred while adding comment.");
      },
    });
  };

  const openRequestDetails = (request: ProcurementRequestDetails) => {
    setSelectedRequest(request);
    setIsModalOpen(true);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() });
    },
    [updateSearchParams]
  );

  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
        Procurement
      </h2>
      <div className="flex mt-10 justify-between items-center gap-2 flex-wrap">
        <div className="h-[40px] max-w-[338px] w-full">
          <SearchInput
            placeholder="Search for relevant details"
            value={searchTerm}
            setValue={setSearchTerm} // This will trigger a refetch due to change in queryKey
          />
        </div>
        {/* <button
          className="flex h-[40px] px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <span>Filter</span> <PiSlidersHorizontal size={24} />
        </button> */}
      </div>
      <div className="mt-6">
        <CustomTable headers={headers} isLoading={isPending}>
          {approvals?.length ? (
            approvals.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="text-sm">
                <TableCell className="py-5">
                  {row.procurement_number ?? "N/A"}
                </TableCell>
                <TableCell>
                  ₦ {formatLongCurrency(+row.amount) ?? "N/A"}
                </TableCell>
                <TableCell>
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer ${
                      row.status === "approved"
                        ? "text-[#008000] bg-[#EDFCED]"
                        : row.status === "pending"
                        ? "text-[#5252FF] bg-[#EDEDFB]"
                        : "text-red-600 bg-[#FFF5F5]"
                    }`}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <button
                      className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                      onClick={() => openRequestDetails(row)}
                      aria-label={`View details for ${row.procurement_number}`}
                    >
                      <Image
                        src="/assets/warn.svg"
                        alt="info icon"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState
              headers={headers}
              messageTitle="No Procurement Records"
              desc="Procurement Records will appear here."
            />
          )}
        </CustomTable>
      </div>
      {!isLoading && !isError && pagination?.total_pages > 1 && (
        <CustomPagination
          totalPages={pagination.total_pages}
          currentPage={+currentPage}
          goToPage={goToPage}
        />
      )}
      {isModalOpen && selectedRequest && procurement && (
        <ProcurementModal
          request={procurement}
          onClose={closeModal}
          onAction={handleAction}
          isLoading={isUpdatePending}
          setOpenComment={handleOpenCommentThreadModal}
          isPending={isLoading}
        />
      )}
      {showCommentModal && (
        <CommentModal
          title={`Comment on Procurement Request
        `}
          onClose={handleCloseCommentModal}
          onSubmit={handleSubmitComment}
        />
      )}
      <ExpensesOTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        approvalStatusId={selectedRequest?.approval_status_id || ""}
        callback={() => {
          queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEYS.GET_ALL_APPROVALS,
              "pending-procurement-requests",
            ],
          });
          closeModal();
          setIsOTPModalOpen(false);
        }}
      />
      <CommentThreadModal
        isOpen={openThreadModal}
        onClose={() => setOpenThreadModal(false)}
        comments={currentComments}
        onSend={handleSend}
        isLoading={isAddingComment}
      />
    </div>
  );
};

export default Procurement;
