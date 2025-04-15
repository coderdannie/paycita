"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { FiInfo } from "react-icons/fi";

interface AppraisalProps {
  appraisal: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: "Pending" | "Completed";
  };
}

const AppraisalCard: FC<AppraisalProps> = ({ appraisal }) => {
  const { id, title, startDate, endDate, status } = appraisal;
  const router = useRouter();

  const handleTakeAssessment = () => {
    router.push(`/appraisals/assessment/${id}`);
  };

  const handleViewDetails = () => {
    router.push(`/appraisals/details/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
            <span className="text-gray-500">Appraisals Title</span>
            <span className="font-medium text-gray-800">{title}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
            <span className="text-gray-500">Start Date</span>
            <span className="font-medium text-gray-800">{startDate}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
            <span className="text-gray-500">End Date</span>
            <span className="font-medium text-gray-800">{endDate}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
            <span className="text-gray-500">Status</span>
            <div className="flex items-center">
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  status === "Pending" ? "bg-[#FFA80A]" : "bg-[#00813C]"
                }`}
              />
              <span
                className={
                  status === "Pending" ? "text-[#FFA80A]" : "text-[#00813C]"
                }
              >
                {status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start mt-4 md:mt-0">
          <button
            onClick={handleViewDetails}
            className="text-gray-400 hover:text-gray-600"
            aria-label="View details"
          >
            <FiInfo size={18} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleTakeAssessment}
          className={`px-4 py-2 rounded-md text-white ${
            status === "Completed"
              ? "bg-[#F0EAF5] text-[#FFFFFF] cursor-not-allowed"
              : "bg-[#692E9F] hover:bg-purple-800"
          }`}
          disabled={status === "Completed"}
        >
          Take Assessment
        </button>
      </div>
    </div>
  );
};

export default AppraisalCard;
