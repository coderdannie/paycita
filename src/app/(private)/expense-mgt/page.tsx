'use client';

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import ExpenseMgtTable from '@/src/components/data/ExpenseMgt/ExpenseMgtTable';
import AddExpenseDrawer from '@/src/components/modals/AddExpenseDrawer';

const ExpenseMgt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const tableData = [
    {
      requestID: '#0036',
      itemName: 'Office tools',
      quantity: '2',
      totalCost: '1000',
      status: 'pending',
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Expense management
        </h2>
        <div className="flex justify-between flex-wrap items-center gap-6">
          <button
            className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
            onClick={() => setIsOpen(true)}
          >
            <span> Add </span>
            <AiOutlinePlus />
          </button>
        </div>
      </div>
      <ExpenseMgtTable tableData={tableData} />
      <AddExpenseDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
export default ExpenseMgt;
