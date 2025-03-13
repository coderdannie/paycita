"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Previous button */}
      <button
        className="px-4 py-2 flex items-center justify-center text-[#98A2B3] hover:text-gray-700 disabled:opacity-50 border rounded-md"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="ml-1">Prev</span>
      </button>

      <button
        className={`w-12 h-12 flex items-center justify-center text-sm font-medium rounded-md border
          ${
            currentPage === 1
              ? "border border-[#E4E7EC] bg-white text-[#1D2939]"
              : "text-[#667085] hover:bg-gray-100"
          }`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>

      <button
        className={`w-8 h-8 flex items-center justify-center text-sm font-medium
          ${
            currentPage === 2
              ? "border border-[#E4E7EC] bg-white text-[#1D2939]"
              : "text-[#667085] hover:bg-gray-100"
          }`}
        onClick={() => handlePageChange(2)}
      >
        2
      </button>

      <button
        className={`w-8 h-8 flex items-center justify-center text-sm font-medium
          ${
            currentPage === 3
              ? "bg-[#E4E7EC] text-[#1D2939]"
              : "text-[#667085] hover:bg-gray-100"
          }`}
        onClick={() => handlePageChange(3)}
      >
        3
      </button>

      <button
        className={`w-8 h-8 flex items-center justify-center text-sm font-medium
          ${
            currentPage === 4
              ? "bg-[#E4E7EC] text-[#1D2939] "
              : "text-[#667085] hover:bg-gray-100"
          }`}
        onClick={() => handlePageChange(4)}
      >
        4
      </button>

      <span className="w-8 h-8 flex items-center justify-center text-gray-500">
        ...
      </span>

      {/* Next button */}
      <button
        className="px-4 py-2 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 border rounded-md"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="mr-1">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
