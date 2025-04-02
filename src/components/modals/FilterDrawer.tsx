'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Select, { StylesConfig } from 'react-select';
import { IoClose } from 'react-icons/io5';
import { useEffect, useMemo } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { SingleValue } from '@/src/types/attendance';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employeeAttendance: any[];
  filter: {
    status: string;
    job_title: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  employeeAttendance,
  filter,
  onFilterChange,
  onResetFilters,
}) => {
  // Extract unique job titles from employeeAttendance
  const jobOptions = useMemo(() => {
    const uniqueTitles = new Set<string>();
    employeeAttendance?.forEach((attendance) => {
      if (attendance.job_title) {
        uniqueTitles.add(attendance.job_title);
      }
    });

    return Array.from(uniqueTitles)
      .sort()
      .map((title) => ({ value: title, label: title }));
  }, [employeeAttendance]);

  // Extract unique statuses from employeeAttendance
  const statusOptions = useMemo(() => {
    const uniqueStatuses = new Set<string>();
    employeeAttendance?.forEach((attendance) => {
      if (attendance.status) {
        uniqueStatuses.add(attendance.status);
      }
    });

    // Convert to options array with "All Status" as first option
    return [
      { value: '', label: 'All Status' },
      ...Array.from(uniqueStatuses)
        .sort()
        .map((status) => ({ value: status, label: status })),
    ];
  }, [employeeAttendance]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

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

  const handleJobTitleChange = (selectedOption: any) => {
    onFilterChange('job_title', selectedOption?.value || '');
  };

  const handleStatusChange = (selectedOption: any) => {
    onFilterChange('status', selectedOption?.value || '');
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  const handleApply = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full bg-black z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl z-50 rounded-lg"
          >
            {/* Header */}
            <div className="flex px-6 items-center justify-between border-b border-[#E4E7EC] py-5">
              <h2 className="text-lg font-semibold">Filter</h2>
              <button onClick={onClose}>
                <IoClose className="text-2xl text-[#667085]" />
              </button>
            </div>

            {/* Filters */}
            <div className="pt-5 px-6">
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold !pb-2">
                    Job Title
                  </label>
                  <Select
                    options={jobOptions}
                    value={
                      jobOptions.find(
                        (opt) => opt.value === filter.job_title
                      ) || null
                    }
                    onChange={handleJobTitleChange}
                    styles={customStyles}
                    placeholder="Select Job Title"
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator: () => (
                        <IoIosArrowDown size="15px" color="#667085" />
                      ),
                    }}
                    isClearable
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold !pb-2">
                    Status
                  </label>
                  <Select
                    options={statusOptions}
                    value={
                      statusOptions.find(
                        (opt) => opt.value === filter.status
                      ) || null
                    }
                    onChange={handleStatusChange}
                    styles={customStyles}
                    placeholder="Select Status"
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator: () => (
                        <IoIosArrowDown size="15px" color="#667085" />
                      ),
                    }}
                    isClearable
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between gap-4">
                <button
                  className="flex-1 text-sm font-semibold px-4 py-2 border border-[#EA3D3D] text-[#EA3D3D] rounded-lg"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-primary font-semibold text-sm text-white rounded-lg"
                  onClick={handleApply}
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
