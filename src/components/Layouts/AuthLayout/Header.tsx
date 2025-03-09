import Image from "next/image";
import { HiOutlineBell } from "react-icons/hi2";
import { IoMenuSharp } from "react-icons/io5";

const Header = () => {
  return (
    <header className="h-[70px] fixed top-0 left-0 w-full flex max-999:justify-between justify-end bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] z-30 px-[30px]">
      <button className=" max-999:block hidden">
        <IoMenuSharp className="text-primary text-3xl" />
      </button>
      <div className="flex items-center gap-[20px] ">
        {/* Notification Bell */}

      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative h-fit">
          <HiOutlineBell size={28} className=" text-[#808191] font-semibold" />
          <span className="absolute top-0 right-0 transform  w-2.5 h-2.5   rounded-full"></span>
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
      </div>
    </header>
  );
};

export default Header;
