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
import ExpenseRequestDrawer from '@/src/components/modals/ExpensesRequest';
import { MdArrowForwardIos } from 'react-icons/md';
import Calendar from 'react-calendar';
import {
  useGetAllPurchaseExpenses,
  useGetSingleExpense,
} from '@/src/hooks/expenses/useExpenses';
import { ExpenseRequest } from '@/src/types/allPurchaseExpenses';
import { formatDate } from '@/src/utils/helper';
import { statusOptions } from '@/src/components/common/constants';
import CustomPagination from '@/src/components/common/pagination/Pagination';

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
  date: string;
}

const AllPurchase = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const updateSearchParams = useUpdateSearchParams();
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState('');
  const [selectedExpenses, setSelectedExpenses] =
    useState<ExpenseRequest | null>(null);
  const [expenseId, setExpenseId] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const onClose = useCallback(() => setIsOpen(false), []);
  const [isShow, setIsShow] = useState(false);

  // Get query params with defaults
  const currentPage = searchParams.get('page') || '1';
  const status = searchParams.get('status') || '';
  const dateParam = searchParams.get('date') || '';

  const { expenses, pagination, isLoading } = useGetAllPurchaseExpenses({
    page: currentPage.toString(),
  });

  const { expense } = useGetSingleExpense(expenseId);

  const filters = useMemo(
    () => ({
      page: currentPage,
      employee_name: searchTerm,
      status: status,
      date: dateParam,
    }),
    [currentPage, searchTerm, status, dateParam]
  );

  const form = useForm<FilterFormValues>({
    defaultValues: {
      status,
      date: dateParam,
    },
  });

  const handleDateChange = (selectedDate: Date) => {
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    setDate(formattedDate);
    setShowDate(false);
    form.setValue('date', formattedDate);
  };

  const onSubmit = useCallback(
    (data: FilterFormValues) => {
      updateSearchParams({ ...filters, ...data, page: '1' });
      setIsOpen(false);
    },
    [filters, updateSearchParams]
  );

  const handleReset = useCallback(() => {
    form.reset();
    setDate('');
    updateSearchParams({
      ...filters,
      page: '1',
      status: '',
      date: '',
    });
  }, [filters, form, updateSearchParams]);

  const headers = useMemo(
    () => [
      { label: 'Expense Number' },
      { label: 'Employee Name' },
      { label: 'Department' },
      { label: 'Date' },
      { label: 'Total Cost' },
      { label: 'Status' },
      { label: 'Action' },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return expenses?.filter((item: ExpenseRequest) => {
      const matchesSearch = item?.employee_name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());

      const matchesStatus = !status || item?.status === status;

      const matchesDate = !dateParam || item.date === dateParam;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchTerm, status, dateParam, expenses]);

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

  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-xl flex items-center">
        All Expenses{' '}
        <span>
          <MdArrowForwardIos />
        </span>{' '}
        All Purchase Expenses
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
        <CustomTable headers={headers} isLoading={isLoading}>
          {filteredData?.length > 0 ? (
            filteredData?.map((row: ExpenseRequest) => (
              <TableRow key={row.id} className="text-[#1D2939] text-sm">
                <TableCell>{row.expense_number}</TableCell>
                <TableCell>{row.employee_name}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell>₦ {Number(row.amount).toLocaleString()}</TableCell>
                <TableCell>
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
                      setExpenseId(row?.id);
                      setSelectedExpenses(row);
                      setIsShow(true);
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
            <div className="relative">
              <label className="block text-sm font-medium mb-1 text-[#1D2939]">
                Date
              </label>
              <input
                readOnly
                value={date}
                onClick={() => setShowDate(!showDate)}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="Select date"
              />

              {showDate && (
                <div className="absolute z-50 mt-2">
                  <Calendar
                    onChange={handleDateChange}
                    value={date ? new Date(date) : null}
                    tileClassName={({ date }) =>
                      date.getDay() === 0 || date.getDay() === 6
                        ? 'weekend'
                        : ''
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </FilterDrawer>
        <ExpenseRequestDrawer
          open={isShow}
          onOpenChange={setIsShow}
          selectedExpenses={selectedExpenses}
          expense={expense}
        />
      </div>
    </div>
  );
};

export default AllPurchase;
