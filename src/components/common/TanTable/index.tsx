import { FC, useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Pagination from "./pagination";
import TanBody from "./body";
import SearchComp from "./searchComp";
import { Spinner } from "react-activity";

interface TanTableProps {
  columnData: any[];
  data: any[];
  loadingState?: boolean;
  onClick?: () => void;
  showSearch?: boolean;
  hidePaging?: boolean;
  length?: number;
  filterList?: string[];
  className?: string;
  renderPaginationOutside?: boolean;
  onGetPagination?: (paginationElement: JSX.Element | null) => void;
}

const TanTable: FC<TanTableProps> = ({
  columnData,
  data = [],
  loadingState,
  onClick,
  showSearch,
  hidePaging,
  length = 10,
  filterList,
  className,
  renderPaginationOutside = false,
  onGetPagination,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>(data);

  // Update filtered data when data prop changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const tableData = useMemo(() => filteredData, [filteredData]);
  const columns = useMemo(() => columnData, [columnData]);

  const options = useMemo(
    () => ({
      data: tableData,
      columns,
      state: {
        globalFilter: searchTerm,
        sorting: sorting,
        columnFilters: columnFilters,
        pagination: {
          pageIndex: pageIndex,
          pageSize: length,
        },
      },
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: setSearchTerm,
      onSortingChange: setSorting,
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      enablePagination: true,
      manualPagination: false,
    }),
    [tableData, columns, searchTerm, sorting, columnFilters, pageIndex, length]
  );

  const table = useReactTable(options);

  // Reset page index when data changes
  useEffect(() => {
    setPageIndex(0);
    table.setPageIndex(0);
  }, [data]);

  const startPage = useMemo(() => {
    const totalPages = table.getPageCount();
    return Math.max(
      0,
      Math.min(totalPages - 1, pageIndex - Math.floor(length / 2))
    );
  }, [pageIndex, length, table]);

  const endPage = useMemo(() => {
    const totalPages = table.getPageCount();
    return Math.min(totalPages - 1, startPage + length - 1);
  }, [startPage, length, table]);

  function isPageActive(pageIndex: number, currentPage: number) {
    return pageIndex === currentPage;
  }

  const currentPage = table.getState().pagination.pageIndex;

  const paginationButtons = useMemo(() => {
    const totalPages = table.getPageCount();
    if (totalPages <= 1) return [];
    const buttons: JSX.Element[] = [];
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => {
            table.setPageIndex(i);
            setPageIndex(i);
          }}
          className={`${
            isPageActive(i, currentPage)
              ? "current-page text-pry font-bold bg-lightBg shadow-md"
              : "text-black"
          } transition-background-color duration-300 transition-text-color rounded-md px-2 py-1 flex items-center text-sm cursor-pointer `}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  }, [startPage, endPage, currentPage, table]);

  const handleFilterChange = (selectedFilter: string) => {
    if (selectedFilter === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        Object.values(item).some((value: any) =>
          value
            ?.toString()
            ?.toLowerCase()
            ?.includes(selectedFilter?.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
    setPageIndex(0);
    table.setPageIndex(0);
  };

  // Reset page when search term changes
  useEffect(() => {
    setPageIndex(0);
    table.setPageIndex(0);
  }, [searchTerm]);

  // Create pagination element
  const paginationElement = useMemo(() => {
    if (!hidePaging && tableData.length > length) {
      return (
        <Pagination
          setPageIndex={setPageIndex}
          buttons={paginationButtons}
          table={table}
        />
      );
    }
    return null;
  }, [
    hidePaging,
    tableData.length,
    length,
    paginationButtons,
    setPageIndex,
    table,
  ]);

  // Call the callback with the pagination element when it changes
  useEffect(() => {
    if (renderPaginationOutside && onGetPagination) {
      onGetPagination(paginationElement);
    }
  }, [renderPaginationOutside, onGetPagination, paginationElement]);

  return (
    <div className={className}>
      {showSearch && (
        <SearchComp
          setSearchTerm={setSearchTerm}
          setPageIndex={setPageIndex}
          searchTerm={searchTerm}
          handleFilterChange={handleFilterChange}
          filterList={filterList}
        />
      )}
      <div className="text-sm text-gray-600 p-4">
        {loadingState ? (
          <div className="flex items-center justify-center my-10">
            <Spinner />
          </div>
        ) : !tableData || tableData.length === 0 ? (
          <h2>No Data to display</h2>
        ) : (
          <TanBody
            table={table}
            loadingState={loadingState}
            onClick={onClick}
          />
        )}
      </div>
      {!renderPaginationOutside && paginationElement}
    </div>
  );
};

export default TanTable;
