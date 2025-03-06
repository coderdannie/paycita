import Image from "next/image";
import { HiOutlineBell } from "react-icons/hi2";
import { IoMenuSharp } from "react-icons/io5";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] w-full flex justify-between bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] px-6 z-10">
      <div className="flex items-center">
        <button className="lg:hidden block">
          <IoMenuSharp className="text-primary text-2xl" />
        </button>
      </div>

      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative h-fit">
          <HiOutlineBell size={24} className="text-[#808191]" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Image
            src="/assets/avatar.jpeg"
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover object-top"
            width={40}
            height={40}
          />
          <span className="text-[#11142D] font-medium text-sm">
            Hawkins Maru
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
