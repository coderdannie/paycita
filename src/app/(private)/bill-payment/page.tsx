'use client';
import { useState } from 'react';
import NoTransaction from '@/src/components/data/BillPayment/NoTransaction';
import TopUpModal from '@/src/components/modals/TopUpModal';
import SearchInput from '@/src/components/ui/SearchInput';
import { PiSlidersHorizontal } from 'react-icons/pi';
import TransactionsTable from '@/src/components/data/BillPayment/TransactionHistory';

const BillPayment = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const data = [
    {
      'Transaction ID': 'XN12375DFGT...',
      'Transaction Type': 'Airtime',
      Provider: 'MTN',
      Amount: '$10',
      Date: 'Mar 18, 2025',
      Status: 'Successful',
    },
    {
      'Transaction ID': 'XN12375DFGT...',
      'Transaction Type': 'Data',
      Provider: 'Airtel',
      Amount: '$20',
      Date: 'Mar 17, 2025',
      Status: 'Successful',
    },
    {
      'Transaction ID': 'XN12375DFGT',
      'Transaction Type': 'Data',
      Provider: '9Mobile',
      Amount: '$20',
      Date: 'Mar 17, 2025',
      Status: 'Failed',
    },
  ];

  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
        Employee Attendance
      </h2>
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div className="mt-10 flex items-center gap-4 ">
          <div className="h-[40px] max-w-[338px] w-full">
            <SearchInput
              placeholder="Search"
              value={searchTerm}
              setValue={setSearchTerm}
            />
          </div>
          <button
            className="flex h-[40px] px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
            //   onClick={() => setIsDrawerOpen(true)}
          >
            <span>Filter</span> <PiSlidersHorizontal size={24} />
          </button>
        </div>
        <button
          className="bg-primary text-white py-[10px] px-4 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          Buy Now
        </button>
      </div>

      {data.length ? (
        <TransactionsTable tableData={data} />
      ) : (
        <NoTransaction setIsOpen={() => setIsOpen(true)} />
      )}

      <TopUpModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
export default BillPayment;
