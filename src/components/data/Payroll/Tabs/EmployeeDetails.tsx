import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { GoChevronDown } from 'react-icons/go';

const compensationDetails = [
  { label: 'Total Compensation', value: '$3,600', isTotal: true },
  { label: 'Base Salary', value: '$3,000' },
  { label: 'Allowance', value: '$600' },
  { label: 'Deductions', value: '$0.00' },
];

const EmployeeDetails = () => {
  return (
    <div>
      {/* Basic Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 border py-6 rounded-lg bg-white">
        <div className="flex flex-wrap items-center space-x-4 md:border-r-2 border-[#E4E7EC]">
          <div>
            <Image
              src="/assets/avatar.jpeg"
              alt="Profile"
              className="w-[140px] h-[140px] rounded-full object-top object-cover"
              width={100}
              height={100}
            />
          </div>

          <div className="text-sm text-[#667085] grid gap-3">
            <h3 className="font-semibold text-[#1D2939] text-base">
              Sarah Johnson
            </h3>
            <p>♀ Female</p>
            <p className="flex items-center gap-2 ">
              <Mail className="text-gray-500 w-4 h-4" /> sarah.johnson@email.com
            </p>
            <p className="flex items-center gap-2 ">
              <Phone className="text-gray-500 w-4 h-4" /> 081279354621
            </p>
          </div>
        </div>
        <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[200px] ">
          <p className="flex justify-between">
            <strong className=" text-[#667085] font-normal">
              Employment Type{' '}
            </strong>{' '}
            Contract
          </p>
          <p className="flex justify-between">
            <strong className="text-[#667085] font-normal">Job Title </strong>{' '}
            Backend Developer
          </p>
          <p className="flex justify-between">
            <strong className=" text-[#667085] font-normal">Job Date</strong>
            12 May 2024
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg ">
        <div className="space-y-4 mt-4">
          {compensationDetails.map((detail, index) => (
            <div
              key={index}
              className={`flex justify-between px-5 py-4 items-center rounded-md border-gray-200 ${
                detail.isTotal ? 'bg-[#FAFAFA] border-0' : ' border'
              }`}
            >
              <p>{detail.label}</p>
              <p className="font-semibold">{detail.value}</p>
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
                    <p className="text-sm font-semibold">UBA</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Branch</p>
                    <p className="text-sm font-semibold">Abuja</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Account Name</p>
                    <p className="text-sm font-semibold">Sarah Johnson</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="text-sm font-semibold">09354678829</p>
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
