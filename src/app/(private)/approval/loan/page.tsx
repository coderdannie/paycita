"use client";
import React from "react";
import LoanApproval from "./loanApproval";

export default function LoanApprovalPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <LoanApproval />
      </div>
    </div>
  );
}
