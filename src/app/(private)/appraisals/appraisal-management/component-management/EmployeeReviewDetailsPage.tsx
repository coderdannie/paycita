"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

// interface SkillRating {
//   skill: string;
//   description: string;
//   score: number;
//   lineManagerScore: number | null;
// }

interface EmployeeReviewDetailsPageProps {
  employeeName?: string;
  departmentName?: string;
}

const EmployeeReviewDetailsPage: FC<EmployeeReviewDetailsPageProps> = ({
  employeeName = "Sarah Johnson",
  departmentName = "Finance Department",
}) => {
  const router = useRouter();

  const appraisalDetails = {
    title: "Q1 Performance Review",
    employeeName: employeeName,
    jobTitle: "Backend Developer",
    startDate: "Mar 1, 2025",
    endDate: "Mar 15, 2025",
    status: "Completed",
    totalScore: 30,
    lineManagerScore: 18,
    assessmentScore: 5,
    skills: [
      {
        skill: "Communication Skills",
        description:
          "Clarity and effectiveness in written and verbal communication",
        score: 5,
        lineManagerScore: 2,
      },
      {
        skill: "Teamwork",
        description: "Ability to work collaboratively with others",
        score: 5,
        lineManagerScore: 3,
      },
      {
        skill: "Problem Solving",
        description:
          "Effectiveness in identifying problems and implementing solutions",
        score: 5,
        lineManagerScore: 2,
      },
      {
        skill: "Punctuality",
        description:
          "Adherence to deadlines and punctuality in work attendance",
        score: 5,
        lineManagerScore: 3,
      },
      {
        skill: "Quality of Work",
        description: "Consistency and accuracy of work delivered",
        score: 5,
        lineManagerScore: 4,
      },
      {
        skill: "Innovation",
        description: "Ability to contribute new ideas and creative solutions",
        score: 5,
        lineManagerScore: 3,
      },
    ],
    lineManagerComment: "",
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleNavigateToDepartment = () => {
    router.push(
      "/appraisals/appraisal-management/departments/finance-department"
    );
  };

  const handleNavigateToDepartments = () => {
    router.push("/appraisals/appraisal-management/departments");
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full mx-auto py-6 px-4">
        <div className="flex items-center text-sm mb-4">
          <span
            className="text-[#692E9F] cursor-pointer"
            onClick={handleNavigateToDepartments}
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
            onClick={handleNavigateToDepartment}
          >
            {departmentName}
          </span>
          <span className="mx-2">/</span>
          <span>{employeeName}</span>
        </div>

        <button
          onClick={handleGoBack}
          className="flex items-center font-semibold text-[#1D2939] mb-4"
        >
          <IoArrowBack className="mr-2" />
          <span>Employee Review Details</span>
        </button>

        <div className="mb-6">
          <div className="space-y-1">
            <div className="flex">
              <span className="text-gray-500 w-36">Appraisals Title</span>
              <span className="font-medium">{appraisalDetails.title}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Employee Name</span>
              <span className="font-medium">
                {appraisalDetails.employeeName}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Job Title</span>
              <span className="font-medium">{appraisalDetails.jobTitle}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Start Date</span>
              <span className="font-medium">{appraisalDetails.startDate}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">End Date</span>
              <span className="font-medium">{appraisalDetails.endDate}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Status</span>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#00813C] mr-2"></span>
                <span className="text-[#00813C]">
                  {appraisalDetails.status}
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
              <span className="font-medium">{appraisalDetails.totalScore}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Line Manager Score</span>
              <span className="font-medium">
                {appraisalDetails.lineManagerScore}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-36">Appraisals Score</span>
              <span className="font-medium">
                {appraisalDetails.assessmentScore} (Excellent)
              </span>
            </div>
          </div>
        </div>

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
                  <th className="text-left py-3 pr-6 font-medium text-#1D2939">
                    Score
                  </th>
                  <th className="text-left py-3 pr-6 font-medium text-[#1D2939]">
                    Line Mana...
                  </th>
                  <th className="text-left py-3 font-medium text-[#1D2939]">
                    Score Label
                  </th>
                </tr>
              </thead>
              <tbody>
                {appraisalDetails.skills.map((skill, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-4 pr-6">{skill.skill}</td>
                    <td className="py-4 pr-6">{skill.description}</td>
                    <td className="py-4 pr-6">{skill.score}</td>
                    <td className="py-4 pr-6">{skill.lineManagerScore}</td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span>1 Poor</span>
                        <span>2 Fair</span>
                        <span>3 Good</span>
                        <span>4 Very Good</span>
                        <span>5 Excellent</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-lg mb-4">Line Manager Comment</h3>
          <div className="border border-gray-200 rounded-md p-4 min-h-24 bg-white">
            <p className="text-[#667085]">
              Notes about the employee performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReviewDetailsPage;
