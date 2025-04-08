'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLargeFill } from 'react-icons/ri';
// import { formatDate } from '@/src/utils/helper';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: object;
}

const LoanDetails: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px] w-full text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
        ${
          status === 'Pending'
            ? 'text-[#FFA80A] border-[#FFD384] bg-[#FFFCF5]'
            : 'text-[#3D7AEA] border-[#3D7AEA] bg-[#FFFF]'
        }`}
      >
        {status}
      </span>
    ),
    []
  );
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
                View Loan
              </h2>
              <button onClick={onClose} className="flex items-center gap-2">
                <RiCloseLargeFill />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <DetailRow
                label="Loan No"
                // value={`₦${
                //   Number(details?.amount?.$numberDecimal)?.toLocaleString(
                //     undefined,
                //     {
                //       minimumFractionDigits: 2,
                //     }
                //   ) || '0.00'
                // }`}
                value={'89765'}
              />
              <DetailRow label="Status" value={renderStatusBadge('Pending')} />
              <DetailRow label="Loan Date" value={'Thu, 1 Aug 2024'} />
              <DetailRow label="Full Name" value={'John Doe'} />

              <DetailRow label="Loan Amount" value={'₦10,000'} />
              <DetailRow label="Period" value={'4 Month'} />
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

export default LoanDetails;
