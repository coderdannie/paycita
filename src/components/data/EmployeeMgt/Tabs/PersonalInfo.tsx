import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { TbEdit } from "react-icons/tb";

const PersonalInfo = ({
  user,
}: {
  user: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    gender?: string;
    marital_status?: string;
    emergency_contact_name?: string;
    emergency_contact_relationship?: string;
    emergency_contact_phone?: string;
    country?: string;
    address?: string;
    state?: string;
    post_code?: string;
    city?: string;
    date_of_birth?: string;
    profile_picture?: string;
  };
}) => {
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
                <TbEdit className="text-primary" size={20} />{" "}
              </div>
              <Image
                src={user?.profile_picture ?? "/assets/avatar.jpeg"}
                alt="Profile"
                className="w-[140px] h-[140px] rounded-full object-top object-cover"
                width={100}
                height={100}
              />
            </div>

            <div className="text-sm text-[#667085] grid gap-3">
              <h3 className="font-semibold text-[#1D2939] text-base">
                {user?.full_name ?? "N/A"}
              </h3>
              <p>♀ {user?.gender ?? "N/A"}</p>
              <p className="flex items-center gap-2 ">
                <Mail className="text-gray-500 w-4 h-4" />{" "}
                {user?.email ?? "N/A"}
              </p>
              <p className="flex items-center gap-2 ">
                <Phone className="text-gray-500 w-4 h-4" />{" "}
                {user?.phone_number ?? "N/A"}
              </p>
            </div>
          </div>
          <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[200px] ">
            <p className="flex justify-between">
              <strong className=" text-[#667085] font-normal">
                Birth Date:
              </strong>{" "}
              {user?.date_of_birth ?? "N/A"}
            </p>
            <p className="flex justify-between">
              <strong className="text-[#667085] font-normal">
                Nationality:
              </strong>{" "}
              {user?.country ?? "N/A"}
            </p>
            <p className="flex justify-between">
              <strong className=" text-[#667085] font-normal">
                Marital Status:
              </strong>
              {user?.marital_status ?? "N/A"}
            </p>
          </div>
        </div>

        {/* Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white px-5  py-6 shadow-md  rounded-lg">
            <div className="flex items-center gap-1 mb-5">
              <div className="font-semibold text-[#1D2939]">Address</div>
              <TbEdit className="text-primary" size={20} />{" "}
            </div>
            <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[450px] ">
              <p className="flex gap-2 justify-between">
                <strong className=" text-[#667085] font-normal">
                  Primary Address:
                </strong>{" "}
                {user?.address ?? "N/A"}
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">country</strong>{" "}
                {user?.country ?? "N/A"}
              </p>
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">
                  State/Province
                </strong>
                {user?.state ?? "N/A"}
              </p>
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">
                  Post Code
                </strong>
                {user?.post_code ?? "N/A"}
              </p>{" "}
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">City</strong>
                {user?.city ?? "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-white px-5 h-fit  py-6 shadow-md  rounded-lg">
            <div className="flex items-center gap-1 mb-5">
              <div className="font-semibold text-[#1D2939]">
                Emergency Contact
              </div>
              <TbEdit className="text-primary" size={20} />{" "}
            </div>
            <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[450px] ">
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">Name</strong>{" "}
                {user?.emergency_contact_name ?? "N/A"}
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">
                  {" "}
                  Relationship
                </strong>{" "}
                {user?.emergency_contact_relationship ?? "N/A"}
              </p>
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">
                  Phone Number
                </strong>

                {user?.emergency_contact_phone ?? "N/A"}
              </p>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PersonalInfo;
