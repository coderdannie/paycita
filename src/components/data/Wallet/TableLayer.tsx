'use client';

import SearchInput from '../../ui/SearchInput';
import { useState, useMemo, useCallback } from 'react';
import { PiSlidersHorizontal } from 'react-icons/pi';
import WalletFilterDrawer from '../../modals/WalletFilterDrawer';
import CustomTable from '../../common/CustomTable';
import { TableCell, TableRow } from '../../ui/table';
import TableEmptyState from '../../common/TableEmptyState';
import { formatDate } from '@/src/utils/helper';

const TableLayer = ({
  walletHistory,
}: {
  walletHistory: Array<{
    description: string;
    created_at: string;
    transaction_type: string;
    amount_type: string;
    amount: string;
    approval_status_id: string;
    expenses_id: string;
    expenses_number: string;
    status: string;
  }>;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const headers = useMemo(
    () => [
      { label: 'Description' },
      { label: 'Date' },
      { label: 'Amount Type' },
      { label: 'Amount' },
      { label: 'Status' },
    ],
    []
  );

  const renderStatusBadge = useCallback((status: string) => {
    return (
      <span
        className={`py-[5px] text-center block px-[10px] rounded-md 
            ${
              status.toLowerCase() === 'success'
                ? 'text-[#008000] bg-[#EDFCED]'
                : status.toLowerCase() === 'pending'
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
          {walletHistory?.length ? (
            walletHistory.map((row, index) => (
              <TableRow key={index} className="text-[#1D2939] text-sm">
                <TableCell>{row.description || '-'}</TableCell>
                <TableCell>{formatDate(row.created_at)}</TableCell>
                <TableCell>{row.transaction_type}</TableCell>

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
