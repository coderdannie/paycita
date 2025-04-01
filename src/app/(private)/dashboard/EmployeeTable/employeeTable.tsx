'use client';
import React, { useState, useCallback } from 'react';
// import { Search, Info, ChevronsUpDown, Settings2 } from 'lucide-react';
import { Search, Settings2 } from 'lucide-react';
import FilterModal from './FilterModal/filterModal';
import { useDashboardSelector } from '@/src/Redux/selectors';
import { Employee } from '@/src/types/dashboard';
import { useDashboard } from '@/src/context/dashboardContext';
import CustomTable from '@/src/components/common/CustomTable';
import { TableCell, TableRow } from '@/src/components/ui/table';
import Image from 'next/image';

const EmployeeTable = () => {
  // const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isDashboardDetailsFetching } = useDashboard();

  const { dashboardDetails } = useDashboardSelector();
  const employees = dashboardDetails?.employee as Employee[];

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [jobLevelFilter, setJobLevelFilter] = useState('All Level');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // const toggleEmployeeSelect = useCallback((id: string) => {
  //   setSelectedEmployees((prev) =>
  //     prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
  //   );
  // }, []);

  // const isAllSelected = selectedEmployees.length === employees.length;

  // const toggleSelectAll = useCallback(() => {
  //   setSelectedEmployees(
  //     isAllSelected ? [] : employees.map((emp) => emp.employee_status)
  //   );
  // }, [isAllSelected, employees]);

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
    const matchesSearch = emp.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesJobLevel =
      jobLevelFilter === 'All Level' || emp.job_level === jobLevelFilter;
    const matchesStatus =
      statusFilter === 'All Status' || emp.employee_status === statusFilter;

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
        <CustomTable
          headers={headers}
          center
          isLoading={isDashboardDetailsFetching}
        >
          {filteredEmployees.length ? (
            filteredEmployees.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className=" text-black font-normal text-sm"
              >
                <TableCell className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="border-2 border-[#E4E7EC] w-5 aspect-square rounded bg-white"></div>
                    {row.full_name}
                  </div>{' '}
                </TableCell>
                <TableCell>{row.job_title}</TableCell>
                <TableCell className="text-center">{row.job_level}</TableCell>
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
                    {row.employee_status}
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
                  {/* <p className="text-sm text-gray-500">
                  Clock in and out to track your attendance
                </p> */}
                </div>
              </TableCell>
            </TableRow>
          )}
        </CustomTable>
      </div>

      {/* <div className="p-4 mt-[.5rem] overflow-x-auto">
        <table className="w-full rounded-3xl border border-gray-200">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-gray-500"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-3 text-left text-[.9rem] font-medium uppercase tracking-wider w-1/4 whitespace-nowrap">
                <div className="flex items-center">
                  Name
                  <ChevronsUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              <th className="p-3 text-left text-[.9rem] font-medium uppercase tracking-wider w-1/4 whitespace-nowrap">
                <div className="flex items-center">
                  Job Title
                  <ChevronsUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              <th className="p-3 text-left text-[.9rem] font-medium uppercase tracking-wider w-1/4 whitespace-nowrap">
                <div className="flex items-center">
                  Job Level
                  <ChevronsUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              <th className="p-3 text-left text-[.9rem] font-medium uppercase tracking-wider w-1/4 whitespace-nowrap">
                <div className="">Status</div>
              </th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-gray-500"
                    checked={selectedEmployees.includes(employee.full_name)}
                    onChange={() => toggleEmployeeSelect(employee.full_name)}
                  />
                </td>
                <td className="p-4 text-[1rem] whitespace-nowrap">
                  {employee?.full_name}
                </td>
                <td className="p-4 text-[1rem] whitespace-nowrap">
                  {employee?.job_title}
                </td>
                <td className="p-4 text-[1rem] whitespace-nowrap">
                  {employee?.job_level}
                </td>
                <td className="p-4 text-[1rem] whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded ${
                      employee?.employee_status === 'Active'
                        ? 'text-[#00AA4F] border border-[#89D8A9]'
                        : 'text-[#FFA80A] border border-[#FFD384]'
                    }`}
                  >
                    {employee?.employee_status}
                  </span>
                </td>
                <td className="p-4">
                  <Info
                    className="text-gray-400 hover:text-gray-600 border border-gray-500 rounded-md py-1"
                    size={26}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

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
