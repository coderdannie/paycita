"use client";

import MyPayrollTable from "@/src/components/data/Payroll/MyPayrollTable";
import Pension from "@/src/components/data/Payroll/MyPayrollTabs/Pension";
import Tax from "@/src/components/data/Payroll/MyPayrollTabs/Tax";
// import { useRouter } from "next/navigation";
import { useState } from "react";

const MY_PAYROLL_TABS = ["Payroll", "Tax", "Pension"];

const MyPayroll = () => {
  const [tab, setTab] = useState(MY_PAYROLL_TABS[0]);

  // const router = useRouter();

  const headers = [
    {
      label: "Period",
    },

    {
      label: "Base Salary",
    },

    {
      label: "Deductions",
    },

    {
      label: "Net Pay",
    },

    {
      label: "Status",
    },

    {
      label: "",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
            Payslips
          </h2>
        </div>
        {/* <button
          className=" bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
          onClick={() => router.push("/payroll/payslips")}
        >
          Generate Payslip
        </button> */}
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
        {tab === "Payroll" ? (
          <MyPayrollTable headers={headers} />
        ) : tab === "Tax" ? (
          <Tax />
        ) : (
          <Pension />
        )}
      </div>
    </div>
  );
};
export default MyPayroll;
