'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { SingleValue } from '@/src/types/attendance';
import Image from 'next/image';
import Link from 'next/link';
import { PiSlidersHorizontal } from 'react-icons/pi';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';

import SearchInput from '@/src/components/ui/SearchInput';
import CustomTable from '@/src/components/common/CustomTable';
import { TableCell, TableRow } from '@/src/components/ui/table';
import CustomPagination from '@/src/components/common/pagination/Pagination';
import FilterDrawer from '@/src/components/common/FilterDrawer';
import TableEmptyState from '@/src/components/common/TableEmptyState';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useGetAllEmployees } from '@/src/hooks/dashboard/useDashboard';
import { jobOptions, levelOptions } from '@/src/utils/constants';
import { AddEmployee } from '@/src/components/modals/AddEmployee';
import { BulkEmployeeUpload } from '@/src/components/modals/BulkEmployeeUploads';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const;

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

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

const EmployeeMgt = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const updateSearchParams = useUpdateSearchParams();

  // Get query params with defaults
  const currentPage = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const title = searchParams.get('job_title') || '';
  const status = searchParams.get('status') || '';
  const jobLevel = searchParams.get('job_level') || '';

  const [searchTerm, setSearchTerm] = useState(search);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleUploadComplete = (file: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, file]);
    console.log('File uploaded:', file);
  };

  const handleIndividualOnboarding = () => {
    router.push('/employee-mgt/add-personal-info');
  };

  const handleBulkOnboarding = () => {
    setIsDialogOpen(true);
    setIsAddEmployeeOpen(false);
  };

  // Memoize filters to prevent unnecessary recalculations
  const filters = useMemo(
    () => ({
      page: currentPage,
      employee_name: searchTerm,
      job_title: title,
      status: status,
      job_level: jobLevel,
    }),
    [currentPage, jobLevel, searchTerm, status, title]
  );

  const { employees, isPending, pagination } = useGetAllEmployees(filters);

  const form = useForm<FilterFormValues>({
    defaultValues: {
      status,
      job_title: title,
      job_level: jobLevel,
    },
  });

  const onSubmit = useCallback(
    (data: FilterFormValues) => {
      updateSearchParams({ ...filters, ...data, page: '1' });
      setIsOpen(false);
    },
    [filters, updateSearchParams]
  );

  const onClose = useCallback(() => setIsOpen(false), []);

  const handleReset = useCallback(() => {
    form.reset();
    updateSearchParams({
      ...filters,
      page: '1',
      status: '',
      job_title: '',
      job_level: '',
    });
  }, [filters, form, updateSearchParams]);

  const headers = useMemo(
    () => [
      { label: 'Employee Name' },
      { label: 'Employee Email' },
      { label: 'Job Title' },
      { label: 'Job Level' },
      { label: 'Employee Status' },
      { label: '' },
    ],
    []
  );

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams(
        { ...filters, page: page.toString() },
        { scroll: true }
      );
    },
    [filters, updateSearchParams]
  );

  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px]  text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
        ${
          status?.toLowerCase() === 'active'
            ? 'text-green-600 border-[#89D8A9] bg-[#F5FFFA]'
            : 'text-red-600 border-[#F49E9E] bg-[#FFF5F5]'
        }`}
      >
        {status}
      </span>
    ),
    []
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateSearchParams(
        {
          ...filters,
          employee_name: value,
          page: '1',
        },
        { debounce: 300 }
      );
    },
    [filters, updateSearchParams]
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl mb-10">
        Employee Management
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search employee name"
              value={searchTerm}
              setValue={handleSearchChange}
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

        <button
          className="flex items-center gap-2 bg-primary text-white h-10 px-4 rounded-md text-sm whitespace-nowrap"
          onClick={() => setIsAddEmployeeOpen(true)}
        >
          <span>Add Employee</span>
          <AiOutlinePlus />
        </button>
      </div>

      <div className="mt-5">
        <CustomTable headers={headers} isLoading={isPending}>
          {employees?.length > 0 ? (
            employees.map((row) => (
              <TableRow key={row.id} className="text-[#1D2939] text-sm">
                <TableCell>{row.full_name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.job_title ?? 'N/A'}</TableCell>
                <TableCell>{row.job_level ?? 'N/A'}</TableCell>
                <TableCell>
                  {renderStatusBadge(row.status?.replace('_', ' '))}
                </TableCell>
                <TableCell className="flex justify-center">
                  <Link
                    href={`/employee-mgt/${row.id}`}
                    className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-6 aspect-square rounded"
                    aria-label={`View details for ${row.full_name}`}
                  >
                    <Image
                      src="/assets/warn.svg"
                      alt="info icon"
                      width={15}
                      height={15}
                    />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState
              headers={headers}
              messageTitle="No Employees Added Yet"
              desc="Start by adding employee information to manage their details and payroll"
            />
          )}
        </CustomTable>

        {pagination?.total_pages > 1 && (
          <div className="mt-6">
            <CustomPagination
              totalPages={pagination.total_pages}
              currentPage={+currentPage}
              goToPage={goToPage}
            />
          </div>
        )}

        <FilterDrawer
          isOpen={isOpen}
          onClose={onClose}
          onReset={handleReset}
          form={form}
          onSubmit={onSubmit}
        >
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold pb-2">
                Job Title
              </label>
              <Controller
                name="job_title"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={jobOptions}
                    value={
                      jobOptions.find((opt) => opt.value === field.value) ||
                      null
                    }
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value || '');
                    }}
                    styles={customStyles}
                    placeholder="Select title"
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

            <div>
              <label className="block text-sm font-semibold pb-2">
                Job Level
              </label>
              <Controller
                name="job_level"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={levelOptions}
                    value={
                      levelOptions.find((opt) => opt.value === field.value) ||
                      null
                    }
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value || '');
                    }}
                    styles={customStyles}
                    placeholder="Select Job Level"
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
        <AddEmployee
          open={isAddEmployeeOpen}
          onOpenChange={setIsAddEmployeeOpen}
          onIndividualOnboarding={handleIndividualOnboarding}
          onBulkOnboarding={handleBulkOnboarding}
        />
        <BulkEmployeeUpload
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onUploadComplete={handleUploadComplete}
          maxFileSize={10}
          acceptedFileTypes={['.csv', '.xlsx', '.xls']}
        />
      </div>
    </div>
  );
};

export default EmployeeMgt;
