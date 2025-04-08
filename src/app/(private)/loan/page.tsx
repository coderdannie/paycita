'use client';

import TableLayer from '@/src/components/data/Loan/TableLayer';
import { Button } from '@/src/components/ui/button';
import SearchInput from '@/src/components/ui/SearchInput';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Loan = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">Loan</h2>
      <div className="flex items-center mt-9 justify-between space-x-2">
        <div className="relative flex-grow max-w-xs h-[40px]">
          <SearchInput
            placeholder="Search"
            value={searchTerm}
            setValue={setSearchTerm}
          />
        </div>
        <Button onClick={() => router.push('/loan/request')}>
          Create Loan
        </Button>
      </div>
      <TableLayer />
    </div>
  );
};
export default Loan;
