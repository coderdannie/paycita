import Image from 'next/image';
import { HiOutlineBell } from 'react-icons/hi2';
import { IoMenuSharp } from 'react-icons/io5';

const Header = () => {
  return (
    <header className="h-[70px] w-full flex max-999:justify-between justify-end bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] px-[30px]">
      <button className=" max-999:block hidden">
        <IoMenuSharp className="text-primary text-3xl" />
      </button>
      <div className="flex items-center gap-[20px] ">
        {/* Notification Bell */}

        <button className="relative h-fit">
          <HiOutlineBell size={28} className=" text-[#808191] font-semibold" />
          <span className="absolute top-0 right-0 transform  w-2.5 h-2.5  bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-[10px]">
          <Image
            src="/assets/avatar.jpeg"
            alt="User profile"
            className="w-[40px] aspect-square  rounded-full object-cover object-top"
            width={100}
            height={100}
          />
          <span className="text-[#11142D] font-semibold font-sm">
            Hawkins Maru
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
