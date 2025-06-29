import { useAuthSelector } from '@/src/Redux/selectors';
import { formatLongCurrency } from '@/src/utils/helper';
import { TbEdit } from 'react-icons/tb';
import { useState } from 'react';
import EditBasicInformationModal from '../modals/detail-basics';
import EditPayrollTaxModal from '../modals/payroll-tax';
import EditItemsGivenModal from '../modals/items-given';
import { useParams } from 'next/navigation';
import {
  useUpdateEmployeeSalaryDetails,
  useUpdateEmployeeWorkDetails,
} from '@/src/hooks/dashboard/useDashboard';
import { useToast } from '@/src/context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { CompensationDetails } from '@/src/types/dashboard';

interface EmployeeDetailsProps {
  office_items_given: string[];
  tax_method: string;
  pension_company: string;
  pension_number: string;
  tax_status: string;
  salary: string;
  employee_number?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  employment_type?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_name?: string;
  hire_date?: string;
  status?: string;
  job_level?: string;
  job_location?: string;
  job_title?: string;
  gender?: string;
  date_of_birth?: string;
  marital_status?: string;
  department?: {
    id: number;
    name: string;
  };
  branch?: {
    id: number;
    name: string;
  };
}

const EmployeeDetails = ({
  userDetails,
}: {
  userDetails: EmployeeDetailsProps;
}) => {
  const userData = useAuthSelector();
  const [isEditBasicInfoModalOpen, setIsEditBasicInfoModalOpen] =
    useState(false);
  const [isEditPayrollTaxModalOpen, setIsEditPayrollTaxModalOpen] =
    useState(false);
  const [isEditItemsGivenModalOpen, setIsEditItemsGivenModalOpen] =
    useState(false);

  const { id } = useParams();
  const employeeId = id as string;

  const queryClient = useQueryClient();
  const currency = userData?.user?.currency || 'NGN';

  // Prepare employee data for the EditBasicInformationModal
  const employeeDataForModal = {
    id: 1, // You might want to pass this as a prop or get it from userDetails
    employee_number: userDetails?.employee_number || '',
    full_name: userDetails?.full_name || '',
    job_title: userDetails?.job_title || '',
    job_level: userDetails?.job_level || '',
    employment_type: userDetails?.employment_type || '',
    job_location: userDetails?.job_location || '',
    hire_date: userDetails?.hire_date || '',
    email: userDetails?.email || '',
    salary: userDetails?.salary || '',
    bank_name: userDetails?.bank_name || null,
    bank_account_number: userDetails?.bank_account_number || null,
    bank_account_name: userDetails?.bank_account_name || null,

    department: {
      id: userDetails?.department?.id,
      name: userDetails?.department?.name,
    },
    branch: {
      id: userDetails?.branch?.id,
      name: userDetails?.branch?.name,
    },
  };

  const { addToast } = useToast();
  const { mutate: mutateWorkDetails, isPending: isUpdating } =
    useUpdateEmployeeWorkDetails();
  const { mutate, isPending } = useUpdateEmployeeSalaryDetails();

  const handleOpenEditBasicInfoModal = () => {
    setIsEditBasicInfoModalOpen(true);
  };

  const handleCloseEditBasicInfoModal = () => {
    setIsEditBasicInfoModalOpen(false);
  };

  const handleSaveBasicInfo = (updatedData: EmployeeDetailsProps) => {
    mutateWorkDetails(
      {
        userId: employeeId,
        data: {
          job_title: updatedData.job_title,
          job_level: updatedData.job_level,
          department_id: updatedData.department.id,
          branch_id: updatedData?.branch?.id,
          employment_type: updatedData.employment_type,
          job_location: updatedData.job_location,
          hire_date: updatedData.hire_date,
        },
      },
      {
        onSuccess: () => {
          addToast('Updated successfully', 'success');
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
          });
          handleCloseEditBasicInfoModal();
        },
        onError: () => {
          addToast('Update failed', 'error');
        },
      }
    );
  };

  // Add handlers for Payroll Tax Modal
  const handleOpenEditPayrollTaxModal = () => {
    setIsEditPayrollTaxModalOpen(true);
  };

  const handleCloseEditPayrollTaxModal = () => {
    setIsEditPayrollTaxModalOpen(false);
  };

  const handleSavePayrollTax = (updatedData: CompensationDetails) => {
    // Handle the updated payroll tax data here

    mutate(
      {
        userId: employeeId,
        data: {
          salary: updatedData.salary,
          tax_status: updatedData.tax_status,
          pension_number: updatedData.pension_number,
          pension_company: updatedData.pension_company,
        },
      },
      {
        onSuccess: () => {
          addToast('Updated successfully', 'success');
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
          });
          handleCloseEditPayrollTaxModal();
        },
        onError: () => {
          addToast('Update failed', 'error');
        },
      }
    );
  };

  // Add handlers for Items Given Modal
  const handleOpenEditItemsGivenModal = () => {
    setIsEditItemsGivenModalOpen(true);
  };

  const handleCloseEditItemsGivenModal = () => {
    setIsEditItemsGivenModalOpen(false);
  };

  const handleSaveItemsGiven = (updatedItems: string[]) => {
    // Handle the updated items data here
    // You would typically make an API call here to update the items given data
    // and then refresh the component or update the local state
  };

  return (
    <div>
      <p className="text-[#1D2939] font-semibold text-lg">Employee Details</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Basic Information */}
        <div className="bg-white px-5 py-6 shadow-md rounded-lg">
          <div className="flex items-center gap-1 mb-5">
            <div className="font-semibold text-[#1D2939]">
              Basic Information
            </div>
            <TbEdit
              className="text-primary cursor-pointer"
              size={20}
              onClick={handleOpenEditBasicInfoModal}
            />
          </div>
          <div className="flex font-semibold text-sm flex-col space-y-2 max-w-[450px]">
            <p className="flex gap-10">
              <strong className="text-[#1D2939]">
                {userDetails?.full_name}
              </strong>
              <span className="text-green-600 capitalize">
                ● {userDetails?.status ?? 'N/A'}
              </span>
            </p>

            <p className="text-[#667085] font-normal">
              Employee Number:{userDetails?.employee_number ?? 'N/A'}
            </p>
            <p className="font-semibold">Name of the Business</p>
            <p className="flex gap-10 pt-5">
              <strong className="text-[#667085] font-normal">Job Title</strong>
              {userDetails?.job_title ?? 'N/A'}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Department</strong>
              {userDetails?.department?.name ?? 'N/A'}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Branch</strong>
              {userDetails?.branch?.name ?? 'N/A'}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Job Level</strong>
              {userDetails?.job_level ?? 'N/A'}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">
                Employment Type
              </strong>
              {userDetails?.employment_type ?? 'N/A'}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">
                Location Type
              </strong>
              {userDetails?.job_location ?? 'N/A'}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Hire Date</strong>
              <span className="font-semibold">
                {userDetails?.hire_date ?? 'N/A'}
              </span>
            </p>
          </div>
        </div>

        {/* Bank Account */}
        <div className="bg-white px-5 py-6 shadow-md rounded-lg">
          <div className="flex items-center gap-1 mb-5">
            <div className="font-semibold text-[#1D2939]">Bank Account</div>
            <TbEdit className="text-primary" size={20} />
          </div>
          <div className="flex font-semibold text-sm flex-col space-y-2 max-w-[300px]">
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Bank Type</strong>
              {userDetails?.bank_name ?? 'N/A'}
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Account Number
              </strong>
              <span className="font-semibold">
                {userDetails?.bank_account_number ?? 'N/A'}
              </span>
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Account Holder Name
              </strong>
              {userDetails?.bank_account_name ?? 'N/A'}
            </p>
          </div>
        </div>

        {/* Payroll And Tax */}
        <div className="bg-white px-5 py-6 shadow-md rounded-lg">
          <div className="flex items-center gap-1 mb-5">
            <div className="font-semibold text-[#1D2939]">Payroll & Tax</div>
            <TbEdit
              className="text-primary cursor-pointer"
              size={20}
              onClick={handleOpenEditPayrollTaxModal}
            />
          </div>
          <div className="flex font-semibold text-sm flex-col space-y-2 max-w-[300px]">
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Basic Salary
              </strong>
              {formatLongCurrency(+userDetails?.salary, currency) ?? 'N/A'}
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Tax Status</strong>
              <span className="font-semibold">
                {userDetails?.tax_status ?? 'N/A'}
              </span>
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Pension Number
              </strong>
              {userDetails?.pension_number ?? 'N/A'}
            </p>
            {/* <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Tax Method</strong>
              {userDetails?.tax_method ?? 'N/A'}
            </p> */}
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Pension Company
              </strong>
              {userDetails?.pension_company ?? 'N/A'}
            </p>
          </div>
        </div>

        {/* Items Given */}
        <div className="bg-white px-5 py-6 shadow-md rounded-lg">
          <div className="flex items-center gap-1 mb-5">
            <div className="font-semibold text-[#1D2939]">Item given</div>
            <TbEdit
              className="text-primary cursor-pointer"
              size={20}
              onClick={handleOpenEditItemsGivenModal}
            />
          </div>
          {userDetails?.office_items_given?.length > 0 ? (
            <div className="flex font-semibold text-sm flex-col space-y-2 max-w-[300px]">
              {userDetails?.office_items_given?.map(
                (item: string, index: number) => (
                  <p key={index} className="flex gap-6">
                    <strong className="text-[#667085] font-normal">
                      {item}
                    </strong>
                  </p>
                )
              )}
            </div>
          ) : (
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                No items given
              </strong>
            </p>
          )}
        </div>
      </div>

      {/* Edit Basic Information Modal */}
      <EditBasicInformationModal
        isOpen={isEditBasicInfoModalOpen}
        onClose={handleCloseEditBasicInfoModal}
        employee={employeeDataForModal}
        onSave={handleSaveBasicInfo}
        isUpdating={isUpdating}
      />

      {/* Edit Payroll Tax Modal */}
      <EditPayrollTaxModal
        isOpen={isEditPayrollTaxModalOpen}
        onClose={handleCloseEditPayrollTaxModal}
        employee={employeeDataForModal}
        onSave={handleSavePayrollTax}
        isUpdating={isPending}
      />

      {/* Edit Items Given Modal */}
      <EditItemsGivenModal
        isOpen={isEditItemsGivenModalOpen}
        onClose={handleCloseEditItemsGivenModal}
        currentItems={userDetails?.office_items_given || []}
        onSave={handleSaveItemsGiven}
      />
    </div>
  );
};

export default EmployeeDetails;
