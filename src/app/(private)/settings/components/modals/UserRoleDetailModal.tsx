import React from "react";
import { FiEdit, FiArrowLeft } from "react-icons/fi";

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

interface UserRoleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  onEditClick: () => void;
}

const UserRoleDetailModal: React.FC<UserRoleDetailModalProps> = ({
  isOpen,
  onClose,
  role,
  onEditClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-gray-50 p-4 flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <button onClick={onClose} className="mr-2">
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <span className="text-sm">Settings / User Role / </span>
                <span className="text-[#692E9F]">{role.name}</span>
              </div>
            </div>
            <button
              onClick={onEditClick}
              className="bg-[#692E9F] text-white px-4 py-2 rounded-md hover:bg-purple-800 flex items-center"
            >
              <FiEdit className="mr-2" />
              Edit Role
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Role name
                  </label>
                  <p className="text-gray-800 font-medium">{role.name}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Status
                  </label>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      role.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {role.status}
                  </span>
                </div>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Menu Name
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                    View
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                    Edit
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(role.permissions).map(
                  ([menuName, permissions]) => (
                    <tr key={menuName} className="border-b">
                      <td className="px-4 py-3 text-gray-700">{menuName}</td>
                      <td className="px-4 py-3 text-center">
                        {permissions.view ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                            <svg
                              className="w-4 h-4 text-green-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6">
                            <span className="text-gray-400">-</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {permissions.edit ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                            <svg
                              className="w-4 h-4 text-green-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6">
                            <span className="text-gray-400">-</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {permissions.delete ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                            <svg
                              className="w-4 h-4 text-green-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6">
                            <span className="text-gray-400">-</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleDetailModal;
