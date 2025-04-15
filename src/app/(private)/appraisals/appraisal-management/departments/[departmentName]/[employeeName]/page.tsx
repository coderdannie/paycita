"use client";

import { use } from "react";
import EmployeeReviewDetailsPage from "../../../component-management/EmployeeReviewDetailsPage";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ departmentName: string; employeeName: string }>;
}) {
  const { departmentName: rawDepartmentName, employeeName: rawEmployeeName } =
    use(params);

  const departmentName = rawDepartmentName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const employeeName = rawEmployeeName
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
