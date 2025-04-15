"use client";
import React from "react";
import AppraisalCard from "./AppraisalCard";

interface Appraisal {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Completed";
}

const MyAppraisalTab: React.FC = () => {
  const appraisals: Appraisal[] = [
    {
      id: "q1-2025-1",
      title: "Q1 Performance Review",
      startDate: "Mar 1, 2025",
      endDate: "Mar 15, 2025",
      status: "Pending",
    },
    {
      id: "q2-2025",
      title: "Q2 Performance Review",
      startDate: "Feb 5, 2025",
      endDate: "Feb 20, 2025",
      status: "Pending",
    },
    {
      id: "q1-2025-2",
      title: "Q1 Performance Review",
      startDate: "Jan 5, 2025",
      endDate: "Jan 20, 2025",
      status: "Completed",
    },
  ];

  return (
    <div className="w-full">
      <div className="space-y-6">
        {appraisals.map((appraisal) => (
          <AppraisalCard key={appraisal.id} appraisal={appraisal} />
        ))}
      </div>
    </div>
  );
};

export default MyAppraisalTab;
