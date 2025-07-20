import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { ModalProps } from "./approvalLoan";
import { useScrollLock } from "@/src/components/common/useScrollLock";
import LoadingPage from "@/src/app/loading";

const ActionModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  loading,
}) => {
  const [comment, setComment] = useState("");

  useScrollLock(isOpen);
  if (!isOpen) return null;

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(actionType === "reject" ? comment : undefined);
    setComment("");
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-end">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onClose}
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              {actionType === "approve" ? (
                "Are you sure you want to approve this request?"
              ) : (
                <>
                  Are you sure you want to <br /> reject this request?
                </>
              )}
            </h3>
          </div>
          {actionType === "reject" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add rejection comment (optional)
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#692E9F]"
                placeholder="Provide the reason why you are rejecting this request"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          )}
          <div className="mt-6 flex justify-between space-x-4">
            <button
              className="w-full py-2 border border-[#692E9F]  text-[#692E9F] rounded-md hover:bg-gray-50 focus:outline-none"
              onClick={onClose}
            >
              No, I&apos;m not
            </button>
            <button
              className="w-full py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 focus:outline-none"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <LoadingPage
                  fullPage={false}
                  size="small"
                  text="Processing..."
                />
              ) : (
                "Yes I'm sure"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ActionModal;
