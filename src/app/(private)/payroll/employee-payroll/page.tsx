'use client';

import { useState } from 'react';

import GeneratePayroll from '@/src/components/modals/GeneatePayroll';
import EmployeePayroll from '@/src/components/data/Payroll/EmployeePayroll';
import Tax from '@/src/components/data/Payroll/EmployeePayrollTabs/Tax';
import Pension from '@/src/components/data/Payroll/EmployeePayrollTabs/Pension';
import toast from 'react-hot-toast';
import { useUploadPayroll } from '@/src/hooks/payroll/usePayroll';
import { downloadPayrollTemplate } from '@/src/utils/helper';

const MY_PAYROLL_TABS = ['Salary', 'Tax', 'Pension'];

const EmployeePayRoll = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState(MY_PAYROLL_TABS[0]);

  const headers = [
    {
      label: 'Period',
    },
    {
      label: 'Base Salary',
    },
    {
      label: 'Date',
    },
    {
      label: 'Deductions',
    },
    {
      label: 'Net Salary',
    },

    {
      label: '',
    },
  ];

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

  const handleDownloadTemplate = () => {
    const result = downloadPayrollTemplate();

    if (result.success) {
      toast.success('Payroll template downloaded successfully');
    } else {
      toast.error('Failed to download template. Please try again.');
    }
  };
  return (
    <div>
      <div className="flex  justify-between flex-wrap items-center gap-6  ">
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Payrolls
        </h2>
        {/* <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="gap-2 bg-white border border-gray-300 text-gray-700 h-[40px] px-4 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download payroll template
          </button>
          <button
            className="gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
            onClick={() => setIsOpen(true)}
          >
            Upload Payroll
          </button>
        </div> */}
      </div>
      <ul className="pt-5  flex flex-col md:flex-row items-center gap-5 text-sm border-[#E4E7EC] border-b">
        {MY_PAYROLL_TABS.map((dat, i) => (
          <li
            key={i}
            className={`py-3 cursor-pointer ${
              tab === dat
                ? 'text-primary border-b-[3px] border-primary'
                : 'text-[#667085] '
            }`}
            onClick={() => setTab(dat)}
          >
            <button>{dat}</button>
          </li>
        ))}
      </ul>
      <div className=" mt-9">
        {tab === 'Salary' ? (
          <EmployeePayroll headers={headers} />
        ) : tab === 'Tax' ? (
          <Tax />
        ) : (
          <Pension />
        )}
      </div>

      <GeneratePayroll
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpload={handleUpload}
        isLoading={isUploading}
      />
    </div>
  );
};
export default EmployeePayRoll;
