"use client";

import { FiX } from "react-icons/fi";

import toast from "react-hot-toast";

import { formatDate } from "@/src/utils/helper";
import VerticalItemStepper from "@/src/components/common/VerticalItemStepper";
import { ProcurementRequestDetails } from "@/src/types/procurement-s";
import { useResolveExpensesCommentThread } from "@/src/hooks/expenses/useExpenses";

interface ProcurementModalProps {
  request: ProcurementRequestDetails;
  onClose: () => void;
  onAction: (action: "Approve" | "Reject") => void;
  isLoading?: boolean;
  title?: string;
  setOpenComment: (open: string) => void;
  isPending: boolean;
}

export function ProcurementModal({
  request,
  onClose,
  onAction,
  isLoading = false,
  title = "Procurement Request Details",
  setOpenComment,
}: ProcurementModalProps) {
  const commentsCount = request?.comment_thread?.comments?.length || 0;

  console.log("request", request);
  const { mutate: mutateResolveComment, isPending } =
    useResolveExpensesCommentThread();

  const handleResolveComment = () => {
    const threadId = request?.comment_thread?.thread_id;
    if (!threadId) {
      toast.error("Comment thread ID not found");
      return;
    }

    mutateResolveComment(threadId.toString(), {
      onSuccess: () => {
        toast.success("Comments resolved successfully");
      },
      onError: () => {
        toast.error("Failed to resolve comments");
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 animate-in slide-in-from-right">
      <div className="bg-white w-full md:w-1/2 h-full overflow-y-auto shadow-xl rounded-xl p-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-base font-medium text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>{" "}
        {isPending ? (
          <div className="animate-spin rounded-full mt-2 h-6 w-6 border-4 border-gray-300 border-t-primary"></div>
        ) : (
          <div className="p-4 flex-grow overflow-y-auto">
            <div className="bg-purple-50 p-5 mb-4 rounded-lg border border-[#9B73BF] max-w-full mx-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-gray-800">
                    {request?.procurement_number || request?.id || "No Number"}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {request?.items?.length || 0} Products • Order Placed in{" "}
                    {request?.created_at
                      ? formatDate(request.created_at)
                      : request?.date || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-medium text-gray-800">
                    {request?.total_cost || request?.amount || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 border rounded-lg max-w-full mx-auto">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-[#667085]">Requested By</p>
                <p className="text-sm font-medium">
                  {request?.requested_by?.full_name || "N/A"}
                </p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-[#667085]">Vendor</p>
                <p className="text-sm font-medium">
                  {request?.vendor || "N/A"}
                </p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-[#667085]">Expected Delivery Date</p>
                <p className="text-sm font-medium">
                  {request?.expected_delivery_date || "N/A"}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#667085]">Status</p>
                <div>
                  <span
                    className={`px-3 py-1 text-sm rounded capitalize ${
                      request?.status?.toLowerCase() === "approved"
                        ? "border border-[#00AA4F] text-[#00AA4F]"
                        : request?.status?.toLowerCase() === "rejected"
                        ? "border border-[#EA3D3D] text-[#EA3D3D]"
                        : "border border-[#FFD384] text-[#FFA80A]"
                    }`}
                  >
                    {request?.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 pb-2 border-b-2 flex items-center justify-between">
              <p className="text-[#344054] font-semibold text-lg">List Items</p>
              <div className="flex flex-col gap-2 items-center">
                <button
                  className="flex"
                  onClick={() => {
                    setOpenComment(
                      (request?.procurement_number as string) || ""
                    );
                  }}
                >
                  <span className="text-sm text-[#344054] text-semibold gap-1">
                    {commentsCount} comments
                  </span>
                </button>
                {commentsCount > 0 && (
                  <button
                    className="flex"
                    onClick={handleResolveComment}
                    disabled={false}
                  >
                    <span className="text-xs text-[#344054] text-semibold gap-1">
                      Resolve Comments
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4 p-3 border rounded-lg max-w-full mx-auto">
              <h3 className="text-sm font-medium mb-4">List Items</h3>
              <div className="space-y-4">
                {request?.items?.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <p className="text-sm font-medium">{product.item}</p>
                    <p className="text-sm text-gray-700">{product.price}</p>
                    <p className="text-sm text-gray-700">
                      {product.quantity} Qty
                    </p>
                    <p className="text-sm font-medium">
                      {+product.price * +product.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <VerticalItemStepper approvals={request?.approvals} />
          </div>
        )}
        <div className="p-3 flex justify-end gap-2 mt-auto">
          <button
            className="px-4 py-1.5 border border-[#EA3D3D] text-[#EA3D3D] rounded text-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onAction("Reject")}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Reject"}
          </button>
          <button
            className="px-4 py-1.5 bg-[#692E9F] text-white rounded text-sm hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onAction("Approve")}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
