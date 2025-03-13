"use client";

import React from "react";
import Link from "next/link";
import { FiArrowLeft, FiEdit } from "react-icons/fi";

interface UserRoleDetailProps {
  roleId: string;
}

const UserRoleDetail: React.FC<UserRoleDetailProps> = ({ roleId }) => {
  const role = {
    id: roleId,
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
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <div className="text-sm text-purple-600 mb-4">
          <Link href="/settings" className="hover:underline">
            Settings
          </Link>{" "}
          /{" "}
          <Link href="/settings/user-role" className="hover:underline">
            User Role
          </Link>{" "}
          / {role.name}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings/user-role" className="mr-2">
              <FiArrowLeft className="text-gray-500" />
            </Link>
            <h2 className="text-xl font-medium">Detail Role</h2>
          </div>
          <Link
            href={`/settings/user-role/${roleId}/edit`}
            className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 flex items-center"
          >
            <FiEdit className="mr-2" />
            Edit Role
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Role name</p>
            <p className="font-medium">{role.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-green-600">{role.status}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Menu Name
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                View
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Edit
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(role.permissions).map(([menuName, perms]) => (
              <tr key={menuName} className="border-b">
                <td className="px-4 py-4 text-gray-700">{menuName}</td>
                <td className="px-4 py-4 text-center">
                  {perms.view ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  {perms.edit ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  {perms.delete ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserRoleDetail;
