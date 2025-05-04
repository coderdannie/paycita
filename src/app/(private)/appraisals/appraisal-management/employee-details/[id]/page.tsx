import EmployeeReviewDetailsPage from "../../components/EmployeeReviewDetailsPage";

import { use } from 'react';

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ departmentName: string; employeeName: string }>;
}) {
  const { departmentName: rawDept, employeeName: rawEmp } = use(params);

  
  const formattedDeptName = rawDept
    .replace(/-department$/, "")
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

 
  const employeeName = rawEmp
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <EmployeeReviewDetailsPage
      departmentName={`${formattedDeptName} Department`}
      employeeName={employeeName}
    />
  );
}