"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Permission {
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  permissions: { [key: string]: Permission };
}

interface UserRoleContextType {
  userRoles: UserRole[];
  addUserRole: (role: Omit<UserRole, "id">) => UserRole; // Fixed the Omit type
  updateUserRole: (role: UserRole) => void;
  deleteUserRole: (id: string) => void;
  getUserRoleById: (id: string) => UserRole | undefined;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(
  undefined
);

export const useUserRoles = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRoles must be used within a UserRoleProvider");
  }
  return context;
};

interface UserRoleProviderProps {
  children: ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({
  children,
}) => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([
    {
      id: "1",
      name: "Superadmin",
      status: "Active",
      permissions: {
        Dashboard: { view: true, edit: false, delete: false },
        Attendance: { view: true, edit: true, delete: true },
        Payroll: { view: true, edit: true, delete: true },
        "Purchase Request": { view: true, edit: true, delete: true },
        "Employee Management": { view: true, edit: true, delete: true },
        "Leave Management": { view: true, edit: true, delete: true },
      },
    },
    {
      id: "2",
      name: "HR Manager",
      status: "Active",
      permissions: {
        Dashboard: { view: true, edit: false, delete: false },
        Attendance: { view: true, edit: true, delete: false },
        Payroll: { view: true, edit: true, delete: false },
        "Purchase Request": { view: false, edit: false, delete: false },
        "Employee Management": { view: true, edit: true, delete: false },
        "Leave Management": { view: true, edit: true, delete: false },
      },
    },
    {
      id: "3",
      name: "Staff",
      status: "Active",
      permissions: {
        Dashboard: { view: true, edit: false, delete: false },
        Attendance: { view: true, edit: false, delete: false },
        Payroll: { view: false, edit: false, delete: false },
        "Purchase Request": { view: false, edit: false, delete: false },
        "Employee Management": { view: false, edit: false, delete: false },
        "Leave Management": { view: true, edit: false, delete: false },
      },
    },
  ]);

  const addUserRole = (role: Omit<UserRole, "id">) => {
    const newRole = { ...role, id: Date.now().toString() }; 
    setUserRoles((prev) => [...prev, newRole]);
    return newRole;
  };

  const updateUserRole = (updatedRole: UserRole) => {
    setUserRoles((prev) =>
      prev.map((role) => (role.id === updatedRole.id ? updatedRole : role))
    );
  };

  const deleteUserRole = (id: string) => {
    setUserRoles((prev) => prev.filter((role) => role.id !== id));
  };

  const getUserRoleById = (id: string) => {
    return userRoles.find((role) => role.id === id);
  };

  return (
    <UserRoleContext.Provider
      value={{
        userRoles,
        addUserRole,
        updateUserRole,
        deleteUserRole,
        getUserRoleById,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};
