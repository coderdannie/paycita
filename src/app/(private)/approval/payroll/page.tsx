"use client";
import React, { useState } from "react";
import PayrollTabs from "./payrollTab";

const Page = () => {
  const [activeTab, setActiveTab] = useState("salary");

  // Helper function to get the dynamic title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case "salary":
        return "Approval- Payroll- Salary";
      case "tax":
        return "Approval- Payroll- Tax";
      case "pension":
        return "Approval- Payroll- Pension";
      default:
        return "Approval- Payroll";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {getPageTitle()}
      </h1>
      <PayrollTabs onTabChange={setActiveTab} activeTab={activeTab} />
    </div>
  );
};

export default Page;
