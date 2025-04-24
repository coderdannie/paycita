'use client';

import { useCallback, useMemo, useState } from 'react';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import TableEmptyState from '../../common/TableEmptyState';
import { Button } from '@/components/ui/button';
import ExpenseDrawer from '../../modals/ExpenseDrawer';
import RejectModal from '../../modals/RejectModal';

const ExpenseTable = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isShow, setIsShow] = useState(false);
  const handleReject = (comment: string) => {
    console.log('Request rejected with comment:', comment);
  };
  const headers = useMemo(
    () => [
      { label: 'Employee Name' },
      { label: 'Employee Number' },
      { label: 'Total Cost' },
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
      name: 'Bunmi Tanny',
      number: '09074632738',
      totalCost: '100',
      status: 'approved',
    },
    {
      name: 'Bunmi Tanny',
      number: '09074632738',
      totalCost: '100',
      status: 'approved',
    },
    {
      name: 'Bunmi Tanny',
      number: '09074632738',
      totalCost: '100',
      status: 'pending',
    },
  ];

  return (
    <div className="mt-6">
      <CustomTable headers={headers}>
        {leaveData.length ? (
          leaveData.map((row, index) => (
            <TableRow key={index} className="text-[#1D2939] text-sm">
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.number}</TableCell>
              <TableCell>{row.totalCost}</TableCell>
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
      <ExpenseDrawer
        open={isOpen}
        onOpenChange={() => setIsOpen(false)}
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

export default ExpenseTable;
