'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  reimbursementFormSchema,
  reimbursementFormSchemaType,
} from '@/src/utils/validations';
import { CustomFormField } from '@/src/components/common/CustomInput';
import { LuHardDriveUpload } from 'react-icons/lu';
import { Form } from '@/src/components/ui/form';
import Calendar from 'react-calendar';
import { formatDate } from '@/src/utils/helper';
import { Button } from '../ui/button';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddReimbursementDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const [showDate, setShowDate] = useState(false);
  const form = useForm<reimbursementFormSchemaType>({
    resolver: zodResolver(reimbursementFormSchema),
    defaultValues: {
      amount: '',
      date_of_purchase: '',
      item_description: '',
      reason_for_payment: '',
      proof_of_payment: null,
    },
  });

  const { control, handleSubmit, formState, setValue, watch } = form;
  const { errors } = formState;
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUploaded(true); // Set to true when file is uploaded
      // Wrap the file into a FileList (since FileList is an array-like object)
      const fileList = new DataTransfer(); // Create a new DataTransfer object
      fileList.items.add(file); // Add the file to the DataTransfer object

      setValue('proof_of_payment', fileList.files); // Update form value with the FileList
    }
  };

  // Handle escape key and body overflow
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const onSubmit = (data: reimbursementFormSchemaType) => {
    console.log(data);
    onClose();
  };

  const date_of_purchase = watch('date_of_purchase');
  const handleDateChange = (value: Date | null) => {
    if (value instanceof Date) {
      setValue('date_of_purchase', formatDate(value), {
        shouldValidate: true,
      });
      setShowDate(false);
    }
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
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-xl z-50 rounded-lg flex flex-col pb-5"
          >
            {/* Header */}
            <div className="flex px-6 items-center justify-between border-b border-[#E4E7EC] py-5">
              <h2 className="text-lg font-semibold">New Reimbursement</h2>
              <button onClick={onClose} aria-label="Close filter drawer">
                <IoClose className="text-2xl text-[#667085]" />
              </button>
            </div>

            {/* Form Section */}
            <div className="px-6 py-4">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <CustomFormField
                    label="Amount"
                    name="amount"
                    control={control}
                    placeholder="Enter amount"
                    error={errors.amount?.message}
                  />

                  <div className="relative">
                    <label className="capitalize font-semibold text-sm text-[#1D2939] block pb-1">
                      Date of Purchase
                    </label>
                    <input
                      readOnly
                      value={date_of_purchase}
                      onClick={() => setShowDate(true)}
                      className="w-full border px-3 py-2 rounded-md placeholder:text-xs"
                      placeholder="Select Date of Purchase"
                    />
                    {errors.date_of_purchase && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.date_of_purchase.message}
                      </p>
                    )}
                    {showDate && (
                      <div className="absolute z-50 mt-2">
                        <Calendar
                          onChange={(value) => handleDateChange(value as Date)}
                          value={
                            date_of_purchase
                              ? new Date(date_of_purchase)
                              : new Date()
                          }
                        />
                      </div>
                    )}
                  </div>

                  <CustomFormField
                    label="Item Description"
                    name="item_description"
                    control={control}
                    placeholder="Enter item description"
                    error={errors.item_description?.message}
                  />

                  <CustomFormField
                    label="Reason for Payment"
                    name="reason_for_payment"
                    control={control}
                    placeholder="Enter reason"
                    error={errors.reason_for_payment?.message}
                  />

                  {/* File Upload Section */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-semibold cursor-pointer text-sm"
                      id="file"
                    >
                      Upload Proof of Payment
                      <div
                        className={`flex text-xs ${
                          fileUploaded && 'justify-between'
                        }items-center border px-3 py-4 rounded-md border-[#E4E7EC] border-dashed mt-2 gap-2`}
                      >
                        <LuHardDriveUpload size={20} />
                        <span className="text-[#3A3A3A]">
                          {fileUploaded
                            ? 'Uploaded'
                            : 'Attach the purchase receipt of the reimbursement'}
                        </span>
                        <input
                          id="file"
                          type="file"
                          className="ml-2 hidden"
                          onChange={handleFileChange}
                          accept="image/*,application/pdf"
                        />
                        <button className="border border-[#E4E7EC80] text-sm text-[#3A3A3A80]">
                          Browse
                        </button>
                      </div>
                      {errors.proof_of_payment && (
                        <p className="text-red-500 text-sm">
                          {errors.proof_of_payment?.message}
                        </p>
                      )}{' '}
                    </label>
                  </div>

                  <div className="flex  gap-4 md:justify-end h-[40px]">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-full font-semibold "
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!form.formState.isValid}>
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddReimbursementDrawer;
