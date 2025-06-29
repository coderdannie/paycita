'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

interface Permission {
  view: boolean;
  edit: boolean;
  delete: boolean;
}

interface UserRole {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  permissions: {
    [key: string]: Permission;
  };
}

interface UserRoleEditProps {
  roleId?: string;
}

const UserRoleEdit: React.FC<UserRoleEditProps> = ({ roleId }) => {
  const initialRole: UserRole = roleId
    ? {
        id: roleId,
        name: 'Superadmin',
        status: 'Active',
        permissions: {
          Dashboard: { view: true, edit: false, delete: false },
          Attendance: { view: true, edit: true, delete: true },
          Payroll: { view: true, edit: true, delete: true },
          'Purchase Request': { view: true, edit: true, delete: true },
          'Employee Management': { view: true, edit: true, delete: true },
          'Leave Management': { view: true, edit: true, delete: true },
        },
      }
    : {
        id: '',
        name: '',
        status: 'Active',
        permissions: {
          Dashboard: { view: false, edit: false, delete: false },
          Attendance: { view: false, edit: false, delete: false },
          Payroll: { view: false, edit: false, delete: false },
          'Purchase Request': { view: false, edit: false, delete: false },
          'Employee Management': { view: false, edit: false, delete: false },
          'Leave Management': { view: false, edit: false, delete: false },
        },
      };

  const [role, setRole] = useState<UserRole>(initialRole);

  const handlePermissionChange = (
    menuName: string,
    permType: keyof Permission,
    value: boolean
  ) => {
    setRole((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [menuName]: {
          ...prev.permissions[menuName],
          [permType]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    window.location.href = roleId
      ? `/settings/user-role/${roleId}`
      : '/settings/user-role';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <div className="text-sm text-[#692E9F] mb-4">
          <Link href="/settings" className="hover:underline">
            Settings
          </Link>{' '}
          /{' '}
          <Link href="/settings/user-role" className="hover:underline">
            User Role
          </Link>{' '}
          {roleId && (
            <>
              /{' '}
              <Link
                href={`/settings/user-role/${roleId}`}
                className="hover:underline"
              >
                {role.name}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center mb-6">
          <Link
            href={
              roleId ? `/settings/user-role/${roleId}` : '/settings/user-role'
            }
            className="mr-2"
          >
            <FiArrowLeft className="text-gray-500" />
          </Link>
          <h2 className="text-xl font-medium">Edit Role</h2>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-4">
          <label
            htmlFor="roleName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role Name
          </label>
          <input
            type="text"
            id="roleName"
            value={role.name}
            onChange={(e) => setRole({ ...role, name: e.target.value })}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex items-center">
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                role.status === 'Active' ? 'bg-[#692E9F]' : 'bg-gray-300'
              }`}
              onClick={() =>
                setRole({
                  ...role,
                  status: role.status === 'Active' ? 'Inactive' : 'Active',
                })
              }
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  role.status === 'Active' ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </div>
            <span className="ml-2 text-sm text-gray-600">{role.status}</span>
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
                  <input
                    type="checkbox"
                    checked={perms.view}
                    onChange={(e) =>
                      handlePermissionChange(menuName, 'view', e.target.checked)
                    }
                    className="w-5 h-5 text-[#692E9F] rounded focus:ring-purple-500"
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={perms.edit}
                    onChange={(e) =>
                      handlePermissionChange(menuName, 'edit', e.target.checked)
                    }
                    className="w-5 h-5 text-[#692E9F] rounded focus:ring-purple-500"
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={perms.delete}
                    onChange={(e) =>
                      handlePermissionChange(
                        menuName,
                        'delete',
                        e.target.checked
                      )
                    }
                    className="w-5 h-5 text-[#692E9F] rounded focus:ring-purple-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6 space-x-4">
        <Link
          href={
            roleId ? `/settings/user-role/${roleId}` : '/settings/user-role'
          }
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#692E9F] text-white rounded-md hover:bg-purple-800"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UserRoleEdit;
