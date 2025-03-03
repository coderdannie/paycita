'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { sidebarData } from '../../common/constants';
import Image from 'next/image';
import logoutIcon from '../../../../public/assets/logout.svg';

const Sidebar = () => {
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

  return (
    <div className="flex flex-col justify-between fixed z-50 w-[252px] bg-white h-screen">
      <div className="mt-[50px]">
        <div className="bg-white sticky top-0 pl-5 pt-4">{/* <Logo /> */}</div>
        <div className="">
          <div className="flex-1">
            {sidebarData.map((item) => (
              <div key={item.title} className="mb-2">
                <div
                  className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-300 ${
                    pathname.includes(item.path)
                      ? 'bg-[#F0EAF5] text-primary'
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
  );
};

export default Sidebar;
