'use client';
import React, { useState, useCallback } from 'react';

import { Search, Settings2 } from 'lucide-react';
import FilterModal from './FilterModal/filterModal';
import { useDashboardSelector } from '@/src/Redux/selectors';
import { Employee } from '@/src/types/dashboard';
import { useDashboard } from '@/src/context/dashboardContext';
import CustomTable from '@/src/components/common/CustomTable';
import { TableCell, TableRow } from '@/src/components/ui/table';
import Image from 'next/image';

const EmployeeTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isDashboardDetailsFetching } = useDashboard();

  const { dashboardDetails } = useDashboardSelector();
  const employees = dashboardDetails?.employee as Employee[];

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [jobLevelFilter, setJobLevelFilter] = useState('All Level');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const toggleFilterModal = useCallback(() => {
    setIsFilterModalOpen((prev) => !prev);
  }, []);

  const applyFilters = useCallback(() => {
    toggleFilterModal();
  }, [toggleFilterModal]);

  const resetFilters = useCallback(() => {
    setJobLevelFilter('All Level');
    setStatusFilter('All Status');
  }, []);

  const filteredEmployees = employees?.filter((emp) => {
    const matchesSearch = emp?.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesJobLevel =
      jobLevelFilter === 'All Level' || emp?.job_level === jobLevelFilter;
    const matchesStatus =
      statusFilter === 'All Status' || emp?.employee_status === statusFilter;

    return matchesSearch && matchesJobLevel && matchesStatus;
  });

  const headers = [
    { label: 'Name' },
    { label: 'Job Title' },
    { label: 'Job Level' },
    { label: 'Status' },
  ];
  return (
    <div className="bg-white h-full shadow rounded-lg w-full max-w-4xl mx-auto relative overflow-hidden">
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-center mt-[1rem] mb-[3rem]">
          <h2 className="text-[1.3rem] font-medium text-black">Employee</h2>
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="relative flex-grow max-w-xs">
            <input
              type="text"
              placeholder="Search employee name"
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-black "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <button
            className="text-[#692E9F] rounded-lg px-4 py-2 flex items-center border border-[#692E9F]"
            onClick={toggleFilterModal}
          >
            Filter <Settings2 className="ml-2" size={19} />
          </button>
        </div>
      </div>
      <div className="p-4 mt-[.5rem] overflow-x-auto">
        <CustomTable headers={headers} isLoading={isDashboardDetailsFetching}>
          {filteredEmployees?.length ? (
            filteredEmployees?.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className=" text-black font-normal text-sm"
              >
                <TableCell className="py-5">
                  <div className="flex items-center gap-3">
                    {row?.full_name}
                  </div>{' '}
                </TableCell>
                <TableCell>{row?.job_title}</TableCell>
                <TableCell>{row?.job_level}</TableCell>
                <TableCell>
                  <span
                    className={`py-[5px] px-[10px] relative border-2 rounded-md cursor-pointer 
                    ${
                      row?.employee_status === 'Active'
                        ? 'text-[#00AA4F] border border-[#89D8A9]'
                        : 'text-[#FFA80A] border border-[#FFD384]'
                    }
                  `}
                  >
                    {row?.employee_status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center py-6">
                <div className="flex flex-col items-center">
                  <Image
                    src="/assets/emptystate.svg"
                    alt="No Attendance Records"
                    className="w-20 h-20 mb-4"
                    width={30}
                    height={30}
                  />
                  <p className="text-lg font-semibold text-gray-700">
                    No Employee Record Yet
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </CustomTable>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={toggleFilterModal}
        jobLevelFilter={jobLevelFilter}
        setJobLevelFilter={setJobLevelFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </div>
  );
};

export default EmployeeTable;
