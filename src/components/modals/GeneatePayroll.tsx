'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { FaFile } from 'react-icons/fa6';
import { FiFileText } from 'react-icons/fi';

interface GeneratePayrollProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeneratePayroll: React.FC<GeneratePayrollProps> = ({
  isOpen,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading] = useState(false);

  const closeModal = useCallback(() => {
    setFile(null);
    onClose();
  }, [onClose]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleClearFile = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation(); // Prevent event propagation
    setFile(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex z-50 items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white rounded-lg mx-4 shadow-lg p-6 w-[400px]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">General Payroll</h2>
            </div>

            {/* Step 1: Payroll Type Selection */}
            {isLoading ? (
              ''
            ) : (
              <>
                <label
                  className={`w-full border-2 border-gray-300 rounded-lg px-6 flex items-center  cursor-pointer hover:bg-gray-50 ${
                    file
                      ? 'h-[50px] border grid-cols-2 flex-row justify-between'
                      : 'h-[200px]  border-dashed flex-col justify-center'
                  }`}
                >
                  {file ? (
                    <div className="flex items-center gap-3">
                      <FaFile className="text-[#00AA4F] text-2xl" />
                      <span className="text-gray-700">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <FiFileText className="text-gray-400 text-4xl mb-2" />
                      <p className="text-gray-500 text-sm">Upload CSV File</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <IoMdClose
                      className="cursor-pointer"
                      onClick={handleClearFile} // Added onClick handler
                    />
                  )}
                </label>
                {!file && (
                  <p className="text-xs text-[#667085] pt-2">
                    Accepted file types:CSV or Excel format
                  </p>
                )}
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 mb-3 gap-4">
              <Button
                className="w-full border-primary text-primary h-[40px] border-2"
                variant="outline"
                onClick={closeModal}
              >
                Cancel
              </Button>
              {file ? (
                <Button className="bg-primary h-[40px] w-full text-white ml-auto">
                  Preview
                </Button>
              ) : (
                <Button className="bg-primary h-[40px] w-full text-white ml-auto">
                  Upload
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GeneratePayroll;
