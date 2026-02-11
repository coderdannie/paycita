import { useAuthSelector } from "@/src/Redux/selectors";
import { formatLongCurrency } from "@/src/utils/helper";
import { TbEdit } from "react-icons/tb";
import { useState } from "react";
import EditBasicInformationModal from "../modals/detail-basics";
import EditPayrollTaxModal from "../modals/payroll-tax";
import EditItemsGivenModal from "../modals/items-given";
import { useParams } from "next/navigation";
import {
  useUpdateEmployeeSalaryDetails,
  useUpdateEmployeeWorkDetails,
} from "@/src/hooks/dashboard/useDashboard";
import { useToast } from "@/src/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";

interface EmployeeDetailsProps {
  office_items_given: string[];
  tax_method: string;
  pension_company: string;
  pension_number: string;
  tax_status: string;
  salary: string;
  rent?: string;
  proof_of_rent?: string;
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
  unit?: {
    id: number;
    name: string;
  };
  division?: {
    id: number;
    name: string;
  };
  branch?: {
    id: number;
    name: string;
  };

  payee_id: string;
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
  const currency = userData?.user?.currency || "NGN";

  // Prepare employee data for the EditBasicInformationModal
  const employeeDataForModal = {
    id: 1, // You might want to pass this as a prop or get it from userDetails
    employee_number: userDetails?.employee_number || "",
    full_name: userDetails?.full_name || "",
    job_title: userDetails?.job_title || "",
    job_level: userDetails?.job_level || "",
    employment_type: userDetails?.employment_type || "",
    job_location: userDetails?.job_location || "",
    hire_date: userDetails?.hire_date || "",
    email: userDetails?.email || "",
    salary: userDetails?.salary || "",
    bank_name: userDetails?.bank_name || null,
    bank_account_number: userDetails?.bank_account_number || null,
    bank_account_name: userDetails?.bank_account_name || null,
    pension_number: userDetails?.pension_number || null,
    tax_status: userDetails?.tax_status,
    pension_company: userDetails?.pension_company,
    department: {
      id: userDetails?.department?.id,
      name: userDetails?.department?.name,
    },
    branch: {
      id: userDetails?.branch?.id,
      name: userDetails?.branch?.name,
    },
    division: {
      id: userDetails?.division?.id,
      name: userDetails?.division?.name,
    },
    unit: {
      id: userDetails?.unit?.id,
      name: userDetails?.unit?.name,
    },

    payee_id: userDetails?.payee_id,
    rent: userDetails?.rent || "",
    proof_of_rent: userDetails?.proof_of_rent || "",
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
          division_id: updatedData.division?.id,
          unit_id: updatedData.unit.id,
        },
      },
      {
        onSuccess: () => {
          addToast("Updated successfully", "success");
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
          });
          handleCloseEditBasicInfoModal();
        },
        onError: () => {
          addToast("Update failed", "error");
        },
      },
    );
  };

  // Add handlers for Payroll Tax Modal
  const handleOpenEditPayrollTaxModal = () => {
    setIsEditPayrollTaxModalOpen(true);
  };

  const handleCloseEditPayrollTaxModal = () => {
    setIsEditPayrollTaxModalOpen(false);
  };

  const handleSavePayrollTax = (updatedData: {
    salary: string;
    tax_status?: string;
    pension_number?: string;
    pension_company?: string;
    payee_id?: string;
    rent?: string;
    proof_of_rent?: File | null;
  }) => {
    // Handle the updated payroll tax data here

    const sanitizedSalary = updatedData.salary
      .toString()
      .replace(/[^0-9.]/g, "") as `${number}`;
    const sanitizedRent = updatedData.rent
      ? (updatedData.rent.toString().replace(/[^0-9.]/g, "") as `${number}`)
      : undefined;

    const shouldUploadProof =
      typeof window !== "undefined" &&
      updatedData.proof_of_rent instanceof File;

    const payloadData = shouldUploadProof
      ? (() => {
          const formData = new FormData();
          formData.append("salary", sanitizedSalary);
          if (updatedData.tax_status)
            formData.append("tax_status", updatedData.tax_status);
          if (updatedData.pension_number)
            formData.append("pension_number", updatedData.pension_number);
          if (updatedData.pension_company)
            formData.append("pension_company", updatedData.pension_company);
          if (updatedData.payee_id)
            formData.append("employee_payee_id", updatedData.payee_id);
          if (sanitizedRent) formData.append("rent", sanitizedRent);
          formData.append("proof_of_rent", updatedData.proof_of_rent as File);
          return formData;
        })()
      : {
          salary: sanitizedSalary,
          tax_status: updatedData.tax_status,
          pension_number: updatedData.pension_number,
          pension_company: updatedData.pension_company,
          employee_payee_id: updatedData.payee_id,
          rent: sanitizedRent,
        };

    mutate(
      {
        userId: employeeId,
        data: payloadData,
      },
      {
        onSuccess: () => {
          addToast("Updated successfully", "success");
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
          });
          handleCloseEditPayrollTaxModal();
        },
        onError: () => {
          addToast("Update failed", "error");
        },
      },
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
    console.log(updatedItems);
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
                ● {userDetails?.status ?? "N/A"}
              </span>
            </p>
            <p className="text-[#667085] font-normal">
              Employee Number:{userDetails?.employee_number ?? "N/A"}
            </p>
            <p className="font-semibold">Name of the Business</p>
            <p className="flex gap-10 pt-5">
              <strong className="text-[#667085] font-normal">Job Title</strong>
              {userDetails?.job_title ?? "N/A"}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Department</strong>
              {userDetails?.department?.name ?? "N/A"}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Branch</strong>
              {userDetails?.branch?.name ?? "N/A"}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Job Level</strong>
              {userDetails?.job_level ?? "N/A"}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">
                Employment Type
              </strong>
              {userDetails?.employment_type ?? "N/A"}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Division</strong>
              {userDetails?.division?.name ?? "N/A"}
            </p>{" "}
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Unit</strong>
              {userDetails?.unit?.name ?? "N/A"}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">
                Location Type
              </strong>
              {userDetails?.job_location ?? "N/A"}
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Hire Date</strong>
              <span className="font-semibold">
                {userDetails?.hire_date ?? "N/A"}
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
              {userDetails?.bank_name ?? "N/A"}
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Account Number
              </strong>
              <span className="font-semibold">
                {userDetails?.bank_account_number ?? "N/A"}
              </span>
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Account Holder Name
              </strong>
              {userDetails?.bank_account_name ?? "N/A"}
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
              <strong className="text-[#667085] font-normal">Netpay</strong>
              {formatLongCurrency(+userDetails?.salary, currency) ?? "N/A"}
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Rent</strong>
              {userDetails?.rent
                ? formatLongCurrency(Number(userDetails.rent), currency)
                : "N/A"}
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Tax Status</strong>
              <span className="font-semibold">
                {userDetails?.tax_status ?? "N/A"}
              </span>
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Pension Number
              </strong>
              {userDetails?.pension_number ?? "N/A"}
            </p>
            {/* <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Tax Method</strong>
              {userDetails?.tax_method ?? 'N/A'}
            </p> */}
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Payee ID</strong>
              {userDetails?.payee_id ?? "N/A"}
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Proof of Rent
              </strong>
              {userDetails?.proof_of_rent ? (
                <a
                  href={userDetails.proof_of_rent}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  View
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Pension Company
              </strong>
              {userDetails?.pension_company ?? "N/A"}
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
                ),
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
