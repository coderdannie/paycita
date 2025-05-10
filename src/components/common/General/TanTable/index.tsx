import React from 'react';
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
import DropdownComp from "./dropdownComp";

import { Spinner } from "react-activity";
import ApiPagination from "./apiPagination";
import { Asset } from '@/src/types/assets-management';



interface Column {
  header: string;
  accessorKey: string;
  cell?: (props: { row: { original: Asset } }) => React.ReactNode;
}

interface TanTableProps {
  columnData: Column[]; // Update the columnData type
  data: Asset[]; // Ensure data type matches
  loadingState?: boolean;
  onClick?: () => void;
  showSearch?: boolean;
  hidePaging?: boolean;
  length?: number;
  filterList?: string[];
  rightComp?: React.ReactNode;
  leftComp?: React.ReactNode;
  className?: string;
  pagination?: PaginationProps;
  setCurrentPage?: (page: number) => void;
  filterColumn?: string;
  filterOptions?: string[];
}

interface ColumnSort {
  id: string;
  desc: boolean;
}

interface ColumnFilter {
  id: string;
  value: string;
}

const TanTable: FC<TanTableProps> = ({
  columnData,
  data,
  loadingState,
  onClick,
  showSearch,
  hidePaging,
  length,
  leftComp,
  rightComp,
  className,
  pagination,
  setCurrentPage,
  filterColumn,
  filterOptions,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>("");

  const tableData = useMemo(() => data, [data]);
  const columns = useMemo(() => columnData, [columnData]);
  const pageSize: number = length || 10;

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
          pageSize: pageSize,
        },
      },
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: setSearchTerm,
      onSortingChange: setSorting,
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      columnSizing: {},
      columnSizingInfo: {
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        isResizingColumn: false,
        columnSizingStart: [],
      },
    }),
    [
      tableData,
      columns,
      searchTerm,
      sorting,
      columnFilters,
      pageIndex,
      pageSize,
    ]
  );

  const table = useReactTable(options);

  useEffect(() => {
    if (filterColumn && selectedFilterValue && selectedFilterValue !== "All") {
      setColumnFilters([
        {
          id: filterColumn,
          value: selectedFilterValue,
        },
      ]);
    } else {
      setColumnFilters([]);
    }
  }, [selectedFilterValue, filterColumn]);

  const startPage = useMemo(() => {
    const totalPages = table.getPageCount();
    return Math.max(
      0,
      Math.min(totalPages - 1, pageIndex - Math.floor(pageSize / 2))
    );
  }, [pageIndex, pageSize, table]);

  const endPage = useMemo(() => {
    const totalPages = table.getPageCount();
    return Math.min(totalPages - 1, startPage + pageSize - 1);
  }, [startPage, pageSize, table, data, tableData]);

  function isPageActive(pageIndex: number, currentPage: number) {
    return pageIndex === currentPage;
  }

  const currentPage = table.getState().pagination.pageIndex;

  const paginationButtons = useMemo(() => {
    const totalPages = table.getPageCount();
    if (totalPages <= 1) return [];
   const buttons: React.ReactElement[] = [];
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
              ? "current-page text-pry font-bold  bg-lightBg shadow-md"
              : "text-black"
          } transition-background-color duration-300 transition-text-color rounded-md px-2 py-1 flex items-center text-sm cursor-pointer`}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  }, [startPage, endPage, currentPage, table, data, tableData]);

  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm]);

  return (
    <div className={className}>
      <div className={className}>
        <div className="flex justify-between gap-4 flex-wrap items-center pl-4">
          <div className="flex items-center gap-4">
            {showSearch && (
              <SearchComp
                setSearchTerm={setSearchTerm}
                setPageIndex={setPageIndex}
                searchTerm={searchTerm}
              />
            )}
            {filterOptions && filterColumn && (
              <DropdownComp
                options={["All", ...filterOptions]} // Add "All" at the beginning
                selectedValue={selectedFilterValue}
                setSelectedValue={setSelectedFilterValue} // Changed to match the interface
                placeholder="Filter by..."
              />
            )}

            <div>{leftComp}</div>
          </div>
          <div>{rightComp}</div>
        </div>
        <div className="text-sm text-gray-600 p-4">
          {loadingState ? (
            <div className="flex items-center justify-center my-10">
              <Spinner />
            </div>
          ) : data.length < 1 ? (
            <h2>No Data to display</h2>
          ) : (
            <TanBody
              table={table}
              loadingState={loadingState}
              onClick={onClick}
            />
          )}
        </div>
        {pagination ? (
          <ApiPagination
            pagination={pagination}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          !hidePaging &&
          tableData.length > pageSize && (
            <Pagination
              setPageIndex={setPageIndex}
              buttons={paginationButtons}
              table={table}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TanTable;
