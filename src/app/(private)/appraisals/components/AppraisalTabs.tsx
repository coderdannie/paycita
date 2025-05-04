"use client";
import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import MyAppraisalTab from "./MyAppraisalTab";
import AppraisalManagementTab from "../appraisal-management/components/AppraisalManagementTab";

export function AppraisalTabs() {
  const [activeTab, setActiveTab] = React.useState("myAppraisal");

  const data = [
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

  const handlePointerEvent = React.useCallback(() => {}, []);

  return (
    <Tabs value={activeTab}>
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 text-sm inline-flex w-auto"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-primary shadow-none rounded-none",
        }}
        placeholder=""
        onPointerEnterCapture={handlePointerEvent}
        onPointerLeaveCapture={handlePointerEvent}
      >
        {data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => setActiveTab(value)}
            className={`${
              activeTab === value ? "text-primary" : ""
            } py-2 px-4 mx-0 whitespace-nowrap`}
            placeholder=""
            onPointerEnterCapture={handlePointerEvent}
            onPointerLeaveCapture={handlePointerEvent}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody
        placeholder=""
        onPointerEnterCapture={handlePointerEvent}
        onPointerLeaveCapture={handlePointerEvent}
      >
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            {desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}

export default AppraisalTabs;
