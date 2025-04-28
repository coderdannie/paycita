"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaFile } from "react-icons/fa6";
import { FiFileText } from "react-icons/fi";
import { Loader2 } from "lucide-react"; // Import a loader icon

interface GeneratePayrollProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void; // Add onUpload prop
  isLoading: boolean; // Add isLoading prop
}

const GeneratePayroll: React.FC<GeneratePayrollProps> = ({
  isOpen,
  onClose,
  onUpload, // Destructure onUpload
  isLoading, // Destructure isLoading
}) => {
  const [file, setFile] = useState<File | null>(null);
  // Removed internal isLoading state, using the prop instead

  const closeModal = useCallback(() => {
    if (isLoading) return; // Prevent closing while uploading
    setFile(null);
    onClose();
  }, [onClose, isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleClearFile = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation(); // Prevent event propagation
    setFile(null);
  };

  const handleUploadClick = () => {
    if (file && !isLoading) {
      onUpload(file); // Call the passed onUpload function
    }
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex z-50 items-center justify-center bg-black/50"
          onClick={closeModal} // Close on backdrop click
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white rounded-lg mx-4 shadow-lg p-6 w-[400px]"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upload Payroll File</h2>
              <IoMdClose
                className="text-xl cursor-pointer text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              />
            </div>

            {/* File Upload Area */}
            <label
              className={`w-full border-2 border-gray-300 rounded-lg px-6 flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                file
                  ? "h-[50px] border grid-cols-2 flex-row justify-between"
                  : "h-[200px] border-dashed flex-col justify-center text-center"
              } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              {file ? (
                <div className="flex items-center gap-3 overflow-hidden">
                  <FaFile className="text-[#00AA4F] text-2xl flex-shrink-0" />
                  <span className="text-gray-700 truncate">{file.name}</span>
                </div>
              ) : (
                <>
                  <FiFileText className="text-gray-400 text-4xl mb-2 mx-auto" />
                  <p className="text-gray-500 text-sm">
                    {isLoading ? "Uploading..." : "Click or drag file to upload"}
                  </p>
                </>
              )}
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" // More specific MIME types
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading} // Disable input while loading
              />
              {file && !isLoading && ( // Only show clear button if not loading
                <IoMdClose
                  className="cursor-pointer text-gray-500 hover:text-gray-800 ml-2 flex-shrink-0"
                  onClick={handleClearFile}
                />
              )}
            </label>
            {!file && (
              <p className="text-xs text-[#667085] pt-2 text-center">
                Accepted file types: CSV or Excel format
              </p>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 mb-3 gap-4">
              <Button
                className="w-full border-primary text-primary h-[40px] border" // Adjusted border style
                variant="outline"
                onClick={closeModal}
                disabled={isLoading} // Disable cancel while loading
              >
                Cancel
              </Button>
              <Button
                className="bg-primary h-[40px] w-full text-white ml-auto flex items-center justify-center gap-2"
                onClick={handleUploadClick}
                disabled={!file || isLoading} // Disable if no file or loading
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GeneratePayroll;
