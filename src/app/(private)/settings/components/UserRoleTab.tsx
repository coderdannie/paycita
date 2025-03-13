import React, { useState } from "react";
import { FiEdit, FiTrash2, FiInfo, FiPlus } from "react-icons/fi";
import Link from "next/link";

interface UserRole {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  permissions: {
    [key: string]: {
      view: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

const UserRoleTab: React.FC = () => {
  const [userRoles] = useState<UserRole[]>([
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

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoles = userRoles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search role type"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <Link
          href="/settings/user-role/add"
          className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 flex items-center ml-4"
        >
          <FiPlus className="mr-2" />
          Add User Role
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Role Name
                <span className="ml-1 inline-block">↓</span>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 text-gray-700">{role.name}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-center space-x-2">
                    <Link
                      href={`/settings/user-role/${role.id}`}
                      className="p-1.5 rounded-full hover:bg-gray-100"
                      title="View details"
                    >
                      <FiInfo className="w-5 h-5 text-gray-500" />
                    </Link>
                    <Link
                      href={`/settings/user-role/${role.id}/edit`}
                      className="p-1.5 rounded-full hover:bg-gray-100"
                      title="Edit role"
                    >
                      <FiEdit className="w-5 h-5 text-gray-500" />
                    </Link>
                    <button
                      className="p-1.5 rounded-full hover:bg-gray-100"
                      title="Delete role"
                    >
                      <FiTrash2 className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UserRoleTab;
