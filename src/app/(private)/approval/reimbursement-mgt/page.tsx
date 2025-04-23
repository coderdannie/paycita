'use client';

import ReimbursementTable from '@/src/components/data/Approval/ReimbursementTable';
import ApprovalFilter from '@/src/components/modals/ApprovalFilter';
import SearchInput from '@/src/components/ui/SearchInput';
import { useState } from 'react';
import { PiSlidersHorizontal } from 'react-icons/pi';

const Reimbursement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Approval- Reimbursement Management
        </h2>
        <div className="flex mt-10 justify-between items-center gap-2 flex-wrap">
          <div className="h-[40px] max-w-[338px] w-full">
            <SearchInput
              placeholder="Search for relevant details"
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
        <ReimbursementTable />
        <ApprovalFilter isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
};
export default Reimbursement;
