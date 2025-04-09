'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { sidebarData } from '../../common/constants';
import Image from 'next/image';
import logoutIcon from '../../../../public/assets/logout.svg';
import { useAuthSelector } from '@/src/Redux/selectors';

interface SidebarProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const SideDrawer = ({ isDrawerOpen, toggleDrawer }: SidebarProps) => {  const userData = useAuthSelector();
  const isVisible = userData?.user?.feature?.employee_loan === "1";
  const [showMenu, setShowMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  const filteredSidebarData = sidebarData.filter(item =>
    item.title !== 'Loan' || isVisible
  );
  return (
    <>
      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-screen w-[252px] bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="mt-[40px]">
            <div className=" sticky top-0 pl-5 ">
              <Image
                src="/assets/logo.jpg"
                alt="paycita logo"
                width={100}
                height={100}
              />
            </div>
            <div className="">
              <div className="flex-1">
                {filteredSidebarData.map((item) => (
                  <div key={item.title} className="mb-2">
                    <div
                      className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-300 relative ${
                        pathname.includes(item.path)
                          ? 'bg-[#F0EAF5] text-primary before:content-[""] before:absolute before:top-0 before:right-[10px] before:h-[50%] before:translate-y-[45%] before:w-[4px] before:bg-primary'
                          : 'bg-transparent text-[#616161] hover:bg-[#F0EAF5]'
                      }`}
                      onClick={() => {
                        if (item.sub) {
                          setShowMenu((prev) =>
                            prev && currentIndex === item.title ? false : true
                          );
                          setCurrentIndex(item.title);
                          if (!pathname.includes(item.sub[0].path)) {
                            router.push(item.sub[0].path);
                          }
                        } else {
                          router.push(item.path);
                          setShowMenu(false);
                          setCurrentIndex('');
                        }
                      }}
                    >
                      <span className="mr-4">
                        {pathname.includes(item.path) ? item.hover : item.icon}
                      </span>
                      <span className="text-sm">{item.title}</span>
                      {item.sub && (
                        <span className="ml-auto">
                          {showMenu && currentIndex === item.title ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      )}
                    </div>
                    {item.sub && showMenu && currentIndex === item.title && (
                      <div className="mt-2 pl-8">
                        {item.sub.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.path}
                            className={`py-2 px-3 rounded-lg text-sm flex items-center gap-2 ${
                              pathname.includes(subItem.path)
                                ? 'text-primary'
                                : 'text-[#757575] hover:text-primary'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="pb-[90px] hover:text-red-500 flex border-[#314169] p-4 text-center text-sm cursor-pointer"
            onClick={handleLogout}
          >
            <div className="flex gap-2"></div>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-[12px]">
                <span className="border-red-600 w-4 h-4 rounded-full border-2 animate-spin"></span>
                Logging Out
              </div>
            ) : (
              <div className="flex items-center text-sm text-[#344054] justify-center gap-2">
                <Image src={logoutIcon} alt="logout icon" />
                <p>Logout</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleDrawer}
        ></div>
      )}
    </>
  );
};

export default SideDrawer;
