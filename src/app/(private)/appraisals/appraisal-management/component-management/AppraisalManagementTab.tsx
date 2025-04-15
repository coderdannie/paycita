"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSort, FaPlus } from "react-icons/fa";
import { IoInformationCircleOutline, IoSearchOutline } from "react-icons/io5";
import Pagination from "@/src/components/common/TanTable/pagination";
import AppraisalManagementModal from "./AppraisalManagementModal";


interface Appraisal {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: "Ongoing" | "Completed";
}

const AppraisalManagementTab: FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedAppraisals, setSelectedAppraisals] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data
  const [appraisals, setAppraisals] = useState<Appraisal[]>([
    {
      id: "1",
      title: "Q1 Performance Review",
      startDate: "Mar 1, 2025",
      endDate: "Mar 15, 2025",
      duration: "15 days",
      status: "Ongoing",
    },
    {
      id: "2",
      title: "Q1 Performance Review",
      startDate: "Feb 5, 2025",
      endDate: "Feb 20, 2025",
      duration: "15 days",
      status: "Completed",
    },
    {
      id: "3",
      title: "Q1 Performance Review",
      startDate: "Jan 5, 2025",
      endDate: "Jan 20, 2025",
      duration: "15 days",
      status: "Completed",
    },
  ]);

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
      appraisal.startDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appraisal.endDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appraisal.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTakeQ1Performance = (id: string) => {
    router.push(`/appraisals/appraisal-management/${id}`);
  };

  const mockTable = {
    getState: () => ({
      pagination: { pageIndex: currentPage },
    }),
    getPageCount: () => Math.ceil(filteredAppraisals.length / 10),
    getCanPreviousPage: () => currentPage > 0,
    getCanNextPage: () =>
      currentPage < Math.ceil(filteredAppraisals.length / 10) - 1,
    setPageIndex: (index: number) => setCurrentPage(index),
  };

  const setPageIndex = (index: number) => {
    setCurrentPage(index);
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

  const handleSaveAppraisal = (appraisalData: {
    title: string;
    startDate: string;
    endDate: string;
    department: string;
  }) => {
    const newAppraisal: Appraisal = {
      id: (appraisals.length + 1).toString(),
      title: appraisalData.title,
      startDate: formatDate(appraisalData.startDate),
      endDate: formatDate(appraisalData.endDate),
      duration: calculateDuration(
        appraisalData.startDate,
        appraisalData.endDate
      ),
      status: "Ongoing",
    };

    setAppraisals([newAppraisal, ...appraisals]);
    handleCloseModal();
  };

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
                      {appraisal.startDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appraisal.endDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appraisal.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex text-xs leading-5 font-semibold">
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

      <Pagination table={mockTable} buttons={[]} setPageIndex={setPageIndex} />

      <AppraisalManagementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAppraisal}
      />
    </div>
  );
};

export default AppraisalManagementTab;
