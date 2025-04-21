"use client";

import { usePathname, useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { useGetSingleAppraisal } from "@/src/hooks/appraisal/useAppraisal";
import { cn } from "@/lib/utils";

interface AssessmentValue {
  employee_score: string | number;
  line_manager: string | number | null;
}

const ReviewDetailsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const { appraisal, isLoading, isError } = useGetSingleAppraisal(id || "");

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Very Good";
    if (score >= 2.5) return "Good";
    if (score >= 1.5) return "Fair";
    return "Poor";
  };

  if (isLoading) {
    return <div>Loading appraisal details...</div>;
  }

  if (isError) {
    return <div>Error loading appraisal details</div>;
  }

  if (!appraisal) {
    return <div>Appraisal not found</div>;
  }

  const scoreLabel = getScoreLabel(Number(appraisal.total_score));

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full mx-auto py-6 px-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 mb-4"
        >
          <IoArrowBack className="mr-2" />
          <span>Review Details</span>
        </button>

        <div className="mb-6">
          <div className="space-y-1">
            <div className="flex">
              <span className="text-gray-500 w-36">Appraisals Title</span>
              <span className="font-medium">{appraisal.appraisal_title}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Start Date</span>
              <span className="font-medium">{appraisal.start_date}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">End Date</span>
              <span className="font-medium">{appraisal.end_date}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Status</span>
              <div className="flex items-center">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    appraisal.status.toLowerCase() === "pending"
                      ? "bg-yellow-500"
                      : "bg-[#00813C]"
                  )}
                ></span>
                <span
                  className={cn(
                    "text-[#00813C] capitalize",
                    appraisal.status.toLowerCase() === "pending"
                      ? "text-yellow-500"
                      : "text-[#00813C]"
                  )}
                >
                  {appraisal.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-lg mb-2">
            Appraisals Evaluation Result
          </h3>
          <div className="space-y-1">
            <div className="flex">
              <span className="text-gray-500 w-36">Total Score</span>
              <span className="font-medium">{appraisal.employee_score}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Line Manager Score</span>
              <span className="font-medium">
                {appraisal.line_manager_score}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Appraisals Score</span>
              <span className="font-medium">
                {appraisal.total_score} ({scoreLabel})
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 w-full">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-6 font-medium text-[#1D2939] w-[20%]">
                    Skills
                  </th>
                  <th className="text-left py-3 pr-6 font-medium text-[#1D2939] w-[40%]">
                    Description
                  </th>
                  <th className="text-left py-3 pr-6 font-medium text-[#1D2939] w-[10%] whitespace-nowrap">
                    Score
                  </th>
                  <th className="text-left py-3 pr-6 font-medium text-[#1D2939] w-[15%] whitespace-nowrap">
                    Line Manager
                  </th>
                  <th className="text-left py-3 font-medium text-[#1D2939] w-[15%] whitespace-nowrap">
                    Score Label
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(appraisal).map(([key, value]) => {
                  if (
                    typeof value === "object" &&
                    value !== null &&
                    "employee_score" in value
                  ) {
                    const skillName = key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");
                    const assessmentValue = value as AssessmentValue;
                    return (
                      <tr
                        key={key}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-4 pr-6 align-top">{skillName}</td>
                        <td className="py-4 pr-6 align-top break-words">
                          {/* Description can be added here if available */}
                        </td>
                        <td className="py-4 pr-6 align-top">
                          {assessmentValue.employee_score}
                        </td>
                        <td className="py-4 pr-6 align-top">
                          {assessmentValue.line_manager || "-"}
                        </td>
                        <td className="py-4 align-top">
                          <div className="flex flex-col">
                            <span>1 Poor</span>
                            <span>2 Fair</span>
                            <span>3 Good</span>
                            <span>4 Very Good</span>
                            <span>5 Excellent</span>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-lg mb-4">Employee Comment</h3>
          <div className="border border-gray-200 rounded-md p-4 min-h-24 bg-white">
            <p className="text-[#667085]">
              {appraisal.employee_comment || "No comment provided"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-lg mb-4">Line Manager Comment</h3>
          <div className="border border-gray-200 rounded-md p-4 min-h-24 bg-white">
            <p className="text-[#667085]">
              {appraisal.line_mamager_comment || "No comment provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsPage;
