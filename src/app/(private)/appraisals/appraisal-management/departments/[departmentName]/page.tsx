"use client";

import { use } from "react";
import DepartmentDetail from "../../component-management/DeoartmentDetail";

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ departmentName: string }>;
}) {
  const { departmentName: rawDepartmentName } = use(params);

  const departmentName = rawDepartmentName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return <DepartmentDetail departmentName={`${departmentName} Department`} />;
}
