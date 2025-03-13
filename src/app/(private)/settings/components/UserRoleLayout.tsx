"use client";
import React from "react";
import { UserRoleProvider } from "./UserRoleContext";


interface UserRoleLayoutProps {
  children: React.ReactNode;
}

export default function UserRoleLayout({ children }: UserRoleLayoutProps) {
  return <UserRoleProvider>{children}</UserRoleProvider>;
}
