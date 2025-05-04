"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import MyAppraisalTab from "./MyAppraisalTab";
import AppraisalManagementTab from "../appraisal-management/components/AppraisalManagementTab";

type TabValue = "my-appraisal" | "appraisal-management";

interface TabHeader {
  title: string;
  description: string;
}

interface TabData {
  label: string;
  value: TabValue;
  desc: React.ReactNode;
}

const AppraisalsPageComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") as TabValue | null;

  // Initialize state from URL or default to 'my-appraisal'
  const [activeTab, setActiveTab] = useState<TabValue>(
    initialTab && ["my-appraisal", "appraisal-management"].includes(initialTab)
      ? initialTab
      : "my-appraisal"
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", activeTab);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [activeTab, router, searchParams]);

  const tabHeaders: Record<TabValue, TabHeader> = {
    "my-appraisal": {
      title: "Appraisals",
      description:
        "Complete your appraisal by answering the questions honestly.",
    },
    "appraisal-management": {
      title: "Appraisal Management",
      description: "Track, create, and manage employee appraisals effectively",
    },
  };

  const data: TabData[] = [
    {
      label: "My Appraisal",
      value: "my-appraisal",
      desc: <MyAppraisalTab />,
    },
    {
      label: "Appraisal Management",
      value: "appraisal-management",
      desc: <AppraisalManagementTab />,
    },
  ];

  const currentHeader = tabHeaders[activeTab];

  const activeContent = data.find((tab) => tab.value === activeTab)?.desc;

  // Function to handle tab click and update state
  const handleTabClick = (value: TabValue) => {
    setActiveTab(value);
  };

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
              onClick={() => handleTabClick(value)}
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

export default AppraisalsPageComponent;
