"use client";
// import React, { useState, useEffect } from "react";
// import PayrollTabs from "./payrollTab";
// import LoadingPage from "@/src/app/loading";
// import { useDashboard } from "@/src/context/dashboardContext";
// import { useDashboardSelector } from "@/src/Redux/selectors";


const Page = () => {
  // const { getPendingPayroll, isFetchingPendingPayroll } = useDashboard();
  // const { pendingPayroll } = useDashboardSelector();
  // const [activeTab, setActiveTab] = useState("salary");
  // const [hasInitialized, setHasInitialized] = useState(false);

  // Helper function to get the dynamic title based on active tab
  const getPageTitle = () => {
    return "Payroll Approval";
  };

  // Handle initial data loading
  // useEffect(() => {
  //   const loadInitialData = async () => {
  //     // Check if we need to fetch data
  //     // We fetch if:
  //     // 1. We haven't initialized yet, OR
  //     // 2. We have no pendingPayroll data at all
  //     if (!hasInitialized) {
  //       await getPendingPayroll(false); // Use cache first
  //       setHasInitialized(true);
  //     }
  //   };

  //   loadInitialData();
  // }, [hasInitialized, getPendingPayroll]);

  // // Show loading page during initial load or when fetching data
  // if (!hasInitialized || (isFetchingPendingPayroll && !pendingPayroll)) {
  //   return <LoadingPage text="Loading Payroll Approval..." />;
  // }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {getPageTitle()}
      </h1>
      {/* <PayrollTabs onTabChange={setActiveTab} /> */}
    </div>
  );
};

export default Page;
