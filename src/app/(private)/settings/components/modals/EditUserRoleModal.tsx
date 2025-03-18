import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

interface UserRole {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  permissions: {
    [key: string]: {
      view: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

interface EditUserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole | null;
  onSave: (role: UserRole) => void;
}
const EditUserRoleModal: React.FC<EditUserRoleModalProps> = ({
  isOpen,
  onClose,
  role,
  onSave,
}) => {
  // Default menu items
  const defaultMenuItems = React.useMemo(
    () => [
      'Dashboard',
      'Attendance',
      'Payroll',
      'Purchase Request',
      'Employee Management',
      'Leave Management',
    ],
    []
  );

  const [formState, setFormState] = useState<{
    id: string;
    name: string;
    status: 'Active' | 'Inactive';
    permissions: {
      [key: string]: {
        view: boolean;
        edit: boolean;
        delete: boolean;
      };
    };
  }>({
    id: '',
    name: '',
    status: 'Active',
    permissions: defaultMenuItems.reduce((acc, menu) => {
      acc[menu] = { view: false, edit: false, delete: false };
      return acc;
    }, {} as { [key: string]: { view: boolean; edit: boolean; delete: boolean } }),
  });

  // Initialize form with existing role data or defaults
  useEffect(() => {
    if (role) {
      setFormState({
        id: role.id,
        name: role.name,
        status: role.status,
        permissions: { ...role.permissions },
      });
    } else {
      // For new role
      setFormState({
        id: '',
        name: '',
        status: 'Active',
        permissions: defaultMenuItems.reduce((acc, menu) => {
          acc[menu] = { view: false, edit: false, delete: false };
          return acc;
        }, {} as { [key: string]: { view: boolean; edit: boolean; delete: boolean } }),
      });
    }
  }, [role, defaultMenuItems]);

  if (!isOpen) return null;

  const handlePermissionChange = (
    menuName: string,
    permissionType: 'view' | 'edit' | 'delete',
    value: boolean
  ) => {
    setFormState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [menuName]: {
          ...prev.permissions[menuName],
          [permissionType]: value,
        },
      },
    }));
  };

  const handleSubmit = () => {
    -formState;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-gray-50 p-4 flex items-center">
            <button onClick={onClose} className="mr-2">
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div className="text-gray-600">
              <span className="text-sm">
                {role ? 'Edit Role' : 'Add User Role'}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Status
                  </label>
                  <div className="flex items-center">
                    <div
                      className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                        formState.status === 'Active'
                          ? 'bg-purple-700'
                          : 'bg-gray-200'
                      }`}
                      onClick={() =>
                        setFormState({
                          ...formState,
                          status:
                            formState.status === 'Active'
                              ? 'Inactive'
                              : 'Active',
                        })
                      }
                    >
                      <span
                        className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                          formState.status === 'Active'
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-700">
                      {formState.status}
                    </span>
                  </div>
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
                    <div className="flex items-center justify-center">
                      <span>View</span>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                    <div className="flex items-center justify-center">
                      <span>Edit</span>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                    <div className="flex items-center justify-center">
                      <span>Delete</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formState.permissions).map(
                  ([menuName, permissions]) => (
                    <tr key={menuName} className="border-b">
                      <td className="px-4 py-3 text-gray-700">{menuName}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={permissions.view}
                          onChange={(e) =>
                            handlePermissionChange(
                              menuName,
                              'view',
                              e.target.checked
                            )
                          }
                          className="w-5 h-5 rounded text-purple-700 focus:ring-purple-600"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={permissions.edit}
                          onChange={(e) =>
                            handlePermissionChange(
                              menuName,
                              'edit',
                              e.target.checked
                            )
                          }
                          className="w-5 h-5 rounded text-purple-700 focus:ring-purple-600"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={permissions.delete}
                          onChange={(e) =>
                            handlePermissionChange(
                              menuName,
                              'delete',
                              e.target.checked
                            )
                          }
                          className="w-5 h-5 rounded text-purple-700 focus:ring-purple-600"
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800"
              >
                {role ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditUserRoleModal;
