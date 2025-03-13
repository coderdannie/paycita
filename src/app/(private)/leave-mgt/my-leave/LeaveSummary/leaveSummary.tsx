"use client";

import React from "react";

interface LeaveSummaryProps {
  used: number;
  pending: number;
  rejected: number;
}

const LeaveSummary: React.FC<LeaveSummaryProps> = ({
  used,
  pending,
  rejected,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Used Leave</h3>
        <p className="text-3xl font-bold text-gray-800">{used}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Pending Leave
        </h3>
        <p className="text-3xl font-bold text-gray-800">{pending}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Rejected Leave
        </h3>
        <p className="text-3xl font-bold text-gray-800">{rejected}</p>
      </div>
    </div>
  );
};

export default LeaveSummary;
