import { Button } from "@/components/ui/button";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";

const CustomPagination = ({
  currentPage,
  totalPages,
  goToPage,
}: {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}) => {
  return (
    <nav
      className="flex w-full justify-center items-center gap-5 rounded-md mt-3 px-2"
      aria-label="Pagination"
    >
      <Button
        variant="ghost"
        className={`border-2 border-gray-200 font-bold rounded-lg relative inline-flex items-center px-2 py-4 text-gray-700 text-sm hover:bg-gray-50 ${
          currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={(e) => {
          if (currentPage === 1) {
            e.preventDefault();
          } else {
            goToPage(currentPage - 1);
          }
        }}
        aria-disabled={currentPage === 1}
      >
        <span className="sr-only">Previous</span>
        <GrLinkPrevious />{" "}
        <span className=" hidden sm:ml-3 sm:block">Prev</span>
      </Button>

      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;

          if (
            Math.abs(currentPage - pageNumber) <= 2 ||
            pageNumber === 1 ||
            pageNumber === totalPages
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`relative flex justify-center items-center w-6 sm:h-10 sm:w-10  rounded-lg text-xs ${
                  pageNumber === currentPage
                    ? "text-black bg-white border-2 border-gray-200 font-semibold"
                    : "text-gray-900 bg-gray-50 hover:bg-gray-100  focus:border-indigo-300"
                }`}
              >
                {pageNumber}
              </button>
            );
          }

          if (Math.abs(currentPage - pageNumber) <= 3) {
            return (
              <span
                key={`ellipsis-${pageNumber}`}
                className="relative flex justify-center items-center rounded-full"
              >
                ...
              </span>
            );
          }

          return null;
        })}
      </div>

      <Button
        variant="ghost"
        className={`border-2 border-gray-200 font-bold relative inline-flex items-center px-2 py-4 rounded-lg text-gray-700 text-sm hover:bg-gray-50 ${
          currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={(e) => {
          if (currentPage === totalPages) {
            e.preventDefault();
          } else {
            goToPage(currentPage + 1);
          }
        }}
        aria-disabled={currentPage === totalPages}
      >
        <span className="sr-only">Next</span>
        <span className="hidden sm:mr-3 sm:block">Next </span> <GrLinkNext />
      </Button>
    </nav>
  );
};

export default CustomPagination;
