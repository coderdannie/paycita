import { TbEdit } from 'react-icons/tb';
const EmployeeDetails = () => {
  return (
    <div>
      {' '}
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
              <strong className="text-[#1D2939]">Sarah Johnson</strong>
              <span className="text-green-600">● Active</span>
            </p>
            <p className="text-[#667085] font-normal">
              Employee Number: DT00123
            </p>
            <p className="font-semibold">Name of the Business</p>
            <p className="flex gap-10 pt-5">
              <strong className="text-[#667085] font-normal">Job Title</strong>
              Backend Developer
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Job Level</strong>
              Staff
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">
                Employment Type
              </strong>
              Contract
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">
                Location Type
              </strong>
              Remote
            </p>
            <p className="flex gap-10">
              <strong className="text-[#667085] font-normal">Hire Date</strong>
              <span className="font-semibold">30 Jan 2023</span>
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
              UBA
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Account Number
              </strong>
              <span className="font-semibold">09354678829</span>
            </p>
            <p className="flex gap-6">
              <strong className="text-[#667085] font-normal">
                Account Holder Name
              </strong>
              Sarah Johnson
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmployeeDetails;
