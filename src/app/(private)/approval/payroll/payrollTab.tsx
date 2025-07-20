"use client";
import React, { useState, useEffect } from "react";
import SalaryTabContent from "./salary/salaryTabContent";
import TaxTabContent from "./tax/taxTabContent";
import PensionTabContent from "./pension/pensionTabcontent";

// import SearchInput from "@/components/DashbaordComponents/approval/payroll/salary/searchInput";
// import DropdownSelect from "@/components/DashbaordComponents/approval/payroll/salary/dropdownSelect";
// import { useGetAllApprovals } from "@/api/hooks/approvals/useApprovals";
// import LoadingComponent from "@/components/ui/LoadingComponent";
import SearchInput from "@/src/components/data/Approval/salary/searchInput";
import DropdownSelect from "@/src/components/data/Approval/salary/dropdownSelect";
import { useGetAllApprovals } from "@/src/hooks/approvals/useApprovals";

interface PayrollTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function PayrollTabs({
  activeTab: externalActiveTab,
  onTabChange,
}: PayrollTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("salary");
  //   const [internalIsFilterOpen, setInternalIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPeriod, setCurrentPeriod] = useState("This Month");

  const activeTab =
    externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  //   const isFilterOpen =
  //     externalIsFilterOpen !== undefined
  //       ? externalIsFilterOpen
  //       : internalIsFilterOpen;
  //   const setIsFilterOpen = externalSetIsFilterOpen || setInternalIsFilterOpen;

  const handleTabChange = (tab: string) => {
    if (externalActiveTab === undefined) {
      setInternalActiveTab(tab);
    }
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const periodOptions = [
    { value: "This Month", label: "This Month" },
    { value: "Last Month", label: "Last Month" },
    { value: "Custom", label: "Custom" },
  ];

  const tabs = [
    { id: "salary", label: "Salary" },
    { id: "tax", label: "Tax" },
    { id: "pension", label: "Pension" },
  ];
  const { approvals, isLoading } = useGetAllApprovals(
    "pending-approval-salary-requests"
  );

  const getTabContent = () => {
    switch (activeTab) {
      case "salary":
        return (
          <SalaryTabContent
            // isFilterOpen={isFilterOpen}
            // setIsFilterOpen={setIsFilterOpen}
            salaryData={approvals?.salary || []}
            searchTerm={searchQuery}
          />
        );
      case "tax":
        return (
          <TaxTabContent
            // isFilterOpen={isFilterOpen}
            // setIsFilterOpen={setIsFilterOpen}
            initialTaxData={approvals?.tax || []}
            searchTerm={searchQuery}
          />
        );
      case "pension":
        return (
          <PensionTabContent
            // isFilterOpen={isFilterOpen}
            // setIsFilterOpen={setIsFilterOpen}
            initialPensionData={approvals?.pension || []}
            searchTerm={searchQuery}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Payroll Data...</h2>
          <p className="text-gray-600">
            Please wait while we fetch the latest payroll entries.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between  mb-6 gap-4 ">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full py-4">
          <div className="w-full md:w-auto ">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search employee name"
            />
          </div>
          <div className="w-full md:w-48">
            <DropdownSelect
              value={currentPeriod}
              onChange={setCurrentPeriod}
              options={periodOptions}
            />
          </div>
        </div>

        {/* Generate Payroll button - only visible on Salary tab */}
        {/* {activeTab === "salary" && (
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <button className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800 transition-colors text-sm md:text-base md:min-w-[140px]">
              <FiPlus className="mr-2" />
              <span>Generate Payroll</span>
            </button>
          </div>
        )} */}
      </div>
      {/* Tabs Navigation with Filter Button */}
      <div className="flex flex-wrap items-center gap-4 justify-between mb-4">
        <div className="flex flex-wrap gap-4 sm:gap-6 pb-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pb-2 px-1 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-[#692E9F] border-b-2 border-purple-800"
                  : "text-gray-600 hover:text-purple-600"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="mt-4">{getTabContent()}</div>
    </div>
  );
}
