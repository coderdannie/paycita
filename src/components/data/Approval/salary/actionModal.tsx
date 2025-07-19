import React, { useState } from "react";
// import LoadingPage from "@/app/loading";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment?: string) => void;
  actionType: "approve" | "reject";
  loading?: boolean;
  month?: string;
  year?: string;
  showMonthYear?: boolean;
}

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  loading = false,
  month = "",
  year = "",
  showMonthYear = false,
}) => {
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(comment);
    setComment(""); // Reset comment after confirmation
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {actionType === "approve" ? "Approve Entry" : "Reject Entry"}
        </h2>

        {showMonthYear && (
          <div className="mb-4">
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Month</label>
              <input
                type="text"
                value={month}
                readOnly
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Year</label>
              <input
                type="text"
                value={year}
                readOnly
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
              />
            </div>
          </div>
        )}

        <p className="mb-4">
          {actionType === "approve"
            ? "Are you sure you want to approve this entry?"
            : "Please provide a reason for rejecting this entry:"}
        </p>

        {actionType === "reject" && (
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows={4}
            placeholder="Enter rejection reason..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded ${
              actionType === "approve"
                ? "bg-[#692E9F] text-white hover:bg-purple-800"
                : "bg-[#CB0606] text-white hover:bg-red-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {actionType === "approve" ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
