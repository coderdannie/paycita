"use client";
import React, { useState } from "react";
import MyAppraisalTab from "./MyAppraisalTab";
import AppraisalManagementTab from "../appraisal-management/component-management/AppraisalManagementTab";

type TabValue = "myAppraisal" | "appraisalManagement";

interface TabHeader {
  title: string;
  description: string;
}

interface TabData {
  label: string;
  value: TabValue;
  desc: React.ReactNode;
}

const AppraisalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("myAppraisal");

  const tabHeaders: Record<TabValue, TabHeader> = {
    myAppraisal: {
      title: "Appraisals",
      description:
        "Complete your appraisal by answering the questions honestly.",
    },
    appraisalManagement: {
      title: "Appraisal",
      description: "Track, create, and manage employee appraisals effectively",
    },
  };

  const data: TabData[] = [
    {
      label: "My Appraisal",
      value: "myAppraisal",
      desc: <MyAppraisalTab />,
    },
    {
      label: "Appraisal Management",
      value: "appraisalManagement",
      desc: <AppraisalManagementTab />,
    },
  ];

  const currentHeader = tabHeaders[activeTab];

  const activeContent = data.find((tab) => tab.value === activeTab)?.desc;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-medium">{currentHeader.title}</h2>
        <p className="text-gray-600">{currentHeader.description}</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {data.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`py-2 px-4 text-sm font-medium border-b-2 focus:outline-none transition-colors duration-200 ${
                activeTab === value
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-4">{activeContent}</div>
    </div>
  );
};

export default AppraisalsPage;
