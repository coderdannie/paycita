"use client";

import { FC, useState, useMemo, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoSearchOutline, IoInformationCircleOutline } from "react-icons/io5";
import { FaSort } from "react-icons/fa";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import { useGetDepartmentDetails } from "@/src/hooks/appraisal/useAppraisal";

interface EmployeePerformance {
  appraisal_id: string;
  staff_name: string;
  employee_score: string;
  line_manager_score: string | null;
}

const ITEMS_PER_PAGE = 10;

const DepartmentDetail: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const departmentId = localStorage.getItem("departmentID") || "";


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  const pathSegments = pathname.split("/");
  const departmentPath = pathSegments.slice(0, -1).join("/");
  const appraisalPath = pathSegments
    .slice(0, -2)
    .join("/")
    .replace(/\/([^/]+)\/(.*)/, "/$1?tab=$2");

  const departmentName = useMemo(() => {
    const lastSegment = pathSegments.pop() || "";

    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [pathSegments]);

  // const paramsId = useMemo(() => params.get("id") || "", [params]);

  const { appraisalDepartmentDetails, isLoading, isError } =
    useGetDepartmentDetails(departmentId);

  const employees = useMemo(
    () => appraisalDepartmentDetails || [],
    [appraisalDepartmentDetails]
  );

  const filteredEmployees = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) return employees;

    return employees.filter(
      (employee: EmployeePerformance) =>
        employee.staff_name.toLowerCase().includes(lowerSearchTerm) ||
        employee.employee_score.toLowerCase().includes(lowerSearchTerm) ||
        (employee.line_manager_score &&
          employee.line_manager_score.toLowerCase().includes(lowerSearchTerm))
    );
  }, [employees, searchTerm]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  }, [filteredEmployees.length]);

  useEffect(() => {
    if (filteredEmployees.length === 0) {
      setSelectAll(false);
      return;
    }
    const allFilteredSelected = filteredEmployees.every((emp) =>
      selectedEmployees.has(emp.appraisal_id)
    );
    setSelectAll(allFilteredSelected);
  }, [selectedEmployees, filteredEmployees]);

  const handleSelectAll = useCallback(() => {
    setSelectAll((prevSelectAll) => {
      const nextSelectAll = !prevSelectAll;
      setSelectedEmployees((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (nextSelectAll) {
          filteredEmployees.forEach((emp) => newSelected.add(emp.appraisal_id));
        } else {
          filteredEmployees.forEach((emp) =>
            newSelected.delete(emp.appraisal_id)
          );
        }
        return newSelected;
      });
      return nextSelectAll;
    });
  }, [filteredEmployees]);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedEmployees((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const handleViewEmployeeDetails = useCallback(
    (employee: EmployeePerformance) => {
      const employeeSlug = employee.staff_name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const deptSlug = pathname.split("/").pop() || "";

      if (employeeSlug && deptSlug) {
        router.push(`${pathname}/${employeeSlug}?id=${employee.appraisal_id}`);
      }
    },
    [pathname, router]
  );

  const handleGoBackToDepartments = useCallback(() => {
    router.replace(departmentPath);
  }, [departmentPath, router]);

  const handleGoBackToAppraisals = useCallback(() => {
    router.replace(appraisalPath);
  }, [appraisalPath, router]);

  const setPageIndex = useCallback((index: number) => {
    setCurrentPage(index);
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 text-center">
        Loading employee details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen p-8 text-center text-red-600">
        Error loading details. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm mb-4 flex-wrap">
          <span
            className="text-[#692E9F] cursor-pointer hover:underline"
            onClick={handleGoBackToAppraisals}
          >
            Appraisal Management
          </span>
          <span className="mx-2">/</span>
          <span
            className="text-[#692E9F] cursor-pointer hover:underline"
            onClick={handleGoBackToDepartments}
          >
            Departments
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-500">{departmentName} </span>
        </div>

        <h1 className="text-2xl font-semibold text-[#1D2939] mb-6">
          {departmentName} Department
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Search Employees..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
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
                        aria-label="Select all visible employees"
                        disabled={filteredEmployees.length === 0}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      <FaSort className="ml-1 text-gray-400 h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center justify-center">
                      <span>Performance Score</span>
                      <FaSort className="ml-1 text-gray-400 h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 sm:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((employee: EmployeePerformance) => (
                    <tr
                      key={employee.appraisal_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-[#692E9F] border-gray-300 rounded focus:ring-[#692E9F]"
                            checked={selectedEmployees.has(
                              employee.appraisal_id
                            )}
                            onChange={() =>
                              handleSelectItem(employee.appraisal_id)
                            }
                            aria-labelledby={`employee-name-${employee.appraisal_id}`}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap">
                        <div
                          id={`employee-name-${employee.appraisal_id}`}
                          className="text-sm font-medium text-gray-900"
                        >
                          {employee.staff_name}
                        </div>
                      </td>
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">
                          {/* Consider formatting score if it's numeric */}
                          {employee.employee_score ?? "N/A"}
                        </div>
                      </td>
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">
                          {employee.line_manager_score ?? "N/A"}
                        </div>
                      </td>
                      <td className="px-2 py-4 sm:px-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewEmployeeDetails(employee)}
                            className="text-gray-400 border rounded-md p-1 hover:text-gray-500 hover:border-gray-400 flex items-center justify-center min-w-[32px] min-h-[32px]"
                            aria-label={`View ${employee.staff_name} details`}
                            title={`View ${employee.staff_name} details`}
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
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {searchTerm
                        ? "No employees match your search."
                        : "No employee data available for this department."}
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
export default DepartmentDetail;
