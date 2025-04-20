"use client";
import React from "react";
import AppraisalCard from "./AppraisalCard";
import { useGetAppraisals } from "@/src/hooks/appraisal/useAppraisal";



const MyAppraisalTab: React.FC = () => {
  const { appraisals, isLoading, isError } = useGetAppraisals({
    page: "1",
  });

  if (isLoading) {
    return <div>Loading appraisals...</div>;
  }

  if (isError) {
    return <div>Error loading appraisals</div>;
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {appraisals?.map((appraisal) => (
          <AppraisalCard key={appraisal.id} appraisal={appraisal} />
        ))}
      </div>
    </div>
  );
};

export default MyAppraisalTab;
