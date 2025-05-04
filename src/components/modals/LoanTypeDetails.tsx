"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLargeFill } from "react-icons/ri";
// import { formatDate } from '@/src/utils/helper';
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: {
    eligibility: string;
    maximum_loan_limit: string;
    repayment_method: string;
    policy_name: string;
    loan_type: string;
  };
}

const LoanTypeDetails: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  details,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={onClose} // Close modal on overlay click
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()} // Prevent click propagation
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#1D2939]">
                Loan Type Details
              </h2>
              <button onClick={onClose} className="flex items-center gap-2">
                <RiCloseLargeFill />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <h2>Basic Information</h2>
              <DetailRow label="Loan Type" value={details.loan_type ?? "N/A"} />
              <DetailRow
                label="Policy Name"
                value={details.policy_name ?? "N/A"}
              />
            </div>
            <div className="space-y-2 mt-4">
              <h2>Policy Details</h2>
              <DetailRow
                label="Eligibility"
                value={details.eligibility ?? "N/A"}
              />
              <DetailRow
                label="Maximum Loan Limit"
                value={`₦ ${details.maximum_loan_limit ?? "N/A"}`}
              />
              <DetailRow
                label="Repayment Method"
                value={details.repayment_method ?? "N/A"}
              />
            </div>

            <Button className="w-full mt-5" onClick={onClose}>
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Reusable Detail Row Component
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <p className="text-sm text-[#667085]">{label}</p>
    <p className="text-sm font-semibold text-[#344054]">{value}</p>
  </div>
);

export default LoanTypeDetails;
