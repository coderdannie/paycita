import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdWarning } from "react-icons/io";
import { useScrollLock } from "@/src/components/common/useScrollLock";

// import LoadingPage from "@/app/loading";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: "Pending" | "Approved" | "Rejected") => void;
  loading?: boolean;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [newStatus, setNewStatus] = useState<
    "Pending" | "Approved" | "Rejected"
  >("Approved");

  useScrollLock(isOpen);
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value as "Pending" | "Approved" | "Rejected");
  };

  const handleConfirm = () => {
    onConfirm(newStatus);
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
          {/* Loading spinner removed as requested */}

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Change Status</h3>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onClose}
              disabled={loading}
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-2">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Current status
              </label>
              <div className="px-3 py-2 bg-green-100 text-green-800 rounded-md">
                Approved
              </div>
            </div>

            <div className="p-4 mb-4 bg-red-50 rounded-md flex items-start">
              <IoMdWarning className="text-[#970404] h-5 w-5 mt-0.5 mr-2" />
              <p className="text-sm text-[#970404]">
                This status can only be change within the range of 30min after
                the initial status
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What is the new status?
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#692E9F]"
                value={newStatus}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 focus:outline-none"
              onClick={handleConfirm}
            >
              Change status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeModal;
