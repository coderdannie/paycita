import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";

const ApiPagination = ({
  pagination,
  setCurrentPage,
}: {
  pagination: PaginationProps;
  setCurrentPage?: (page: number) => void;
}) => {
  const { current_page, total_pages, total_records, per_page } = pagination;
  const [pageInput, setPageInput] = useState<string>(current_page.toString());

  const handlePointerEvent = () => {};
  const handleResize = () => {};

  // Calculate the range of records being displayed
  const startRecord =
    total_records === 0 ? 0 : (current_page - 1) * per_page + 1;
  const endRecord = Math.min(current_page * per_page, total_records);

  // Update input when current_page changes
  useEffect(() => {
    setPageInput(current_page.toString());
  }, [current_page]);

  // Handle manual page input
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse the input value
    const pageNumber = parseInt(pageInput, 10);

    // Validate the page number
    if (isNaN(pageNumber)) {
      setPageInput(current_page.toString());
      return;
    }

    // Ensure the page is within valid range
    const validPage = Math.max(1, Math.min(pageNumber, total_pages));

    // Update the page if it's different from the current page
    if (validPage !== current_page && setCurrentPage) {
      setCurrentPage(validPage);
    } else {
      // Reset input if the page is invalid or unchanged
      setPageInput(validPage.toString());
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (total_pages <= maxPagesToShow) {
      // If total pages is less than max, show all pages
      for (let i = 1; i <= total_pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of page range
      let startPage = Math.max(2, current_page - 1);
      let endPage = Math.min(total_pages - 1, current_page + 1);

      // Adjust if we're near the beginning
      if (current_page <= 2) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (current_page >= total_pages - 1) {
        startPage = total_pages - 3;
      }

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < total_pages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(total_pages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm text-gray-600 text-center block w-full">
          Showing {startRecord} to {endRecord} of {total_records} entries
        </div>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          variant="outlined"
          size="sm"
          className="flex items-center gap-1 rounded-full"
          onClick={() => setCurrentPage && setCurrentPage(current_page - 1)}
          disabled={current_page === 1}
          onResize={handleResize}
          onResizeCapture={handleResize}
          onPointerEnterCapture={handlePointerEvent}
          onPointerLeaveCapture={handlePointerEvent}
          placeholder=""
        >
          <ChevronLeft className="h-4 w-4" />
        </IconButton>

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2">...</span>
              ) : (
                <Button
                  variant={current_page === page ? "filled" : "text"}
                  size="sm"
                  className={`w-8 h-8 p-0 ${
                    current_page === page ? "bg-pry text-white" : ""
                  }`}
                  onClick={() =>
                    setCurrentPage && setCurrentPage(page as number)
                  }
                  onResize={handleResize}
                  onResizeCapture={handleResize}
                  onPointerEnterCapture={handlePointerEvent}
                  onPointerLeaveCapture={handlePointerEvent}
                  placeholder=""
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <IconButton
          variant="outlined"
          size="sm"
          className="flex items-center gap-1 rounded-full"
          onClick={() => setCurrentPage && setCurrentPage(current_page + 1)}
          disabled={current_page === total_pages || total_pages === 0}
          onResize={handleResize}
          onResizeCapture={handleResize}
          onPointerEnterCapture={handlePointerEvent}
          onPointerLeaveCapture={handlePointerEvent}
          placeholder=""
        >
          <ChevronRight className="h-4 w-4" />
        </IconButton>

        {/* Page input field */}
        <form
          onSubmit={handlePageInputSubmit}
          className="flex items-center gap-1 ml-2"
        >
          <span className="text-sm text-gray-600">Go to</span>
          <input
            type="number"
            value={pageInput}
            onChange={handlePageInputChange}
            className="w-16 h-8 border border-gray-300 rounded px-2 text-sm"
            min={1}
            max={total_pages}
            disabled={total_pages <= 1}
          />
          <span className="text-sm text-gray-600">of {total_pages}</span>
        </form>
      </div>
    </div>
  );
};

export default ApiPagination;
