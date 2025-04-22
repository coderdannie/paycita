'Use client';

import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import { Form } from '@/src/components/ui/form';
import { useForm } from 'react-hook-form';
import { CustomFormSelect } from '../common/CustomInput';
import {
  walletFilterSchema,
  WalletFilterSchemaType,
} from '@/src/utils/validations';

const STATUSES = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

const EXPENSE_TYPES = [
  { label: 'Travel', value: 'Travel' },
  { label: 'Office Supplies', value: 'Office Supplies' },
  { label: 'Meals & Entertainment', value: 'Meals & Entertainment' },
  { label: 'Reimbursement', value: 'Reimbursement' },
  { label: 'Software Subscriptions', value: 'Software Subscriptions' },
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Rent', value: 'Rent' },
];

const TRANSACTION_TYPES = [
  { label: 'Reimbursement', value: 'Reimbursement' },
  { label: 'Payment', value: 'Payment' },
  { label: 'Refund', value: 'Refund' },
  { label: 'Adjustment', value: 'Adjustment' },
  { label: 'Deposit', value: 'Deposit' },
  { label: 'Purchase', value: 'Purchase' },
];

interface WalletFilterProps {
  isOpen: boolean;
  onClose: () => void;
}
const WalletFilterDrawer: React.FC<WalletFilterProps> = ({
  isOpen,
  onClose,
}) => {
  const form = useForm<WalletFilterSchemaType>({
    resolver: zodResolver(walletFilterSchema),
    defaultValues: {
      expense_type: '',
      transaction_type: '',
      status: '',
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

  const onSubmit = (data: WalletFilterSchemaType) => {
    console.log('Filtered values:', data);
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
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl z-50 rounded-lg flex flex-col"
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
                    name="expense_type"
                    control={control}
                    items={EXPENSE_TYPES}
                    labelText="Expense Type"
                    holder="Select expense type"
                    error={errors.expense_type?.message}
                  />
                  <CustomFormSelect
                    name="transaction_type"
                    control={control}
                    items={EXPENSE_TYPES}
                    labelText="Transaction Type"
                    holder="Select transaction type"
                    error={errors.transaction_type?.message}
                  />

                  <CustomFormSelect
                    name="status"
                    control={control}
                    items={STATUSES}
                    labelText="Status"
                    holder="Select status"
                    error={errors.status?.message}
                  />
                </form>
              </Form>
            </div>

            {/* Fixed Action Buttons at Bottom */}
            <div className="border-t border-[#E4E7EC] p-4 bg-white">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => form.reset()}
                  //   onClick={handleReset}
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
export default WalletFilterDrawer;
