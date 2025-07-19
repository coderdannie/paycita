"use client";
// import React, { useEffect } from "react";
// import LoanApproval from "./loanApproval";
// import { useDashboard } from "@/src/context/dashboardContext";
// import { useDashboardSelector } from "@/src/Redux/selectors";

export default function Page() {
  // const { getLoanApproval, isFetchingLoanApproval } = useDashboard();
  // const { pendingLoan } = useDashboardSelector();

  // useEffect(() => {
  //   // Only fetch if we don't have pending loan data or if it's empty
  //   if (!pendingLoan || pendingLoan.length === 0) {
  //     getLoanApproval();
  //   }
  // }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* <LoanApproval /> */}
      </div>
    </div>
  );
}
