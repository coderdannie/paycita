import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface PaginationProps {
  table: any;
  buttons: React.ReactNode[];
  setPageIndex: (index: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  table,
  buttons,
  setPageIndex,
}) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const handlePreviousPage = () => {
    const newPageIndex = table.getState().pagination.pageIndex - 1;
    table.setPageIndex(newPageIndex);
    setPageIndex(newPageIndex);
  };

  const handleNextPage = () => {
    const newPageIndex = table.getState().pagination.pageIndex + 1;
    table.setPageIndex(newPageIndex);
    setPageIndex(newPageIndex);
  };

  // Helper function to create page buttons with the new styling
  const createPageButton = (pageNumber: number, isActive: boolean = false) => {
    return (
      <button
        key={pageNumber}
        onClick={() => {
          table.setPageIndex(pageNumber - 1);
          setPageIndex(pageNumber - 1);
        }}
        className={`px-3 py-1.5 rounded-md text-sm ${
          isActive ? "bg-gray-200" : "border border-gray-300"
        }`}
      >
        {pageNumber}
      </button>
    );
  };

  const renderPageButtons = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) =>
        createPageButton(i + 1, currentPage === i + 1)
      );
    }

    const pageButtons = [];

    // First page
    pageButtons.push(createPageButton(1, currentPage === 1));

    // Pages around current
    if (currentPage > 3) {
      pageButtons.push(
        <span key="ellipsis1" className="px-2">
          ...
        </span>
      );
    }

    // Middle pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        pageButtons.push(createPageButton(i, currentPage === i));
      }
    }

    // Ellipsis before last page if needed
    if (currentPage < totalPages - 2) {
      pageButtons.push(
        <span key="ellipsis2" className="px-2">
          ...
        </span>
      );
    }

    // Last page
    if (totalPages > 1) {
      pageButtons.push(
        createPageButton(totalPages, currentPage === totalPages)
      );
    }

    return pageButtons;
  };

  return (
    <div className="mt-6 flex justify-center items-center space-x-2">
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={handlePreviousPage}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm flex items-center disabled:opacity-50"
      >
        <ChevronLeft className="mr-1" size={16} />
        Prev
      </button>

      {renderPageButtons()}

      <button
        disabled={!table.getCanNextPage()}
        onClick={handleNextPage}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm flex items-center disabled:opacity-50"
      >
        Next
        <ChevronRight className="ml-1" size={16} />
      </button>
    </div>
  );
};

export default Pagination;
