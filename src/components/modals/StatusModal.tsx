"use client";

import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaExclamationCircle } from "react-icons/fa";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeStatus: (status: string) => void;
  currentStatus: string;
  disabled?: boolean;
}

const statusOptions = ["Approved", "Rejected", "Pending"];

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  onChangeStatus,
  currentStatus,
  disabled = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] text-center block px-[10px] rounded-md 
        ${
          status.toLowerCase() === "approved"
            ? "text-[#008000] bg-[#EDFCED]"
            : status.toLowerCase() === "pending"
            ? "text-[#5252FF] bg-[#EDEDFB]"
            : "text-red-600 bg-[#FFF5F5]"
        }`}
      >
        {status}
      </span>
    );
  }, []);

  const closeModal = useCallback(() => {
    setSelectedStatus(currentStatus);
    onClose();
  }, [onClose, currentStatus]);

  const handleChange = () => {
    onChangeStatus(selectedStatus);
    closeModal();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <IoMdClose size={22} />
            </button>

            <h2 className="text-lg font-semibold mb-2">Change Status</h2>
            <div className="flex justify-between items-center mb-6">
              <div className="mb-2 text-sm text-gray-500">Current status</div>
              <div className="capitalize">
                {renderStatusBadge(currentStatus)}
              </div>
            </div>

            {disabled && (
              <div className="flex items-start gap-2 p-3 text-sm rounded-md bg-red-50 text-red-600 border border-red-200 mb-4">
                <FaExclamationCircle size={18} className="mt-0.5" />
                <p>
                  This status can only be changed within the range of 30min
                  after the initial status.
                </p>
              </div>
            )}

            <label className="block text-sm font-semibold text-[#1D2939] pb-1 mb-1">
              What is the new status?
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <Button
              className="block ml-auto"
              onClick={handleChange}
              disabled={disabled}
            >
              Change status
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusModal;
