"use client";
import { FC, useState, useMemo, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  IoSearchOutline,
  IoInformationCircleOutline,
  IoArrowBack,
} from "react-icons/io5";
import { FaSort } from "react-icons/fa";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import { useGetAppraisalsByDepartment } from "@/src/hooks/appraisal/useAppraisal";

interface Department {
  department_id: string;
  department_name: string;
  total: number;
}

const ITEMS_PER_PAGE = 10;

const DepartmentsPage: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  const id = useMemo(() => pathname.split("/").pop() || "", [pathname]);

  const { appraisalByDepartment, isLoading } = useGetAppraisalsByDepartment(id);

  const departments = useMemo(
    () => appraisalByDepartment || [],
    [appraisalByDepartment]
  );

  const filteredDepartments = useMemo(() => {
    if (!departments) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return departments.filter((department) =>
      department.department_name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [departments, searchTerm]);

  const paginatedDepartments = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDepartments.slice(startIndex, endIndex);
  }, [filteredDepartments, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE);
  }, [filteredDepartments.length]);

  useEffect(() => {
    if (filteredDepartments.length === 0) {
      setSelectAll(false);
      return;
    }
    const allFilteredSelected = filteredDepartments.every((dept: Department) =>
      selectedDepartments.has(dept.department_id)
    );
    setSelectAll(allFilteredSelected);
  }, [selectedDepartments, filteredDepartments]);

  const handleSelectAll = useCallback(() => {
    setSelectAll((prevSelectAll) => {
      const nextSelectAll = !prevSelectAll;
      setSelectedDepartments((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (nextSelectAll) {
          filteredDepartments.forEach((dept: Department) =>
            newSelected.add(dept.department_id)
          );
        } else {
          filteredDepartments.forEach((dept: Department) =>
            newSelected.delete(dept.department_id)
          );
        }
        return newSelected;
      });
      return nextSelectAll;
    });
  }, [filteredDepartments]);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedDepartments((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const handleViewDepartment = useCallback(
    (id: string) => {
      const department = departments.find(
        (dept: Department) => dept.department_id === id
      );
      if (department) {
        let urlPath = department.department_name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        if (!urlPath) {
          urlPath = `department-${department.department_id}`;
        }

        if (department.department_name === "IT Support") {
          urlPath = "it-support";
        }

        router.push(
          `/appraisals/appraisal-management/departments/${urlPath}?id=${id}`
        );
      }
    },
    [departments, router]
  );

  const handleGoBack = useCallback(() => {
    router.push("/appraisals");
  }, [router]);

  const setPageIndex = useCallback((index: number) => {
    setCurrentPage(index);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen p-8">Loading departments...</div>;
  }

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
          className="flex justify-center text-center items-center text-[#1D2939] mb-6 group"
        >
          <IoArrowBack className="mr-2 group-hover:text-[#692E9F]" />{" "}
          <span className="text-2xl font-semibold text-[#1D2939] group-hover:text-[#692E9F]">
            Departments
          </span>
        </button>

        {/* Search Input */}
        <div className="mb-6">
          <div className="max-w-xs relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearchOutline className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Search Departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-[#692E9F] border-gray-300 rounded focus:ring-[#692E9F]"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        aria-label="Select all visible departments"
                        disabled={filteredDepartments.length === 0}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>Department Name</span>
                      <FaSort className="ml-1 text-gray-400 h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDepartments.length > 0 ? (
                  paginatedDepartments.map((department: Department) => (
                    <tr
                      key={department.department_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-[#692E9F] border-gray-300 rounded focus:ring-[#692E9F]"
                            checked={selectedDepartments.has(
                              department.department_id
                            )}
                            onChange={() =>
                              handleSelectItem(department.department_id)
                            }
                            aria-labelledby={`department-name-${department.department_id}`}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                        <div
                          id={`department-name-${department.department_id}`}
                          className="text-sm font-medium text-gray-900"
                        >
                          {department.department_name}
                        </div>
                      </td>
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          {department.total}
                        </div>
                      </td>
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleViewDepartment(department.department_id)
                            }
                            className="text-gray-400 border rounded-md p-1 hover:text-gray-500 hover:border-gray-400 flex items-center justify-center min-w-[32px] min-h-[32px]"
                            aria-label={`View ${department.department_name} details`}
                            title={`View ${department.department_name} details`} // Tooltip
                          >
                            <IoInformationCircleOutline className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {searchTerm
                        ? "No departments match your search."
                        : "No departments found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={setPageIndex}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
