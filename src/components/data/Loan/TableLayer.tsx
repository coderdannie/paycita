'use client';

import Image from 'next/image';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import TableEmptyState from '../../common/TableEmptyState';
import { useCallback, useState } from 'react';
import LoanDetails from '../../modals/LoanDetails';

const TableLayer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };
  const headers = [
    {
      label: 'Loan No',
    },

    {
      label: 'Loan Amount',
    },
    {
      label: 'Loan Period',
    },
    {
      label: 'Outstanding',
    },
    {
      label: 'Total Payment',
    },
    {
      label: 'Status',
    },
    {
      label: '',
    },
  ];

  const renderStatusBadge = useCallback(
    (status: string) => (
      <span
        className={`py-[5px] w-[50%] text-center block px-[10px] relative border-2 rounded-md cursor-pointer 
        ${
          status === 'pending'
            ? 'text-[#FFA80A] border-[#FFD384] bg-[#FFFF]'
            : 'text-[#3D7AEA] border-[#3D7AEA] bg-[#FFFF]'
        }`}
      >
        {status}
      </span>
    ),
    []
  );

  return (
    <div className="mt-[20px]">
      <CustomTable headers={headers}>
        {['', '']?.length ? (
          ['', ''].map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-[#1D2939] text-sm">
              <TableCell className="py-5">
                <div className="flex gap-2">
                  <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>{' '}
                  89765
                </div>
              </TableCell>
              <TableCell>₦20,000</TableCell>
              <TableCell>4 months</TableCell>
              <TableCell className="text-[#EA3D3D]">₦10,000</TableCell>
              <TableCell>₦10,000</TableCell>
              <TableCell>{renderStatusBadge('pending')}</TableCell>
              <TableCell
                className="cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <Image
                  src="/assets/warn.svg"
                  alt="info icon"
                  width={15}
                  height={15}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState headers={headers} />
        )}
      </CustomTable>
      <LoanDetails isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};
export default TableLayer;
