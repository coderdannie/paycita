import { FC, useState } from "react";
import { IoClose } from "react-icons/io5";

interface CreateAppraisalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appraisal: {
    title: string;
    startDate: string;
    endDate: string;
    department: string;
  }) => void;
}

const CreateAppraisalModal: FC<CreateAppraisalModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [department, setDepartment] = useState("All");

  const handleSubmit = () => {
    onSave({
      title,
      startDate,
      endDate,
      department,
    });
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setStartDate("");
    setEndDate("");
    setDepartment("All");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Appraisal</h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="appraisalTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Appraisal Title
            </label>
            <input
              type="text"
              id="appraisalTitle"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="startDate"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="endDate"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <div className="relative">
              <select
                id="department"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 appearance-none pr-10 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="w-full py-2 px-4 bg-[#692E9F] hover:bg-purple-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAppraisalModal;
