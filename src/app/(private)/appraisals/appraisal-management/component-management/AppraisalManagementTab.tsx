"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSort, FaPlus } from "react-icons/fa";
import { IoInformationCircleOutline, IoSearchOutline } from "react-icons/io5";

import AppraisalManagementModal from "./AppraisalManagementModal";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import { useGetAppraisals } from "@/src/hooks/appraisal/useAppraisal";

const AppraisalManagementTab: FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedAppraisals, setSelectedAppraisals] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { appraisals, isLoading, pagination } = useGetAppraisals({
    page: currentPage.toString(),
  });

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedAppraisals(appraisals.map((appraisal) => appraisal.id));
    } else {
      setSelectedAppraisals([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedAppraisals.includes(id)) {
      setSelectedAppraisals(selectedAppraisals.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      setSelectedAppraisals([...selectedAppraisals, id]);
      if (selectedAppraisals.length + 1 === appraisals.length) {
        setSelectAll(true);
      }
    }
  };

  const filteredAppraisals = appraisals.filter(
    (appraisal) =>
      appraisal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appraisal.start_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appraisal.end_date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTakeQ1Performance = (id: string) => {
    router.push(`/appraisals/appraisal-management/${id}`);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return `${Math.ceil(differenceInDays)} days`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    return `${month} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="py-8 px-6 w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 w-full">
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearchOutline className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400  sm:text-sm"
            placeholder="Search role type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Create Appraisal Button */}
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#692E9F] hover:bg-purple-800 focus:outline-none "
        >
          Create Appraisal <FaPlus className="ml-2" />
        </button>
      </div>

      <div className="bg-white shadow rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <span>Appraisal Title</span>
                    <FaSort className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <span>Start Date</span>
                    <FaSort className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <span>End Date</span>
                    <FaSort className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <span>Duration</span>
                    <FaSort className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    <FaSort className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppraisals.map((appraisal) => (
                <tr key={appraisal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-[#692E9F] border-gray-300 rounded"
                        checked={selectedAppraisals.includes(appraisal.id)}
                        onChange={() => handleSelectItem(appraisal.id)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appraisal.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(appraisal.start_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(appraisal.end_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {calculateDuration(
                        appraisal.start_date,
                        appraisal.end_date
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex text-xs leading-5 font-semibold capitalize">
                      {appraisal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleTakeQ1Performance(appraisal.id)}
                      className="text-gray-400 border rounded-md p-1 hover:text-gray-500"
                    >
                      <IoInformationCircleOutline className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination?.total_pages > 1 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            goToPage={goToPage}
          />
        </div>
      )}

      <AppraisalManagementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AppraisalManagementTab;
