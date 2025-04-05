import { TbEdit } from "react-icons/tb";
const EmployeeDetails = ({
  userDetails,
}: {
  userDetails: {
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
      </div>
    </div>
  );
};
export default EmployeeDetails;
