'Use client';

import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import Calendar from 'react-calendar';
import { CustomFormSelect } from '../common/CustomInput';
import { formatDate } from '@/src/utils/helper';
import {
  approvalFilterSchema,
  ApprovalFilterSchemaType,
} from '@/src/utils/validations';
import { IoClose } from 'react-icons/io5';
import { Form } from '@/src/components/ui/form';
import { useForm } from 'react-hook-form';

const LEAVE_TYPES = [
  { label: 'Sick leave', value: 'Sick leave' },
  { label: 'Casual leave', value: 'Casual leave' },
  { label: 'Annual leave', value: 'Annual leave' },
];

const STATUSES = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

interface ApprovalFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ApprovalFilterSchemaType) => void;
  currentFilters?: ApprovalFilterSchemaType;
  handleResetFilters: () => void;
}

const ApprovalFilter: React.FC<ApprovalFilterProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
  handleResetFilters,
}) => {
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const form = useForm<ApprovalFilterSchemaType>({
    resolver: zodResolver(approvalFilterSchema),
    defaultValues: {
      leave_type: currentFilters?.leave_type || '',
      status: currentFilters?.status || '',
      start_date: currentFilters?.start_date || '',
      end_date: currentFilters?.end_date || '',
    },

    mode: 'onTouched',
  });

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = form;

  const start_date = watch('start_date');
  const end_date = watch('end_date');

  const handleStartDateChange = (value: Date | null) => {
    if (value instanceof Date) {
      setValue('start_date', formatDate(value), { shouldValidate: true });
      setShowStartDate(false);
    }
  };

  const handleEndDateChange = (value: Date | null) => {
    if (value instanceof Date) {
      setValue('end_date', formatDate(value), { shouldValidate: true });
      setShowEndDate(false);
    }
  };

  const onSubmit = (data: ApprovalFilterSchemaType) => {
    onApplyFilters(data);
  };

  const handleReset = useCallback(() => {
    setValue('leave_type', '');
    setValue('status', '');
    setValue('start_date', '');
    setValue('end_date', '');
    onClose();
    handleResetFilters();
  }, [handleResetFilters, onClose, setValue]);

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
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-[350px] bg-white shadow-xl z-50 rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex px-6 items-center justify-between border-b border-[#E4E7EC] py-5">
              <h2 className="text-lg font-semibold">Filter</h2>
              <button onClick={onClose} aria-label="Close filter drawer">
                <IoClose className="text-2xl text-[#667085]" />
              </button>
            </div>

            {/* Filters Form - Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 mt-5">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="relative space-y-6"
                >
                  <CustomFormSelect
                    name="leave_type"
                    control={control}
                    items={LEAVE_TYPES}
                    labelText="Leave Type"
                    holder="Select leave type"
                    error={errors.leave_type?.message}
                  />

                  <CustomFormSelect
                    name="status"
                    control={control}
                    items={STATUSES}
                    labelText="Status"
                    holder="Select status"
                    error={errors.status?.message}
                  />

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1 text-[#1D2939]">
                      Start Date
                    </label>
                    <input
                      readOnly
                      value={start_date}
                      onClick={() => setShowStartDate(true)}
                      className="w-full border px-3 py-2 rounded-md"
                      placeholder="Select start date"
                    />
                    {errors.start_date && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.start_date.message}
                      </p>
                    )}
                    {showStartDate && (
                      <div className="absolute z-50 mt-2">
                        <Calendar
                          onChange={(value) =>
                            handleStartDateChange(value as Date)
                          }
                          value={start_date ? new Date(start_date) : new Date()}
                          tileClassName={({ date }) =>
                            date.getDay() === 0 || date.getDay() === 6
                              ? 'weekend'
                              : ''
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">
                      End Date
                    </label>
                    <input
                      readOnly
                      value={end_date}
                      onClick={() => setShowEndDate(true)}
                      className="w-full border px-3 py-2 rounded-md"
                      placeholder="Select end date"
                    />
                    {errors.end_date && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.end_date.message}
                      </p>
                    )}
                    {showEndDate && (
                      <div className="absolute z-50 mt-2">
                        <Calendar
                          onChange={(value) =>
                            handleEndDateChange(value as Date)
                          }
                          value={end_date ? new Date(end_date) : new Date()}
                          tileClassName={({ date }) =>
                            date.getDay() === 0 || date.getDay() === 6
                              ? 'weekend'
                              : ''
                          }
                        />
                      </div>
                    )}
                  </div>
                </form>
              </Form>
            </div>

            {/* Fixed Action Buttons at Bottom */}
            <div className="border-t border-[#E4E7EC] p-4 bg-white">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2 border border-[#EA3D3D] text-[#EA3D3D] font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="flex-1 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
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

export default ApprovalFilter;
