"use client";

import React, { useState } from "react";
import LeaveRequest from "./(tabs)/EmployeeLeaveTab";
import LeaveType from "./(tabs)/LeaveType";

const tabs = ["Leave Requests", "Leave Type"];

const page = () => {
  const [tab, setTab] = useState(tabs[0]);
  return (
    <div>
      <ul className="pt-5  flex flex-col md:flex-row items-center gap-5 text-sm border-[#E4E7EC] border-b">
        {tabs.map((dat, i) => (
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
      {<div>{tab.includes("Requests") ? <LeaveRequest /> : <LeaveType />}</div>}
    </div>
  );
};

export default page;
