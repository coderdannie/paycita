"use client";

import { useState } from "react";

import GeneratePayroll from "@/src/components/modals/GeneatePayroll";
import EmployeePayroll from "@/src/components/data/Payroll/EmployeePayroll";
import Tax from "@/src/components/data/Payroll/EmployeePayrollTabs/Tax";
import Pension from "@/src/components/data/Payroll/EmployeePayrollTabs/Pension";
import toast from "react-hot-toast";
import { useUploadPayroll } from "@/src/hooks/payroll/usePayroll";

const MY_PAYROLL_TABS = ["Salary", "Tax", "Pension"];

const EmployeePayRoll = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState(MY_PAYROLL_TABS[0]);

  const headers = [
    {
      label: "Period",
    },
    {
      label: "Base Salary",
    },
    {
      label: "Date",
    },
    {
      label: "Deductions",
    },
    {
      label: "Net Pay",
    },

    {
      label: "",
    },
  ];

  const { mutate: mutateUploadPayroll, isPending: isUploading } =
    useUploadPayroll();

  const handleUpload = (file: File) => {
    if (!file) return;
    const formData = new FormData();

    formData.append("payroll", file);

    mutateUploadPayroll(formData, {
      onSuccess: () => {
        toast.success("Payroll uploaded successfully");
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error("Error uploading payroll: " + error.message);
      },
    });
  };
  return (
    <div>
      <div className="flex  justify-between flex-wrap items-center gap-6  ">
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Payrolls
        </h2>
        <button
          className="gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
          onClick={() => setIsOpen(true)}
        >
          Upload Payroll
        </button>
      </div>
      <ul className="pt-5  flex flex-col md:flex-row items-center gap-5 text-sm border-[#E4E7EC] border-b">
        {MY_PAYROLL_TABS.map((dat, i) => (
          <li
            key={i}
            className={`py-3 cursor-pointer ${
              tab === dat
                ? "text-primary border-b-[3px] border-primary"
                : "text-[#667085] "
            }`}
            onClick={() => setTab(dat)}
          >
            <button>{dat}</button>
          </li>
        ))}
      </ul>
      <div className=" mt-9">
        {tab === "Salary" ? (
          <EmployeePayroll headers={headers} />
        ) : tab === "Tax" ? (
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
