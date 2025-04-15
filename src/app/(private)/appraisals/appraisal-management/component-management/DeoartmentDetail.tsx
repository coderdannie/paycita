"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearchOutline, IoInformationCircleOutline } from "react-icons/io5";
import { FaSort } from "react-icons/fa";
import Pagination from "@/src/components/common/TanTable/pagination";

interface EmployeePerformance {
  id: string;
  name: string;
  performanceScore: string;
  lineManagerScore: string;
}

interface DepartmentDetailProps {
  departmentName?: string;
}

const DepartmentDetail: FC<DepartmentDetailProps> = ({
  departmentName = "Finance Department",
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Sample data
  const [employees] = useState<EmployeePerformance[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      performanceScore: "29%",
      lineManagerScore: "20%",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      performanceScore: "30%",
      lineManagerScore: "23%",
    },
    {
      id: "3",
      name: "Sarah Johnson",
      performanceScore: "24%",
      lineManagerScore: "15%",
    },
    {
      id: "4",
      name: "Sarah Johnson",
      performanceScore: "27%",
      lineManagerScore: "17%",
    },
    {
      id: "5",
      name: "Sarah Johnson",
      performanceScore: "19%",
      lineManagerScore: "11%",
    },
    {
      id: "6",
      name: "Sarah Johnson",
      performanceScore: "29%",
      lineManagerScore: "10%",
    },
    {
      id: "7",
      name: "Sarah Johnson",
      performanceScore: "29%",
      lineManagerScore: "11%",
    },
    {
      id: "8",
      name: "Sarah Johnson",
      performanceScore: "21%",
      lineManagerScore: "5%",
    },
    {
      id: "9",
      name: "Sarah Johnson",
      performanceScore: "24%",
      lineManagerScore: "15%",
    },
    {
      id: "10",
      name: "Sarah Johnson",
      performanceScore: "29%",
      lineManagerScore: "29%",
    },
  ]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedEmployees(employees.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
      if (selectedEmployees.length + 1 === employees.length) {
        setSelectAll(true);
      }
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.performanceScore
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.lineManagerScore.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewEmployeeDetails = () => {
    router.push(
      `/appraisals/appraisal-management/departments/finance-department/sarah-johnson`
    );
  };
  const handleGoBackToDepartments = () => {
    router.push("/appraisals/appraisal-management/departments");
  };

  const mockTable = {
    getState: () => ({
      pagination: {
        pageIndex: currentPage,
      },
    }),
    getPageCount: () => Math.ceil(employees.length / 10),
    getCanPreviousPage: () => currentPage > 0,
    getCanNextPage: () => currentPage < Math.ceil(employees.length / 10) - 1,
    setPageIndex: (index: number) => setCurrentPage(index),
  };

  const setPageIndex = (index: number) => {
    setCurrentPage(index);
  };

  return (
    <div className="min-h-screen">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm mb-4">
          <span
            className="text-[#692E9F] cursor-pointer"
            onClick={handleGoBackToDepartments}
          >
            Appraisal Management
          </span>
          <span className="mx-2">/</span>
          <span
            className="text-[#692E9F] cursor-pointer"
            onClick={handleGoBackToDepartments}
          >
            Departments
          </span>
          <span className="mx-2">/</span>
          <span>{departmentName}</span>
        </div>

        <h1 className="text-2xl font-semibold text-[#1D2939] mb-6">
          {departmentName}
        </h1>

        <div className="mb-6">
          <div className="max-w-xs relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearchOutline className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-transparent sm:text-sm"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-[#692E9F] border-gray-300 rounded"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      <FaSort className="ml-1 text-gray-400 h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-center">
                      <span>Performance Score</span>
                      <FaSort className="ml-1 text-gray-400 h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-center">
                      <span>Line Manager Score</span>
                      <FaSort className="ml-1 text-gray-400 h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-[#692E9F]  border-gray-300 rounded"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleSelectItem(employee.id)}
                        />
                      </div>
                    </td>
                    <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                    </td>
                    <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900 text-center">
                        {employee.performanceScore}
                      </div>
                    </td>
                    <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900 text-center">
                        {employee.lineManagerScore}
                      </div>
                    </td>
                    <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewEmployeeDetails()}
                          className="text-gray-400 border rounded-md p-1 hover:text-gray-500 flex items-center justify-center min-w-[32px] min-h-[32px]"
                          aria-label="View Details"
                        >
                          <IoInformationCircleOutline className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          table={mockTable}
          buttons={[]}
          setPageIndex={setPageIndex}
        />
      </div>
    </div>
  );
};

export default DepartmentDetail;
