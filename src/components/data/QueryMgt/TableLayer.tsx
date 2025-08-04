'use client';

import { useCallback, useMemo, useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import { Info, Edit, Trash2 } from 'lucide-react';
import TableEmptyState from '../../common/TableEmptyState';
import { useGetAllQuery } from '@/src/hooks/query-mgt/useQueryMgt';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/src/utils/helper';
import CustomPagination from '../../common/pagination/Pagination';
import { PiSlidersHorizontal } from 'react-icons/pi';
import SearchInput from '../../ui/SearchInput';

interface TableLayerProps {
  onViewQuery: (queryData: string) => void;
  handleOpenDeleteModal: (value: string) => void;
}

const TableLayer = ({
  onViewQuery,
  handleOpenDeleteModal,
}: TableLayerProps) => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const headers = useMemo(
    () => [
      { label: 'Query Title' },
      { label: 'Assigned To' },
      { label: 'Department' },
      { label: 'Priority' },
      { label: 'Date Created' },
      { label: 'Actions' },
    ],
    []
  );

  const currentPage = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const leaveType = searchParams.get('leave_type') || '';
  const priority = searchParams.get('priority') || '';

  const [searchTerm, setSearchTerm] = useState<string>(search);

  const filters = useMemo(
    () => ({
      page: currentPage,
      query_title: searchTerm,
      department: leaveType,
      priority: priority,
    }),
    [currentPage, leaveType, searchTerm, priority]
  );

  const { allQuery, pagination, isPending } = useGetAllQuery(filters);

  console.log(allQuery);
  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams(
        { ...filters, page: page.toString() },
        { scroll: true }
      );
    },
    [filters, updateSearchParams]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateSearchParams(
        {
          ...filters,
          query_title: value,
          page: '1',
        },
        { debounce: 300 }
      );
    },
    [filters, updateSearchParams]
  );
  const renderPriorityBadge = useCallback((priority: string) => {
    const getPriorityStyles = (priority: string) => {
      switch (priority?.toLowerCase()) {
        case 'high':
          return 'text-[#00AA4F] border-[#00AA4F] bg-[#F0F9F4]';
        case 'medium':
          return 'text-[#FFA80A] border-[#FFD384] bg-[#FFF8E7]';
        case 'low':
          return 'text-[#6C757D] border-[#6C757D] bg-[#F8F9FA]';
        default:
          return 'text-[#6C757D] border-[#6C757D] bg-[#F8F9FA]';
      }
    };

    return (
      <span
        className={`py-[5px] w-[70px] text-center block px-[10px] text-xs border rounded-md capitalize font-medium ${getPriorityStyles(
          priority
        )}`}
      >
        {priority}
      </span>
    );
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-64 h-[50px]">
          <SearchInput
            placeholder="Search for query title"
            value={searchTerm}
            setValue={handleSearchChange}
          />
        </div>
        {/* <button
          className="flex h-10 px-3 gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary whitespace-nowrap"
          onClick={() => console.log('Filter clicked')}
        >
          <span>Filter</span>
          <PiSlidersHorizontal size={20} />
        </button> */}
      </div>
      <div>
        <CustomTable headers={headers} isLoading={isPending}>
          {allQuery?.length ? (
            allQuery?.map((row) => (
              <TableRow key={row?.id} className="text-[#1D2939] text-sm">
                <TableCell className="py-5">
                  <div className="flex gap-2">{row?.title}</div>
                </TableCell>
                <TableCell>{row?.employee}</TableCell>
                <TableCell>{row?.department}</TableCell>
                <TableCell>{renderPriorityBadge(row?.priority)}</TableCell>
                <TableCell>{formatDate(row?.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewQuery(row.id)}
                      className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    {/* <button className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200">
                      <Edit className="w-4 h-4" />
                    </button> */}
                    <button
                      className="text-gray-400 hover:text-red-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                      onClick={() => handleOpenDeleteModal(row.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState headers={headers} />
          )}
        </CustomTable>
      </div>
      {pagination?.total_pages > 1 && (
        <div className="mt-6">
          <CustomPagination
            totalPages={pagination.total_pages}
            currentPage={+currentPage}
            goToPage={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default TableLayer;
