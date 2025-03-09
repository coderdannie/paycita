import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { TbEdit } from 'react-icons/tb';

const PersonalInfo = () => {
  return (
    <div>
      <p className="text-[#1D2939] font-semibold text-lg">Personal Info</p>

      <div className="mt-5">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 border-b py-6  shadow-md rounded-lg bg-white">
          <div className="flex flex-wrap items-center space-x-4 md:border-r-2 border-[#E4E7EC]">
            <div>
              <div className="flex items-center gap-1 mb-5">
                <div className="font-semibold text-[#1D2939]">
                  Basic Information
                </div>
                <TbEdit className="text-primary" size={20} />{' '}
              </div>
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
                <Mail className="text-gray-500 w-4 h-4" />{' '}
                sarah.johnson@email.com
              </p>
              <p className="flex items-center gap-2 ">
                <Phone className="text-gray-500 w-4 h-4" /> 081279354621
              </p>
            </div>
          </div>
          <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[200px] ">
            <p className="flex justify-between">
              <strong className=" text-[#667085] font-normal">
                Birth Date:
              </strong>{' '}
              25 Apr 1995
            </p>
            <p className="flex justify-between">
              <strong className="text-[#667085] font-normal">
                Nationality:
              </strong>{' '}
              Nigerian
            </p>
            <p className="flex justify-between">
              <strong className=" text-[#667085] font-normal">
                Marital Status:
              </strong>
              Married
            </p>
          </div>
        </div>

        {/* Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white px-5  py-6 shadow-md  rounded-lg">
            <div className="flex items-center gap-1 mb-5">
              <div className="font-semibold text-[#1D2939]">Address</div>
              <TbEdit className="text-primary" size={20} />{' '}
            </div>
            <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[450px] ">
              <p className="flex gap-2 justify-between">
                <strong className=" text-[#667085] font-normal">
                  Primary Address:
                </strong>{' '}
                Adetokumbo Ademola Crescent, Abuja, Federal Capital Territory,
                Nigeria
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">country</strong>{' '}
                Nigerian
              </p>
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">
                  State/Province
                </strong>
                Abuja
              </p>
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">City</strong>
                Post Code
              </p>{' '}
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">City</strong>
                900001
              </p>
            </div>
          </div>
          <div className="bg-white px-5 h-fit  py-6 shadow-md  rounded-lg">
            <div className="flex items-center gap-1 mb-5">
              <div className="font-semibold text-[#1D2939]">
                Emergency Contact
              </div>
              <TbEdit className="text-primary" size={20} />{' '}
            </div>
            <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[450px] ">
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">Name</strong>{' '}
                John Doe
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">
                  {' '}
                  Relationship
                </strong>{' '}
                Husband
              </p>
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">
                  Phone Number
                </strong>
                082132535462
              </p>{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PersonalInfo;
