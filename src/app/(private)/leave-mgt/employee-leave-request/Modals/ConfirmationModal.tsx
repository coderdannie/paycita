import React, { useEffect } from "react";
import { Spinner } from "react-activity";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  actionLabel: string;
  isReject?: boolean;
  comment?: string;
  onCommentChange?: (comment: string) => void;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  actionLabel,
  isReject = false,
  comment = "",
  onCommentChange,
  isLoading
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        style={{ zIndex: 51, maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#692E9F] rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-extrabold text-3xl">?</span>
          </div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600 text-center mb-6">
            {isReject 
              ? "Please provide a reason for rejection. This action cannot be undone."
              : title.toLowerCase().includes("delete")
                ? "This leave request will be permanently deleted. This action cannot be undone."
                : "Once approved, the employee will be notified. This action cannot be undone."}
          </p>
          {isReject && (
            <div className="w-full mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                value={comment}
                onChange={(e) => onCommentChange?.(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                rows={3}
                placeholder="Please provide a reason for rejection"
                required
              />
            </div>
          )}
          <div className="flex space-x-4 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-[#692E9F] text-[#692E9F] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-[#692E9F] text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-3"
              disabled={isLoading}
            >
              {isLoading && <Spinner />}  {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
