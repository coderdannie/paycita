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
      <button
        className="px-2 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="ml-1">Prev</span>
      </button>

      {/* Page 1 */}
      <button
        className={`w-8 h-8 flex items-center justify-center text-sm font-medium
          ${
            currentPage === 1
              ? "bg-gray-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>

      {/* Page 2 */}
      <button
        className={`w-8 h-8 flex items-center justify-center text-sm font-medium
          ${
            currentPage === 2
              ? "bg-gray-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        onClick={() => handlePageChange(2)}
      >
        2
      </button>

      {/* Page 3 */}
      <button
        className={`w-8 h-8 flex items-center justify-center text-sm font-medium
          ${
            currentPage === 3
              ? "bg-gray-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        onClick={() => handlePageChange(3)}
      >
        3
      </button>

      {/* Page 4 */}
      <button
        className={`w-8 h-8 flex items-center justify-center text-sm font-medium
          ${
            currentPage === 4
              ? "bg-gray-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        onClick={() => handlePageChange(4)}
      >
        4
      </button>

      {/* Ellipsis - only show if totalPages > 4 */}
      {totalPages > 4 && (
        <span className="w-8 h-8 flex items-center justify-center text-gray-500">
          ...
        </span>
      )}

      <button
        className="px-2 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
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
