'use client';

import SearchInput from '@/src/components/ui/SearchInput';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import MonthlyPayrollTable from '@/src/components/data/Payroll/MonthlyPayrollTable';
import { AiOutlinePlus } from 'react-icons/ai';
import GeneratePayroll from '@/src/components/modals/GeneatePayroll';
import { usePathname } from 'next/navigation';
import {
  useGetPayRollByMonth,
  useUploadPayroll,
} from '@/src/hooks/payroll/usePayroll';
import toast from 'react-hot-toast';

const SingleTablePayroll = () => {
  const pathname = usePathname();
  const date = pathname.split('/').pop();
  const [searchTerm, setSearchTerm] = useState('');

  const payload = {
    date: date,
  };

  const { payrollByMonthData } = useGetPayRollByMonth(payload);

  const [status, setStatus] = useState('This Month');

  const [isOpen, setIsOpen] = useState(false);

  const { mutate: mutateUploadPayroll, isPending: isUploading } =
    useUploadPayroll();

  const handleUpload = (file: File) => {
    if (!file) return;
    const formData = new FormData();

    formData.append('payroll', file);

    mutateUploadPayroll(formData, {
      onSuccess: () => {
        toast.success('Payroll uploaded successfully');
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error('Error uploading payroll: ' + error.message);
      },
    });
  };

  return (
    <div>
      <div className="flex  justify-between flex-wrap items-center gap-6 mt-10 ">
        <div className="flex md:items-center flex-col sm:flex-row gap-4 ">
          <div className="h-[40px] max-w-[438px] w-full">
            <SearchInput
              placeholder="Search employee name"
              value={searchTerm}
              setValue={setSearchTerm}
            />
          </div>
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={status} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {['This Month', 'Last week'].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
          onClick={() => setIsOpen(true)}
        >
          <span>Upload Payroll</span>
          <AiOutlinePlus />
        </button>
      </div>
      <MonthlyPayrollTable payrollByMonthData={payrollByMonthData} />

      <GeneratePayroll
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpload={handleUpload}
        isLoading={isUploading}
      />
    </div>
  );
};
export default SingleTablePayroll;
