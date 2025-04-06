'use client';
import CustomTable from '@/src/components/common/CustomTable';
import TableEmptyState from '@/src/components/common/TableEmptyState';
import { TableCell, TableRow } from '@/src/components/ui/table';
import { useMemo, useState } from 'react';
import SearchInput from '@/src/components/ui/SearchInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

const ViewSinglePension = () => {
  const [status, setStatus] = useState('This Month');

  const headers = useMemo(
    () => [{ label: 'Staff Name' }, { label: 'Amount Paid' }],
    []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const cards = ['Total Pension', 'Total Staff'];

  return (
    <div className="px-2 sm:px-0">
      {' '}
      {/* Added horizontal padding for mobile */}
      <div className="flex items-center gap-1 text-sm sm:text-base">
        <span className="text-primary ">Pension</span>/
        <span className="text-[#667085]">ARM Pension </span>
      </div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-xl pt-3 sm:pt-5 pb-4 sm:pb-8">
        ARM Pension
      </h2>
      {/* Cards Section - Changed to flex with wrap for better mobile behavior */}
      <div className="flex flex-wrap gap-3 sm:gap-5">
        {cards.map((dat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl w-full sm:w-[calc(50%-20px)] border border-[#E4E7EC] text-center flex flex-col items-center justify-center p-4 min-h-[90px] sm:h-[106px]"
          >
            <h4 className="font-bold text-lg sm:text-xl">
              {i === 0 ? '₦25,000,000' : '34'}
            </h4>
            <p className="text-xs sm:text-sm text-[#667085]">{dat}</p>
          </div>
        ))}
      </div>
      {/* Search and Filter Section - Changed to column layout on mobile */}
      <div className="flex flex-wrap items-center sm:flex-row gap-3 sm:gap-6 mt-6 sm:mt-8 mb-6">
        <div className="h-[40px]  ">
          <SearchInput
            placeholder="Search employee name"
            value={searchTerm}
            setValue={setSearchTerm}
          />
        </div>
        <div className="h-[40px]  ">
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="bg-white w-full sm:w-auto">
              <SelectValue placeholder={status} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {['This Month', 'Last week'].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Table Section - Added overflow container */}
      <div className="overflow-x-auto">
        <CustomTable headers={headers}>
          {['', '', '', '']?.length ? (
            ['', '', '', ''].map((row, rowIndex) => (
              <TableRow key={rowIndex} className="text-[#1D2939] text-sm">
                <TableCell className="py-3 sm:py-5">
                  <div className="flex gap-3 sm:gap-6 items-center">
                    <div className="border-2 border-[#E4E7EC] w-5 h-5 rounded bg-white"></div>
                    Jan 14
                  </div>
                </TableCell>
                <TableCell>₦25,000,000</TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState
              headers={headers}
              messageTitle="No Data Available"
              desc="There are no records to display at the moment."
            />
          )}
        </CustomTable>
      </div>
    </div>
  );
};
export default ViewSinglePension;
