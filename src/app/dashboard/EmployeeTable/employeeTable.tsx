"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Search, Info, ChevronsUpDown, Settings2 } from "lucide-react";
import FilterModal from "./FilterModal/filterModal";

interface Employee {
  id: number;
  name: string;
  jobTitle: string;
  jobLevel: string;
  status: string;
}

const EmployeeTable = () => {
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [jobLevelFilter, setJobLevelFilter] = useState("All Level");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const employees = useMemo<Employee[]>(
    () => [
      {
        id: 1,
        name: "Sarah Johnson",
        jobTitle: "Product Development",
        jobLevel: "Staff",
        status: "Active",
      },
      {
        id: 2,
        name: "James Martinez",
        jobTitle: "Front-end Developer",
        jobLevel: "Manager",
        status: "On Leave",
      },
      {
        id: 3,
        name: "Emily Lee",
        jobTitle: "UI/UX Designer",
        jobLevel: "Staff",
        status: "Active",
      },
      {
        id: 4,
        name: "Chris Thompson",
        jobTitle: "Backend Developer",
        jobLevel: "Manager",
        status: "On Leave",
      },
      {
        id: 5,
        name: "Alexandra Davis",
        jobTitle: "Product Manager",
        jobLevel: "Staff",
        status: "Active",
      },
    ],
    []
  );

  const toggleEmployeeSelect = useCallback((id: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  }, []);

  const isAllSelected = selectedEmployees.length === employees.length;

  const toggleSelectAll = useCallback(() => {
    setSelectedEmployees(isAllSelected ? [] : employees.map((emp) => emp.id));
  }, [isAllSelected, employees]);

  const toggleFilterModal = useCallback(() => {
    setIsFilterModalOpen((prev) => !prev);
  }, []);

  const applyFilters = useCallback(() => {
    toggleFilterModal();
  }, [toggleFilterModal]);

  const resetFilters = useCallback(() => {
    setJobLevelFilter("All Level");
    setStatusFilter("All Status");
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesJobLevel =
      jobLevelFilter === "All Level" || emp.jobLevel === jobLevelFilter;
    const matchesStatus =
      statusFilter === "All Status" || emp.status === statusFilter;

    return matchesSearch && matchesJobLevel && matchesStatus;
  });

  return (
    <div className="bg-white shadow rounded-lg w-full max-w-4xl mx-auto relative overflow-hidden">
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-center mt-[1rem] mb-[3rem]">
          <h2 className="text-[1.3rem] font-medium">Employee</h2>
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="relative flex-grow max-w-xs">
            <input
              type="text"
              placeholder="Search employee name"
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
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
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-gray-500"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => toggleEmployeeSelect(employee.id)}
                  />
                </td>
                <td className="p-4 text-[1rem] whitespace-nowrap">
                  {employee.name}
                </td>
                <td className="p-4 text-[1rem] whitespace-nowrap">
                  {employee.jobTitle}
                </td>
                <td className="p-4 text-[1rem] whitespace-nowrap">
                  {employee.jobLevel}
                </td>
                <td className="p-4 text-[1rem] whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded ${
                      employee.status === "Active"
                        ? "text-[#00AA4F] border border-[#89D8A9]"
                        : "text-[#FFA80A] border border-[#FFD384]"
                    }`}
                  >
                    {employee.status}
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
