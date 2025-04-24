'use client';

import { useCallback, useMemo, useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import TableEmptyState from '../../common/TableEmptyState';
import { Button } from '@/components/ui/button';
import ReimbursementDetails from '../../modals/ReimbursementDetails';
import RejectModal from '../../modals/RejectModal';

const ReimbursementTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const handleReject = (comment: string) => {
    console.log('Request rejected with comment:', comment);
  };

  const headers = useMemo(
    () => [
      { label: 'RN' },
      { label: 'Title' },
      { label: 'Description' },
      { label: 'Employee Name' },
      { label: 'Date' },
      { label: 'Status' },
      { label: 'Action' },
    ],
    []
  );

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] w-[70%] text-center block px-[10px] rounded-md 
        ${
          status === 'approved'
            ? 'text-[#008000] bg-[#EDFCED]'
            : status === 'pending'
            ? 'text-[#5252FF] bg-[#EDEDFB]'
            : 'text-red-600 bg-[#FFF5F5]'
        }`}
      >
        {status}
      </span>
    );
  }, []);

  const leaveData = [
    {
      RN: '#1253',
      title: 'INK',
      description: 'Black color for departmental ink',
      name: 'Bunmi Tanny',
      date: 'April 7 2024',
      status: 'approved',
    },
    {
      RN: '#1253',
      title: 'INK',
      description: 'Black color for departmental ink',
      name: 'Bunmi Tanny',
      date: 'April 7 2024',
      status: 'approved',
    },
    {
      RN: '#1253',
      title: 'INK',
      description: 'Black color for departmental ink',
      name: 'Bunmi Tanny',
      date: 'April 7 2024',
      status: 'approved',
    },
  ];

  return (
    <div className="mt-6">
      <CustomTable headers={headers}>
        {leaveData.length ? (
          leaveData.map((row, index) => (
            <TableRow key={index} className="text-[#1D2939] text-sm">
              <TableCell className="text-primary">{row.RN}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{renderStatusBadge(row.status)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="border-primary"
                  onClick={() => setIsOpen(true)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState headers={headers} />
        )}
      </CustomTable>
      <ReimbursementDetails
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        setIsShow={setIsShow}
      />
      <RejectModal
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        onReject={handleReject}
      />
    </div>
  );
};

export default ReimbursementTable;
