'use client';

import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import SearchInput from '@/src/components/ui/SearchInput';
import { PiSlidersHorizontal } from 'react-icons/pi';
import { IoIosArrowDown } from 'react-icons/io';
import FilterDrawer from '@/src/components/common/FilterDrawer';
import { Controller, useForm } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { SingleValue } from '@/src/types/attendance';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useSearchParams } from 'next/navigation';
import CustomTable from '@/src/components/common/CustomTable';
import { TableCell, TableRow } from '@/src/components/ui/table';
import TableEmptyState from '@/src/components/common/TableEmptyState';
import CustomPagination from '@/src/components/common/pagination/Pagination';

import ReimbursementDetailModal from '@/src/components/modals/ReimbursementModalDetails';
import { useGetAllReimbursements } from '@/src/hooks/expenses/useExpenses';
import { statusOptions } from '@/src/components/common/constants';
import { ReimbursementItem } from '@/src/types/allReimbursement';
import { formatDate } from '@/src/utils/helper';
import LoadingOverlay from '@/src/components/common/LoadingOverlay';

const customStyles: StylesConfig<SingleValue, false> = {
  control: (provided) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: '2px solid #E4E7EC',
    borderRadius: '8px',
    boxShadow: 'none',
    minHeight: '40px',
    padding: '0 12px',
    fontSize: '14px',
    color: '#1D2939',
    outline: 'none',
    '&:hover': {
      borderColor: '#692E9F',
    },
    '&:focus': {
      borderColor: 'transparent',
      outline: 'none',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '12px',
    color: '#b3b3b3',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '10px',
    marginTop: '4px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#F0EAF5' : 'transparent',
    color: '#333333',
    fontSize: '12px',
    padding: '10px 8px',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#EAEAEA',
    },
  }),
};

interface FilterFormValues {
  status: string;
  job_title: string;
  job_level: string;
}
const AllReimbursement = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const updateSearchParams = useUpdateSearchParams();
  const [selectedReimbursement, setSelectedReimbursement] =
    useState<ReimbursementItem | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const onClose = useCallback(() => setIsOpen(false), []);

  // Get query params with defaults
  const currentPage = searchParams.get('page') || '1';
  const status = searchParams.get('status') || '';
  const [open, setOpen] = useState(false);
  const filters = useMemo(
    () => ({
      page: currentPage,
      employee_name: searchTerm,

      status: status,
    }),
    [currentPage, searchTerm, status]
  );
  const form = useForm<FilterFormValues>({
    defaultValues: {
      status,
    },
  });
  const onSubmit = useCallback(
    (data: FilterFormValues) => {
      updateSearchParams({ ...filters, ...data, page: '1' });
      setIsOpen(false);
    },
    [filters, updateSearchParams]
  );

  const handleReset = useCallback(() => {
    form.reset();
    updateSearchParams({
      ...filters,
      page: '1',
      status: '',
    });
  }, [filters, form, updateSearchParams]);

  const headers = useMemo(
    () => [
      { label: 'RN' },
      { label: 'Employee Name' },
      { label: 'Department' },
      { label: 'Description' },
      { label: 'Amount' },
      { label: 'Date' },
      { label: 'Status' },
      { label: 'Action' },
    ],
    []
  );

  const handleViewDetails = (reimbursement: ReimbursementItem) => {
    setSelectedReimbursement(reimbursement);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 border-[#89D8A9] bg-[#F5FFFA]';
      case 'pending':
        return 'text-yellow-600 border-[#F4D03F] bg-[#FEF9E7]';
      default: // For Rejected or any other status
        return 'text-red-600 border-[#F49E9E] bg-[#FFF5F5]';
    }
  };

  const {
    reimbursements,
    pagination,
    isLoading: isPending,
  } = useGetAllReimbursements({
    page: currentPage.toString(),
  });

  const filteredData = useMemo(() => {
    return reimbursements?.filter((item: ReimbursementItem) => {
      const matchesSearch = item?.employee_name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());

      const matchesStatus = !status || item.status === status;

      // const matchesDate = !dateParam || item.date === dateParam;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, status]);

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams(
        { page: page.toString() },
        {
          scroll: true,
        }
      );
    },
    [updateSearchParams]
  );

  if (isPending) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-xl">
        Reimbursement
      </h2>
      <div className="flex items-center mt-9 justify-between space-x-2">
        <div className="relative flex-grow max-w-xs h-[40px]">
          <SearchInput
            placeholder="Search"
            value={searchTerm}
            setValue={setSearchTerm}
          />
        </div>
        <button
          className="flex h-10 px-3 gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary whitespace-nowrap"
          onClick={() => setIsOpen(true)}
        >
          <span>Filter</span>
          <PiSlidersHorizontal size={20} />
        </button>
      </div>
      <div className="mt-5">
        <CustomTable headers={headers}>
          {reimbursements?.length > 0 ? (
            filteredData?.map((row: ReimbursementItem) => (
              <TableRow key={row.id} className="text-[#1D2939] text-sm">
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.employee_name}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell>
                  {' '}
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer ${getStatusStyle(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Button
                    variant="outline"
                    className="border border-primary text-primary px-3 py-1 rounded-md text-sm"
                    onClick={() => {
                      handleViewDetails(row);
                      setOpen(true);
                    }}
                  >
                    View details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState headers={headers} />
          )}
        </CustomTable>

        <div className="mt-6">
          {pagination?.total_pages > 1 && (
            <CustomPagination
              totalPages={pagination?.total_pages}
              currentPage={+currentPage}
              goToPage={goToPage}
            />
          )}
        </div>
        <FilterDrawer
          isOpen={isOpen}
          onClose={onClose}
          onReset={handleReset}
          form={form}
          onSubmit={onSubmit}
        >
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold pb-2">Status</label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    value={
                      statusOptions.find((opt) => opt.value === field.value) ||
                      null
                    }
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value || '');
                    }}
                    styles={customStyles}
                    placeholder="Select Status"
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator: () => (
                        <IoIosArrowDown size={15} color="#667085" />
                      ),
                    }}
                  />
                )}
              />
            </div>
          </div>
        </FilterDrawer>

        {open && (
          <ReimbursementDetailModal
            onClose={() => setOpen(false)}
            reimbursement={selectedReimbursement}
          />
        )}
      </div>
    </div>
  );
};
export default AllReimbursement;
