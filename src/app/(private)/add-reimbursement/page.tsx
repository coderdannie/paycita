'use client';

import TableLayer from '@/src/components/data/Reimbursement/TableLayer';
import AddReimbursementDrawer from '@/src/components/modals/AddReimbursementDrawer';
import { Button } from '@/src/components/ui/button';
import SearchInput from '@/src/components/ui/SearchInput';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

const ReimbursementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>
        <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
          Reimbursement
        </h2>
        <div className="flex mt-10 justify-between items-center gap-2 flex-wrap">
          <div className="h-[40px] max-w-[338px] w-full">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              setValue={setSearchTerm}
            />
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            <FaPlus /> <span> Add Reimbursement</span>
          </Button>
        </div>
      </div>
      <AddReimbursementDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <TableLayer />
    </div>
  );
};
export default ReimbursementPage;
