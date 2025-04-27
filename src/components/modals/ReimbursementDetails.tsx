"use client";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoCloudDownloadOutline } from "react-icons/io5";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetReimbursementById } from "@/src/hooks/re-imbursement/useReImbursement";
import Image from "next/image";

interface ReimbursementDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  onReject?: () => void;
}

const ReimbursementDetails: React.FC<ReimbursementDetailsProps> = ({
  isOpen,
  onClose,
  id,
  onReject,
}) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const { reimbursement } = useGetReimbursementById(id);

  const toggleImageExpansion = useCallback(() => {
    setIsImageExpanded((prev) => !prev);
  }, []);

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] w-full text-sm text-center block px-[10px] rounded-md 
          ${
            status === "approved"
              ? "text-[#008000] bg-[#EDFCED]"
              : status === "pending"
              ? "text-[#5252FF] bg-[#EDEDFB]"
              : "text-red-600 bg-[#FFF5F5]"
          }`}
      >
        {status}
      </span>
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = isOpen ? "hidden" : "auto";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-xl z-50 rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Reimbursement Details</h2>
              <button
                onClick={onClose}
                aria-label="Close reimbursement details"
              >
                <IoClose className="text-2xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="grid  gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Reimbursement</p>
                    <p className="font-semibold">{reimbursement?.rb_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">
                      {reimbursement?.date_of_purchase}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-2 gap-x-4">
                  <div>
                    <p className="text-sm text-gray-500">Employee Name</p>
                    <p className="font-semibold">
                      {reimbursement?.employee_name}{" "}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="ml-auto">
                      {renderStatusBadge(reimbursement?.status)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold">{reimbursement?.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-semibold text-gray-700">
                    {reimbursement?.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mt-2 mb-1">Receipt</p>
                  <div className="relative rounded-md border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center">
                          <IoCloudDownloadOutline className="text-xl text-gray-500" />
                        </div>
                        <p className="text-sm font-medium">Receipt.pdf</p>
                        <p className="text-xs text-gray-500">20KB</p>
                      </div>
                      <button
                        className="p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
                        aria-label="Download Receipt"
                      >
                        <IoCloudDownloadOutline className="text-xl" />
                      </button>
                    </div>
                    <div
                      onClick={toggleImageExpansion}
                      className="cursor-pointer overflow-hidden rounded-b-md"
                    >
                      <Image
                        width={400}
                        height={200}
                        src={reimbursement?.proof_of_payment}
                        onClick={toggleImageExpansion}
                        alt="Receipt Preview"
                        className={`w-full h-auto object-cover transition-transform duration-300 ${
                          isImageExpanded ? "scale-100" : "scale-105"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E4E7EC] p-4 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <Button type="submit">Apply</Button>
                  <Button
                    type="button"
                    onClick={onReject}
                    variant="outline"
                    className="flex-1 py-2 border border-[#EA3D3D] text-[#EA3D3D] font-semibold rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReimbursementDetails;
