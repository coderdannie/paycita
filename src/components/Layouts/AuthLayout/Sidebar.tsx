'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { sidebarData } from '../../common/constants';
import Image from 'next/image';
import logoutIcon from '../../../../public/assets/logout.svg';
import { useAuthSelector } from '@/src/Redux/selectors';

const Sidebar = () => {
  const userData = useAuthSelector();
  const isVisible = userData?.user?.feature?.employee_loan === "1";

  const [showMenu, setShowMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Add your logout function here
      setIsLoading(false);
    }, 1000);
  };

  const handleMainMenuClick = (item: {
    title: string;
    path: string;
    icon: React.ReactNode;
    hover: React.ReactNode;
    sub?: { id: number; name: string; path: string }[];
  }) => {
    if (item.sub) {
      // For items with submenus, only toggle the submenu
      setShowMenu((prev) => prev && currentIndex === item.title ? false : true);
      setCurrentIndex(item.title);
    } else {
      // For items without submenus, navigate immediately
      router.push(item.path);
      setShowMenu(false);
      setCurrentIndex('');
    }
  };

  // Filter sidebar data to exclude Loan if not visible
  const filteredSidebarData = sidebarData.filter(item =>
    item.title !== 'Loan' || isVisible
  );

  return (
    <div className="flex flex-col justify-between fixed z-50 w-[252px] bg-white h-screen overflow-hidden">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-10 pt-[40px] pl-5 pb-4">
        <Image
          src="/assets/logo.jpg"
          alt="paycita logo"
          width={100}
          height={100}
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="pb-4">
          {filteredSidebarData.map((item) => (
            <div key={item.title} className="mb-2">
              <div
                className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-300 relative ${pathname.includes(item.path)
                  ? 'bg-[#F0EAF5] text-primary before:content-[""] before:absolute before:top-0 before:right-[10px] before:h-[50%] before:translate-y-[45%] before:w-[4px] before:bg-primary'
                  : 'bg-transparent text-[#616161] hover:bg-[#F0EAF5]'
                  }`}
                onClick={() => handleMainMenuClick(item)}
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
                      className={`py-2 px-3 rounded-lg text-sm flex items-center gap-2 ${pathname.includes(subItem.path)
                        ? 'text-primary'
                        : 'text-[#757575] hover:text-primary'
                        }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling to parent
                        // setShowMenu(false); // Close the submenu after selection
                      }}
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

      {/* Fixed Footer */}
      <div
        className="sticky bottom-0 bg-white border-t border-[#314169] hover:text-red-500 flex p-4 text-center text-sm cursor-pointer"
        onClick={handleLogout}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-[12px] w-full">
            <span className="border-red-600 w-4 h-4 rounded-full border-2 animate-spin"></span>
            Logging Out
          </div>
        ) : (
          <div className="flex items-center text-sm text-[#344054] justify-center gap-2 w-full">
            <Image src={logoutIcon} alt="logout icon" />
            <p>Logout</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;