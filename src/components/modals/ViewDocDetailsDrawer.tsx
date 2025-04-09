'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentInfo?: {
    imageUrl?: string;
    fileType?: string;
    size?: string;
    uploadedBy?: string;
    uploadDate?: string;
  };
}

const ViewDocDetailsDrawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  documentInfo,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !documentInfo) {
    return null;
  }

  const { imageUrl, fileType, size, uploadedBy, uploadDate } = documentInfo;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl z-50 rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex px-6 items-center justify-between border-b border-[#E4E7EC] py-5">
              <h2 className="text-lg font-semibold">Document Info</h2>
              <button onClick={onClose} aria-label="Close document info drawer">
                <IoClose className="text-2xl text-[#667085]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow overflow-y-auto">
              {!imageUrl && (
                <div className="relative w-full h-40 rounded-md overflow-hidden mb-4">
                  <Image
                    src="/assets/doc.png"
                    alt="Document Preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}

              <div className="mb-3 flex items-center gap-8">
                <h6 className="text-sm font-medium text-[#344054]">
                  File Type
                </h6>
                <p className="text-sm text-[#1D2939]">{fileType || 'N/A'}</p>
              </div>

              <div className="mb-3 flex items-center gap-8 ">
                <h6 className="text-sm font-medium text-[#344054] 1">Size</h6>
                <p className="text-sm text-[#1D2939]">{size || 'N/A'}</p>
              </div>

              <div className="mb-3 flex items-center gap-8 ">
                <h6 className="text-sm font-medium text-[#344054] ">
                  Uploaded by
                </h6>
                <p className="text-sm text-[#1D2939]">{uploadedBy || 'N/A'}</p>
              </div>

              <div className="mb-3 flex items-center gap-8 ">
                <h6 className="text-sm font-medium text-[#344054] ">
                  Upload Date
                </h6>
                <p className="text-sm text-[#1D2939]">{uploadDate || 'N/A'}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default ViewDocDetailsDrawer;
