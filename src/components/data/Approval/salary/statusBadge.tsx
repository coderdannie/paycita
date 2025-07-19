import React from 'react';

interface StatusBadgeProps {
  status: 'Approved' | 'Pending' | 'Rejected';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
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
