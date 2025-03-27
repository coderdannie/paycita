'use client';

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import ProcurementTable from '@/src/components/data/Procurement/ProcurementTable';
import AddProcurement from '@/src/components/modals/AddProcurementDrawer';
import ProcurementDetailDrawer from '@/src/components/modals/ProcurementDetailsDrawer';

const Procurement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);
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
          Procurement
        </h2>
        <div className="flex justify-between flex-wrap items-center gap-6">
          <button
            className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md  text-sm"
            onClick={() => setIsOpen(true)}
          >
            <AiOutlinePlus />
            <span> Add Procurement</span>
          </button>
        </div>
      </div>
      <ProcurementTable tableData={tableData} setIsShow={setIsShow} />
      <AddProcurement isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ProcurementDetailDrawer
        isOpen={isShow}
        onClose={() => setIsShow(false)}
      />
    </>
  );
};
export default Procurement;
