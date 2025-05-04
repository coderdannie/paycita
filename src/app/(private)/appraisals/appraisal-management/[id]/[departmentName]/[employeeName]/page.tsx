import React, { use } from "react";
import EmployeeReviewDetailsPage from "../../../components/EmployeeReviewDetailsPage";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ departmentName: string; employeeName: string }>;
}) {
  const { departmentName: rawDept, employeeName: rawEmp } = use(params);

  const departmentName = rawDept
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const employeeName = rawEmp
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <EmployeeReviewDetailsPage
      departmentName={`${departmentName} Department`}
      employeeName={employeeName}
    />
  );
}
