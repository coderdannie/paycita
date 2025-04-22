'use client';

import SearchInput from '../../ui/SearchInput';
import { useState, useMemo, useCallback } from 'react';
import { PiSlidersHorizontal } from 'react-icons/pi';
import WalletFilterDrawer from '../../modals/WalletFilterDrawer';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import TableEmptyState from '../../common/TableEmptyState';

const TableLayer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const headers = useMemo(
    () => [
      { label: 'Employee Name' },
      { label: 'Date' },
      { label: 'Transaction Type' },
      { label: 'Amount Type' },
      { label: 'Amount' },
      { label: 'Status' },
    ],
    []
  );

  const walletData = [
    {
      name: 'Bunmi Tanny',
      date: '15/4/25',
      transactionType: 'Reimbursement',
      amountType: 'Debit',
      amount: '5000',
      status: 'Successful',
    },
    {
      name: 'Bunmi Tanny',
      date: '15/4/25',
      transactionType: 'Reimbursement',
      amountType: 'Debit',
      amount: '5000',
      status: 'Successful',
    },
  ];

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] text-center block px-[10px] rounded-md 
            ${
              status === 'successful'
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

  return (
    <div>
      <div>
        <h2 className="text-[#1D2939] pt-6 font-bold text-lg md:text-xl">
          Wallet Transactions
        </h2>
        <div className="flex mt-10 mb-6 justify-between items-center gap-2 flex-wrap">
          <div className="h-[40px] max-w-[338px] w-full">
            <SearchInput
              placeholder="Search transaction"
              value={searchTerm}
              setValue={setSearchTerm}
            />
          </div>
          <button
            className="flex h-[40px] px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
            onClick={() => setIsOpen(true)}
          >
            <span>Filter</span> <PiSlidersHorizontal size={24} />
          </button>
        </div>
        <CustomTable headers={headers}>
          {walletData.length ? (
            walletData.map((row, index) => (
              <TableRow key={index} className="text-[#1D2939] text-sm">
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.transactionType}</TableCell>
                <TableCell>{row.amountType}</TableCell>
                <TableCell>
                  {' '}
                  ₦{Number(row?.amount)?.toLocaleString() || '0.00'}
                </TableCell>
                <TableCell>{renderStatusBadge(row.status)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState headers={headers} />
          )}
        </CustomTable>
        <WalletFilterDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
};
export default TableLayer;
