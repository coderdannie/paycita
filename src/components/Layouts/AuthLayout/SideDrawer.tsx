"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { sidebarData } from "../../common/constants";
import { useSelector } from 'react-redux';
import { RootState } from '@/src/Redux/store';
import { selectNormalizedFeatureSet } from '@/src/Redux/selectors/featureSelectors';
import { hasBackendFeature, isFeatureAllowedByPlan } from '@/src/config/featureAccess';
import Image from "next/image";
import logoutIcon from "../../../../public/assets/logout.svg";
import { useLogOut } from "@/src/hooks/useLogOut";
import { useAuthSelector } from "@/src/Redux/selectors";
// Helper to normalize approval keys (e.g. "Approval-Loan" -> "loan") and collapse plurals
const normalizeApproval = (val: string) => {
  if (!val) return '';
  let base = val.replace(/^Approval-/i, '').toLowerCase().replaceAll(/[-_\s]/g, '');
  if (base === 'expenses') base = 'expense';
  if (base === 'reimbursements') base = 'reimbursement';
  return base;
};

interface SidebarProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const SideDrawer = ({ isDrawerOpen, toggleDrawer }: SidebarProps) => {
  const userData = useAuthSelector();

  const isVisible = userData?.user?.feature?.employee_loan === "1";
  const isLineManager = userData?.user?.line_manager;
  const userApprovals = userData?.user?.approvals || [];
  const subscriptionFeatureApprovals: string[] = (userData?.user?.subscription_features || [])
    .flatMap((f: { approvals?: string[] | null }) => f?.approvals || [])
    .filter(Boolean as unknown as (x: unknown) => x is string);
  const userApprovalSet = new Set(userApprovals.map(normalizeApproval));
  const featureApprovalSet = new Set(subscriptionFeatureApprovals.map(normalizeApproval));
  const effectiveApprovalSet = new Set<string>([...userApprovalSet, ...featureApprovalSet]);
  const displayApprovalSet = userApprovalSet.size > 0 ? userApprovalSet : featureApprovalSet;

  const subscription = useSelector(
    (state: RootState) => state.auth.user.subscription_plan
  );

  const companyLogo = userData?.user?.company_logo;

  const [showMenu, setShowMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { mutateLogOut: logout } = useLogOut();

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      logout();
      setIsLoading(false);
    }, 1000);
  };

  const handleMainMenuClick = (item: {
    title: string;
    path: string;
    icon: React.ReactNode;
    hover: React.ReactNode;
    sub?: { id: number; name: string; path: string; title?: string }[];
  }) => {
    if (item.sub) {
      setShowMenu((prev) =>
        prev && currentIndex === item.title ? false : true
      );
      setCurrentIndex(item.title);
    } else {
      router.push(item.path);
      setShowMenu(false);
      setCurrentIndex("");
    }
  };

  const featureNameSet = useSelector(selectNormalizedFeatureSet);

  const filteredSidebarData = sidebarData.filter((item) => {
    const isApproval = item.title === 'Approval';
    if (!isFeatureAllowedByPlan(subscription, item.title)) {
      if (!(isApproval && effectiveApprovalSet.size > 0)) return false;
    }
    if (!hasBackendFeature(item.title, featureNameSet)) {
      if (!(isApproval && effectiveApprovalSet.size > 0)) return false;
    }
    if (item.title === 'Loan' && !isVisible) return false;
    if (isApproval && effectiveApprovalSet.size < 1) return false;
    if (item.title === 'Wallet' && !isLineManager) return false;
    if (item.title === 'All Expenses' && !isLineManager) return false;
    return true;
  });

  return (
    <>
      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-screen w-[252px] bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 overflow-y-auto`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="sticky z-40 top-0 pl-5 pt-[40px] bg-white h-[140px] flex items-center max-h-32">
            <Image
              src={companyLogo || "/assets/logo.jpg"}
              alt="logo"
              width={100}
              height={100}
              className="max-w-16 max-h-16 object-contain"
              priority
            />
          </div>
          <div className="mt-0">
            <div className="flex-1">
              {filteredSidebarData?.map((item) => (
                <div key={item.title} className="mb-2">
                  <div
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-300 relative ${
                      pathname === item.path
                        ? 'bg-[#F0EAF5] text-primary before:content-[""] before:absolute before:top-0 before:right-[10px] before:h-[50%] before:translate-y-[45%] before:w-[4px] before:bg-primary'
                        : "bg-transparent text-[#616161] hover:bg-[#F0EAF5]"
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
                      {item.sub
                        .filter((subItem: { id: number; name: string; path: string; title?: string }) => {
                          if (item.title === "Approval") {
                            const key = normalizeApproval(subItem.title || subItem.name);
                            return displayApprovalSet.has(key);
                          }
                          return true;
                        })
                        .map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.path}
                            className={`py-2 px-3 rounded-lg text-sm flex items-center gap-2 ${
                              pathname.includes(subItem.path)
                                ? "text-primary"
                                : "text-[#757575] hover:text-primary"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling to parent
                              // setShowMenu(false); // Optional: Close the submenu after selection
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
          <div
            className="pb-[90px] hover:text-red-500 flex border-[#314169] p-4 text-center text-sm cursor-pointer"
            onClick={handleLogout}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-[12px] w-full">
                <span className="border-red-600 w-4 h-4 rounded-full border-2 animate-spin"></span>
                Logging Out
              </div>
            ) : (
              <div className="flex items-center text-sm text-[#344054] justify-center gap-2 w-full">
                <Image
                  width={100}
                  height={100}
                  src={logoutIcon}
                  alt="logout icon"
                  className="w-auto h-auto"
                />
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
