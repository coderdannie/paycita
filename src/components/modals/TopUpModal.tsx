'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { topupSchema, TopupSchemaType } from '@/src/utils/validations';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import Image from 'next/image';
import { CustomFormSelect, CustomFormField } from '../common/CustomInput';
import { Form } from '@/src/components/ui/form';

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TopUpModal: React.FC<TopupModalProps> = ({ isOpen, onClose }) => {
  const [topupType, setTopupType] = useState<'airtime' | 'data'>('airtime');
  const form = useForm<TopupSchemaType>({
    resolver: zodResolver(topupSchema),
    defaultValues: {
      networkProvider: '',
      phoneNumber: '',
      amount: '',
      dataPlan: '',
    },
  });

  const { control, formState } = form;

  const { errors } = formState;
  const onSubmit = (data: TopupSchemaType) => {
    console.log(data);
    // Handle form submission
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg p-6 w-96 mx-4">
            {/* Modal Header */}
            <div className="flex justify-end mb-10">
              <button onClick={onClose}>
                <IoMdClose className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="bg-[#F0EAF5] rounded-md text-[#3A1957] border-2 border-[#D1BEE1] p-4">
              <h2 className="text-sm">
                Topup your staff airtime or internet subscriptions from your
                favorite internet providers
              </h2>
            </div>

            {/* Toggle Buttons */}
            <div className="flex space-x-2 mb-4 mt-6">
              <button
                className={`px-4 w-full font-medium gap-2 sm:gap-4 border-2 flex items-center py-2 rounded-md ${
                  topupType === 'airtime'
                    ? 'border-primary text-primary'
                    : 'border-[#E5E5E5]'
                }`}
                onClick={() => setTopupType('airtime')}
              >
                <Image
                  src="/assets/airtime.svg"
                  alt="phone icon"
                  className="w-[25px] sm:w-[40px]"
                  width={100}
                  height={100}
                />
                <span>Airtime</span>
              </button>
              <button
                className={`px-4 w-full font-medium gap-2 sm:gap-4 border-2 flex items-center py-2 rounded-md ${
                  topupType === 'data'
                    ? 'border-primary text-primary'
                    : 'border-[#E5E5E5]'
                }`}
                onClick={() => setTopupType('data')}
              >
                <Image
                  src="/assets/data.svg"
                  alt="phone icon"
                  className="w-[25px] sm:w-[40px]"
                  width={100}
                  height={100}
                />
                <span>Data</span>
              </button>
            </div>

            {/* Form Section */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" grid gap-5"
              >
                <CustomFormSelect
                  name="networkProvider"
                  control={control}
                  items={['MTN', 'Airtel', 'Glo', '9mobile']}
                  labelText="Network Provider"
                  holder="Select Network Provider"
                  error={errors.networkProvider?.message}
                />

                <CustomFormField
                  label="Phone Number"
                  name="phoneNumber"
                  control={control}
                  placeholder="Enter phone number"
                  error={errors.phoneNumber?.message}
                />

                {topupType === 'airtime' && (
                  <CustomFormField
                    label="Amount"
                    name="amount"
                    control={control}
                    placeholder="Enter amount"
                    error={errors.amount?.message}
                  />
                )}

                {topupType === 'data' && (
                  <CustomFormSelect
                    name="dataPlan"
                    control={control}
                    items={['1GB', '2GB', '5GB', '10GB']}
                    labelText="Data Plan"
                    holder="Select Data Plan"
                    error={errors.dataPlan?.message}
                  />
                )}

                {/* Confirm Button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-white rounded-md py-2 mt-4"
                >
                  Confirm
                </button>
              </form>
            </Form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopUpModal;
