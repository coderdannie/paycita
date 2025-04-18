"use client";
import { ReactNode } from "react";

export default function AppraisalManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
