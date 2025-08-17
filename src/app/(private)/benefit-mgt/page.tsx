'use client';

import SearchInput from '@/src/components/ui/SearchInput';
import CustomTable from '@/src/components/common/CustomTable';
import { TableCell, TableRow } from '@/src/components/ui/table';
import TableEmptyState from '@/src/components/common/TableEmptyState';
import AddBenefitModal from '@/src/components/modals/AddBenefitModal';
import FilterDrawer from '@/src/components/common/FilterDrawer';
import { useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { SingleValue } from '@/src/types/attendance';
import { PiSlidersHorizontal } from 'react-icons/pi';
import { AiOutlinePlus } from 'react-icons/ai';
import { HiOutlinePencil } from 'react-icons/hi2';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoIosArrowDown } from 'react-icons/io';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { DeleteModal } from '@/src/components/modals/DeleteLoanPolicy';
import toast from 'react-hot-toast';
import {
  benefitNameOptions,
  benefitTypeOptions,
  renewalCycleOptions,
  unitOptions,
} from '@/src/components/common/constants';
import {
  useAddBenefit,
  useGetBenefits,
  useUpdateBenefit,
  useDeleteBenefit,
} from '@/src/hooks/benefit-mgt/useBenefit';

import CustomPagination from '@/src/components/common/pagination/Pagination';
import { BenefitFormData } from '@/src/types/dashboard';

interface Benefit {
  id: string;
  benefit_name: string;
  description: string;
  benefit_type: string;
  unit: string;
  allocation: string;
  recurring: string;
}

interface FilterFormValues {
  benefit_name: string;
  benefit_type: string;
  unit: string;
  recurring: string;
}

// Filter options

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

const BenefitMgt = () => {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  // Get query params with defaults
  const search = searchParams.get('search') || '';
  const benefitName = searchParams.get('benefit_name') || '';
  const benefitType = searchParams.get('benefit_type') || '';
  const unit = searchParams.get('unit') || '';
  const recurring = searchParams.get('recurring') || '';
  const currentPage = searchParams.get('page') || '1';

  const [searchTerm, setSearchTerm] = useState(search);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddBenefitOpen, setIsAddBenefitOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [benefitToDelete, setBenefitToDelete] = useState<Benefit | null>(null);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const headers = useMemo(
    () => [
      { label: 'Benefit Name' },
      { label: 'Description' },
      { label: 'Type' },
      { label: 'Unit' },
      { label: 'Unit Default Allocation' },
      { label: 'Renewal Cycle' },
      { label: 'Action' },
    ],
    []
  );

  const {
    benefits,
    pagination,
    isLoading: isPending,
  } = useGetBenefits({
    page: currentPage.toString(),
  });

  const { mutateAddBenefit, isPending: isAdding } = useAddBenefit();

  const { mutate: mutateUpdateBenefit, isPending: isUpdating } =
    useUpdateBenefit();

  const { mutate: mutateDeleteBenefit, isPending: isDeleting } =
    useDeleteBenefit();

  const filters = useMemo(
    () => ({
      search: searchTerm,
      benefit_name: benefitName,
      benefit_type: benefitType,
      unit: unit,
      recurring: recurring,
    }),
    [searchTerm, benefitName, benefitType, unit, recurring]
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

  const form = useForm<FilterFormValues>({
    defaultValues: {
      benefit_name: benefitName,
      benefit_type: benefitType,
      unit: unit,
      recurring: recurring,
    },
  });

  const onSubmit = useCallback(
    (data: FilterFormValues) => {
      updateSearchParams({ ...filters, ...data });
      setIsFilterOpen(false);
    },
    [filters, updateSearchParams]
  );

  const onClose = useCallback(() => setIsFilterOpen(false), []);

  const handleReset = useCallback(() => {
    form.reset();
    updateSearchParams({
      search: searchTerm,
      benefit_name: '',
      benefit_type: '',
      unit: '',
      recurring: '',
    });
  }, [form, updateSearchParams, searchTerm]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateSearchParams(
        {
          ...filters,
          search: value,
        },
        { debounce: 300 }
      );
    },
    [filters, updateSearchParams]
  );

  const handleAddBenefit = useCallback(
    (formData: BenefitFormData) => {
      if (isEditMode && editingBenefit) {
        mutateUpdateBenefit(
          {
            id: editingBenefit.id,
            benefit_name: formData.benefit_name,
            description: formData.description,
            benefit_type: formData.benefit_type,
            unit: formData.unit,
            allocation: formData.allocation,
            recurring: formData.recurring,
          },
          {
            onSuccess: () => {
              setIsEditMode(false);
              setEditingBenefit(null);
              setIsAddBenefitOpen(false);
            },
          }
        );
      } else {
        // Create new benefit
        mutateAddBenefit(
          {
            benefit_name: formData.benefit_name,
            description: formData.description,
            benefit_type: formData.benefit_type,
            unit: formData.unit,
            allocation: formData.allocation,
            recurring: formData.recurring,
          },
          {
            onSuccess: () => {
              toast.success('Benefit added successfully!');
              setIsEditMode(false);
              setEditingBenefit(null);
              setIsAddBenefitOpen(false);
            },
          }
        );
      }
    },
    [isEditMode, editingBenefit, mutateUpdateBenefit, mutateAddBenefit]
  );

  const handleDeleteBenefit = (benefit: Benefit) => {
    setBenefitToDelete(benefit);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!benefitToDelete) return;
    mutateDeleteBenefit(benefitToDelete.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setBenefitToDelete(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBenefitToDelete(null);
  };

  // Handle edit benefit
  const handleEditBenefit = useCallback((benefit: Benefit) => {
    setEditingBenefit(benefit);
    setIsEditMode(true);
    setIsAddBenefitOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsAddBenefitOpen(false);
    setIsEditMode(false);
    setEditingBenefit(null);
  }, []);

  const formatLabel = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl mb-10">
        Benefit Management
      </h2>
      <p className="my-6 font-medium text-xl">Benefit List </p>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full h-10 sm:w-64">
            <SearchInput
              placeholder="Search for benefit list"
              value={searchTerm}
              setValue={handleSearchChange}
            />
          </div>
          <button
            className="flex w-fit h-10 px-3 gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary whitespace-nowrap"
            onClick={() => setIsFilterOpen(true)}
          >
            <span>Filter</span>
            <PiSlidersHorizontal size={20} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 bg-primary text-white h-10 px-4 rounded-md text-sm whitespace-nowrap"
            onClick={() => setIsAddBenefitOpen(true)}
          >
            <span>Create Benefit</span>
            <AiOutlinePlus />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <CustomTable headers={headers} isLoading={isPending}>
          {benefits?.length > 0 ? (
            benefits.map((benefit: Benefit) => (
              <TableRow key={benefit.id} className="text-[#1D2939] text-sm">
                <TableCell className="font-medium">
                  {formatLabel(benefit.benefit_name)}
                </TableCell>
                <TableCell>{benefit.description}</TableCell>
                <TableCell>{benefit.benefit_type}</TableCell>
                <TableCell className="capitalize">{benefit.unit}</TableCell>
                <TableCell>{benefit.allocation}</TableCell>
                <TableCell>{benefit.recurring}</TableCell>
                <TableCell className="flex ">
                  <div className="flex items-center gap-2">
                    <button
                      className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-8 h-8 rounded hover:border-primary transition-colors"
                      aria-label={`Edit ${benefit.benefit_name}`}
                      onClick={() => handleEditBenefit(benefit)}
                    >
                      <HiOutlinePencil
                        size={16}
                        className="text-gray-600 hover:text-primary"
                      />
                    </button>

                    <button
                      className="border-2 grid place-items-center cursor-pointer border-[#E4E7EC] w-8 h-8 rounded hover:border-red-500 transition-colors"
                      aria-label={`Delete ${benefit.benefit_name}`}
                      onClick={() => handleDeleteBenefit(benefit)}
                      disabled={isDeleting}
                    >
                      <RiDeleteBin6Line
                        size={16}
                        className="text-gray-600 hover:text-red-500"
                      />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState
              headers={headers}
              messageTitle="No Benefits Added Yet"
              desc="Start by adding benefit information to manage employee benefits"
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
        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={onClose}
          onReset={handleReset}
          form={form}
          onSubmit={onSubmit}
        >
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold pb-2">
                Benefit Name
              </label>
              <Controller
                name="benefit_name"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={benefitNameOptions}
                    value={
                      benefitNameOptions.find(
                        (opt) => opt.value === field.value
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value || '');
                    }}
                    styles={customStyles}
                    placeholder="Select benefit name"
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
              <label className="block text-sm font-semibold pb-2">Type</label>
              <Controller
                name="benefit_type"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={benefitTypeOptions}
                    value={
                      benefitTypeOptions.find(
                        (opt) => opt.value === field.value
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value || '');
                    }}
                    styles={customStyles}
                    placeholder="Select benefit type"
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
              <label className="block text-sm font-semibold pb-2">Unit</label>
              <Controller
                name="unit"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={unitOptions}
                    value={
                      unitOptions.find((opt) => opt.value === field.value) ||
                      null
                    }
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value || '');
                    }}
                    styles={customStyles}
                    placeholder="Select unit"
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
                Renewal Cycle
              </label>
              <Controller
                name="recurring"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={renewalCycleOptions}
                    value={
                      renewalCycleOptions.find(
                        (opt) => opt.value === field.value
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value || '');
                    }}
                    styles={customStyles}
                    placeholder="Select renewal cycle"
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

        {/* Add/Edit Benefit Modal */}
        <AddBenefitModal
          isOpen={isAddBenefitOpen}
          onClose={handleModalClose}
          onSubmit={handleAddBenefit}
          isAdding={isUpdating || isAdding}
          isEditMode={isEditMode}
          editingBenefit={editingBenefit}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          title="Delete Benefit"
          description={`Are you sure you want to delete this benefit ? This action cannot be undone.`}
          onCancel={handleCancelDelete}
          onDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default BenefitMgt;
