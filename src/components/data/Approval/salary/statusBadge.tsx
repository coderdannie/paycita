import React from 'react';

export interface StatusBadgeProps {
  status: "approved" | "pending" | "rejected" | string; // Allow unexpected strings too
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<string, string> = {
    Approved: 'gren',
    Pending: 'yello',
    Rejected: 'reid',
  };

  return (
    <span
      className={`px-3 py-2 text-xs font-medium rounded capitalize ${statusConfig[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
