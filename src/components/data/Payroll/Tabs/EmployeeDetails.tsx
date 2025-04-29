import { useAuthSelector } from "@/src/Redux/selectors";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { GoChevronDown } from "react-icons/go";

const getCompensationDetails = (
  net: number,
  basic: number,
  deductions: number
) => [
  {
    label: "Total Compensation",
    value: `${net}`,
    isTotal: true,
  },
  { label: "Base Salary", value: `${basic}` },
  // { label: "Allowance", value: "$600" },
  { label: "Deductions", value: `${deductions}` },
];

const EmployeeDetails = ({
  details,
}: {
  details: {
    profile_picture: string;
    employee_name: string;
    email: string;
    phone_number: string;
    sex: string;
    employment_type: string;
    job_title: string;
    job_date: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_name: string;
    net_pay: number;
    gross_income: number;
    deductions: number;
  };
}) => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || "NGN";

  return (
    <div>
      {/* Basic Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 border py-6 rounded-lg bg-white">
        <div className="flex flex-wrap items-center space-x-4 md:border-r-2 border-[#E4E7EC]">
          <div>
            <Image
              src={details.profile_picture || "/images/placeholder.png"}
              alt="Profile"
              className="w-[140px] h-[140px] rounded-full object-top object-cover"
              width={100}
              height={100}
            />
          </div>

          <div className="text-sm text-[#667085] grid gap-3">
            <h3 className="font-semibold text-[#1D2939] text-base">
              {details.employee_name}
            </h3>
            <p>{details.sex === "Male" ? "♂ Male" : "♀ Female"}</p>
            <p className="flex items-center gap-2 ">
              <Mail className="text-gray-500 w-4 h-4" />{" "}
              {details.email || "n/a"}
            </p>
            <p className="flex items-center gap-2 ">
              <Phone className="text-gray-500 w-4 h-4" />{" "}
              {details.phone_number || "n/a"}
            </p>
          </div>
        </div>
        <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[200px] ">
          <p className="flex justify-between">
            <strong className=" text-[#667085] font-normal">
              Employment Type{" "}
            </strong>{" "}
            {details.employment_type}
          </p>
          <p className="flex justify-between">
            <strong className="text-[#667085] font-normal">Job Title </strong>{" "}
            {details.job_title}
          </p>

          <p className="flex justify-between">
            <strong className="text-[#667085] font-normal">Job Date</strong>
            {details.job_date}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg ">
        <div className="space-y-4 mt-4">
          {getCompensationDetails(
            details.net_pay,
            details.gross_income,
            details.deductions
          ).map((detail, index) => (
            <div
              key={index}
              className={`flex justify-between px-5 py-4 items-center rounded-md border-gray-200 ${
                detail.isTotal ? "bg-[#FAFAFA] border-0" : " border"
              }`}
            >
              <p>{detail.label}</p>
              <p className="font-semibold">
                {currency}
                {detail.value}
              </p>
            </div>
          ))}

          {/* Bank Information Header */}
          <div className="border border-[#E4E7EC] rounded-md px-4  pb-7 pt-6">
            <div className="flex justify-between items-center">
              <div className="font-semibold pb-3">Bank Information</div>
              <GoChevronDown />
            </div>

            {/* Bank Information Details */}
            <div className="pt-4 px-4 border-t border-[#E4E7EC]">
              <div className="flex justify-between flex-wrap gap-4">
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Bank Name</p>
                    <p className="text-sm font-semibold">{details.bank_name}</p>
                  </div>
                  {/* <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Branch</p>
                    <p className="text-sm font-semibold">Abuja</p>
                  </div> */}
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Account Name</p>
                    <p className="text-sm font-semibold">
                      {details.bank_account_name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="text-sm font-semibold">
                      {details.bank_account_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmployeeDetails;
