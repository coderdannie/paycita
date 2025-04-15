"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearchOutline, IoInformationCircleOutline, IoArrowBack } from "react-icons/io5";
import { FaSort } from "react-icons/fa";
import Pagination from "@/src/components/common/TanTable/pagination";

interface Department {
  id: string;
  name: string;
  employeeCount: number;
}

const DepartmentsPage: FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Sample data
  const [departments] = useState<Department[]>([
    { id: "1", name: "Finance", employeeCount: 12 },
    { id: "2", name: "Human Resources", employeeCount: 8 },
    { id: "3", name: "IT Support", employeeCount: 15 },
    { id: "4", name: "Marketing", employeeCount: 10 },
    { id: "5", name: "Operations", employeeCount: 20 },
    { id: "6", name: "General Manager", employeeCount: 12 },
  ]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedDepartments(departments.map((dept) => dept.id));
    } else {
      setSelectedDepartments([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedDepartments.includes(id)) {
      setSelectedDepartments(selectedDepartments.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      setSelectedDepartments([...selectedDepartments, id]);
      if (selectedDepartments.length + 1 === departments.length) {
        setSelectAll(true);
      }
    }
  };

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDepartment = (id: string) => {
    const department = departments.find((dept) => dept.id === id);
    if (department) {
      router.push(
        `/appraisals/appraisal-management/departments/${department.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`
      );
    }
  };

const handleGoBack = () => {
  router.push("/appraisals");
};

  const mockTable = {
    getState: () => ({
      pagination: { pageIndex: currentPage },
    }),
    getPageCount: () => Math.ceil(filteredDepartments.length / 10),
    getCanPreviousPage: () => currentPage > 0,
    getCanNextPage: () =>
      currentPage < Math.ceil(filteredDepartments.length / 10) - 1,
    setPageIndex: (index: number) => setCurrentPage(index),
  };

  const setPageIndex = (index: number) => {
    setCurrentPage(index);
  };

  return (
    <div className="min-h-screen">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm mb-4">
          <span className="text-[#692E9F]">Appraisal Management</span>
          <span className="mx-2">/</span>
          <span>Departments</span>
        </div>
        <button
          onClick={handleGoBack}
          className="flex justify-center text-center items-center text-[#1D2939] mb-6"
        >
          <IoArrowBack className="mr-2" />
          <span className="text-2xl font-semibold text-[#1D2939] ">
            Departments
          </span>
        </button>

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
                      <span>Department Name</span>
                      <FaSort className="ml-1 text-gray-400 h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-end">
                      <span>No. of Employees</span>
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
                {filteredDepartments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-[#692E9F] border-gray-300 rounded"
                          checked={selectedDepartments.includes(department.id)}
                          onChange={() => handleSelectItem(department.id)}
                        />
                      </div>
                    </td>
                    <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {department.name}
                      </div>
                    </td>
                    <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {department.employeeCount}
                      </div>
                    </td>
                    <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDepartment(department.id)}
                          className="text-gray-400 border rounded-md p-1 hover:text-gray-500 flex items-center justify-center min-w-[32px] min-h-[32px]"
                          aria-label="View Department"
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

export default DepartmentsPage;
