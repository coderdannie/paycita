import React, { useState } from "react";
import { FiEdit, FiTrash2, FiInfo, FiPlus, FiSearch } from "react-icons/fi";
import Link from "next/link";
import { ChevronsUpDown } from "lucide-react";

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
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search role type"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <FiSearch className="h-5 w-5" />
          </div>
        </div>
        <Link
          href="/settings/user-role/add"
          className="bg-[#692E9F] text-white text-[1rem] px-4 py-2 rounded-md hover:bg-purple-800 flex items-center justify-center whitespace-nowrap w-full md:w-auto"
        >
          <span>Add User Role</span>
          <FiPlus className="ml-2" />
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse border border-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-sm font-medium text-[gray-600]">
                Role Name
                <ChevronsUpDown className="ml-1 inline-block text-[#98A2B3]" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 text-gray-700 flex justify-between items-center">
                  {role.name}
                  <div className="flex space-x-2">
                    <Link
                      href={`/settings/user-role/${role.id}`}
                      className="p-1.5 rounded-[.5rem] border border-gray-200 hover:bg-gray-100"
                      title="View details"
                    >
                      <FiInfo className="w-4 h-4 text-gray-500" />
                    </Link>
                    <Link
                      href={`/settings/user-role/${role.id}/edit`}
                      className="p-1.5 rounded-[.5rem]  border hover:bg-gray-100"
                      title="Edit role"
                    >
                      <FiEdit className="w-5 h-5 text-gray-500" />
                    </Link>
                    <button
                      className="p-1.5 rounded-[.5rem] border hover:bg-gray-100"
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
