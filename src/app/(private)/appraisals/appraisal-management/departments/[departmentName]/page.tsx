"use client";
import React, { use } from "react";
import DepartmentDetail from "../../component-management/DepartmentDetail";

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ departmentName: string }>;
}) {
  const { departmentName: rawName } = use(params);

  const departmentName = rawName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return <DepartmentDetail departmentName={`${departmentName} Department`} />;
}
