import { useAuthSelector } from "@/src/Redux/selectors";
import { formatLongCurrency } from "@/src/utils/helper";
import { TbEdit } from "react-icons/tb";
const EmployeeDetails = ({
  userDetails,
}: {
  userDetails: {
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
  };
}) => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || "NGN";

  return (
    <div>
      {" "}
      <p className="text-[#1D2939] font-semibold text-lg">Employee Details</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Basic Information */}
        <div className="bg-white px-5 py-6 shadow-md rounded-lg">
          <div className="flex items-center gap-1 mb-5">
            <div className="font-semibold text-[#1D2939]">
              Basic Information
            </div>
            <TbEdit className="text-primary" size={20} />
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
            <TbEdit className="text-primary" size={20} />
          </div>
          <div className="flex font-semibold text-sm flex-col space-y-2 max-w-[300px]">
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Basic Salary
              </strong>
              {formatLongCurrency(+userDetails?.salary, currency) ?? "N/A"}
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Tax Status</strong>
              <span className="font-semibold">
                {userDetails?.tax_status ?? "N/A"}
              </span>
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Pension Number</strong>
              {userDetails?.pension_number ?? "N/A"}
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">Tax Method</strong>
              {userDetails?.tax_method ?? "N/A"}
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
            <TbEdit className="text-primary" size={20} />
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
    </div>
  );
};
export default EmployeeDetails;
