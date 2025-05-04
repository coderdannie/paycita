"use client";
import { FC, useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { useGetSingleAppraisal } from "@/src/hooks/appraisal/useAppraisal";
import { cn } from "@/lib/utils";

interface AssessmentValue {
  employee_score: string | number;
  line_manager: string | number | null;

  description?: string;
}
interface EmployeeReviewDetailsPageProps {
  employeeName?: string;
  departmentName?: string;
}

const hardcodedAppraisalDetails = {
  skills: [
    {
      key: "job_knowledge", // Added key to match backend potential key
      skill: "Job Knowledge & Expertise",
      description:
        "Understanding of duties and responsibilities. Technical skills related to the role. Ability to apply knowledge to work effectively",
      score: 5,
      lineManagerScore: 2,
    },
    {
      key: "quality_of_work",
      skill: "Quality of Work",
      description:
        "Accuracy and thoroughness. Attention to detail. Consistency in output. Meets/exceeds quality standards",
      score: 5,
      lineManagerScore: 3,
    },
    {
      key: "productivity",
      skill: "Productivity & Efficiency",
      description:
        "Timeliness in completing tasks. Ability to manage workload. Minimizes downtime. Time management",
      score: 5,
      lineManagerScore: 2,
    },
    {
      key: "communication",
      skill: "Communication Skills",
      description:
        "Clear verbal and written communication. Active listening. Timely and appropriate feedback. Ability to communicate with colleagues, management, and customers",
      score: 5,
      lineManagerScore: 3,
    },
    {
      key: "customer_service", // Assuming key for client-facing roles
      skill: "Customer Service (for client-facing roles)",
      description:
        "Response time to inquiries or issues. Customer satisfaction ratings. Professionalism in handling complaints. Resolution of customer issues",
      score: 5,
      lineManagerScore: 4,
    },
    {
      key: "team_work",
      skill: "Teamwork & Collaboration",
      description:
        "Cooperates with team members. Shares information and ideas. Offers solutions and suggestions. Takes ownership of tasks",
      score: 5,
      lineManagerScore: 3,
    },
    {
      key: "problem_solving",
      skill: "Initiative & Problem-Solving",
      description:
        "Proactively identifies problems. Offers solutions and suggestions. Takes ownership of tasks. Willingness to go beyond the assigned duties",
      score: 5,
      lineManagerScore: 3,
    },
    {
      key: "accountability",
      skill: "Dependability & Accountability",
      description: "Meets deadlines. Reliable and punctual",
      score: 5,
      lineManagerScore: 3,
    },
    {
      key: "adaptability_flexibility",
      skill: "Adaptability & Flexibility",
      description:
        "Open to change and feedback. Adjusts quickly to new responsibilities or shifts in priorities. Learns new skills when required",
      score: 5,
      lineManagerScore: 3,
    },
    {
      key: "leadership",
      skill: "Leadership & Supervision (for team leads/supervisors)",
      description:
        "Delegates tasks appropriately. Motivates and guides team. Conflict resolution. Provides feedback and support",
      score: 5,
      lineManagerScore: 3,
    },
    {
      key: "company_policy",
      skill: "Adherence to Company Policies",
      description:
        "Follows company procedures and rules. Maintains confidentiality. Complies with safety and operational guidelines",
      score: 5,
      lineManagerScore: 3,
    },
    {
      key: "professionalism",
      skill: "Professionalism & Attitude",
      description:
        "Respectful and courteous behavior. Positive attitude towards work. Presentation and grooming (where applicable). Ethical conduct",
      score: 5,
      lineManagerScore: 3,
    },
  ],
};

const EmployeeReviewDetailsPage: FC<EmployeeReviewDetailsPageProps> = ({
  employeeName = "Sarah Johnson",
  departmentName = "Finance Department",
}) => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const id = useMemo(() => params.get("id") || "", [params]);

  const { appraisal, isLoading, isError } = useGetSingleAppraisal(id || "");

  const descriptionMap = useMemo(() => {
    const map = new Map<string, string>();
    hardcodedAppraisalDetails.skills.forEach((skillDetail) => {
      if (skillDetail.key) {
        map.set(skillDetail.key, skillDetail.description);
      }
    });
    return map;
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const pathSegments = pathname.split("/");
  const appraisalPath = pathSegments
    .slice(0, -3)
    .join("/")
    .replace(/\/([^/]+)\/(.*)/, "/$1?tab=$2");
  const departmentPath = pathSegments.slice(0, -2).join("/");
  const singleDepartmentPath = pathSegments.slice(0, -1).join("/");

  const handleNavigateToDepartments = useCallback(() => {
    router.replace(departmentPath);
  }, [departmentPath, router]);

  const handleGoBackToAppraisals = useCallback(() => {
    router.replace(appraisalPath);
  }, [appraisalPath, router]);

  const handleNavigateToSingleDepartment = useCallback(() => {
    router.replace(singleDepartmentPath);
  }, [router, singleDepartmentPath]);
  const deptNameForBreadcrumb = departmentName.replace(" Department", "");

  const getScoreLabel = useCallback((score: number | string | null) => {
    const numericScore = Number(score);
    if (isNaN(numericScore)) return "N/A";

    if (numericScore >= 4.5) return "Excellent";
    if (numericScore >= 3.5) return "Very Good";
    if (numericScore >= 2.5) return "Good";
    if (numericScore >= 1.5) return "Fair";
    return "Poor";
  }, []);

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

  return (
    <div className="min-h-screen w-full">
      <div className="w-full mx-auto py-6 px-4">
        <div className="flex items-center text-sm mb-4">
          <span
            className="text-[#692E9F] cursor-pointer"
            onClick={handleGoBackToAppraisals}
          >
            Appraisal Management
          </span>
          <span className="mx-2">/</span>
          <span
            className="text-[#692E9F] cursor-pointer"
            onClick={handleNavigateToDepartments}
          >
            Departments
          </span>
          <span className="mx-2">/</span>
          <span
            className="text-[#692E9F] cursor-pointer"
            onClick={handleNavigateToSingleDepartment}
          >
            {deptNameForBreadcrumb}
          </span>
          <span className="mx-2">/</span>

          <span>{employeeName ?? appraisal.employee_name ?? "Employee"}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center font-semibold text-[#1D2939] mb-4"
        >
          <IoArrowBack className="mr-2" />
          <span>Employee Review Details</span>
        </button>

        {/* Header Info */}
        <div className="mb-6">
          <div className="space-y-1">
            <div className="flex">
              <span className="text-gray-500 w-36">Appraisals Title</span>
              <span className="font-medium">{appraisal.appraisal_title}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Employee Name</span>
              <span className="font-medium">
                {appraisal.employee_name ?? "N/A"}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Job Title</span>
              <span className="font-medium">
                {appraisal.job_title ?? "N/A"}
              </span>
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
                    appraisal.status?.toLowerCase() === "pending"
                      ? "bg-yellow-500"
                      : "bg-[#00813C]"
                  )}
                ></span>
                <span
                  className={cn(
                    "capitalize",
                    appraisal.status?.toLowerCase() === "pending"
                      ? "text-yellow-500"
                      : "text-[#00813C]"
                  )}
                >
                  {appraisal.status ?? "N/A"}
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
              <span className="font-medium">
                {appraisal.employee_score ?? "N/A"}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Line Manager Score</span>
              <span className="font-medium">
                {appraisal.line_manager_score ?? "N/A"}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Appraisals Score</span>
              <span className="font-medium">
                {appraisal.total_score ?? "N/A"} ({scoreLabel})
              </span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 w-full">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-6 font-medium text-[#1D2939]">
                    Skills
                  </th>
                  <th className="text-left py-3 pr-6 font-medium text-[#1D2939]">
                    Description
                  </th>
                  <th className="text-left py-3 pr-6 font-medium text-[#1D2939]">
                    {" "}
                    {/* Corrected text color class */}
                    Score
                  </th>
                  <th className="text-left py-3 pr-6 font-medium text-[#1D2939]">
                    Line Manager
                  </th>
                  <th className="text-left py-3 font-medium text-[#1D2939]">
                    Score Label
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Original loop iterating over backend appraisal data */}
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

                    const description = descriptionMap.get(key) || (
                      <span className="italic text-gray-400">
                        No description
                      </span>
                    );

                    return (
                      <tr
                        key={key}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-4 pr-6 align-top">{skillName}</td>

                        <td className="py-4 pr-6 align-top break-words max-w-md whitespace-normal">
                          {description}
                        </td>
                        <td className="py-4 pr-6 align-top">
                          {assessmentValue.employee_score ?? "-"}
                        </td>
                        <td className="py-4 pr-6 align-top">
                          {assessmentValue.line_manager ?? "-"}
                        </td>

                        <td className="py-4 align-top">
                          <div className="flex flex-col text-xs">
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
          <h3 className="font-medium text-lg mb-4">Line Manager Comment</h3>
          <div className="border border-gray-200 rounded-md p-4 min-h-24 bg-white">
            <p
              className={cn(
                "text-[#667085]",
                !appraisal.line_mamager_comment && "italic"
              )}
            >
              {appraisal.line_mamager_comment || "No comment provided"}
            </p>
          </div>
        </div>
        {/* --- End Original JSX Structure --- */}
      </div>
    </div>
  );
};

export default EmployeeReviewDetailsPage;
