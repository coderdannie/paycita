'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import FrameIcon from '../../../../assets/Frame.svg';

import { useAuthSelector, useDashboardSelector } from '@/src/Redux/selectors';
import { useDashboard } from '@/src/context/dashboardContext';
import { Info } from 'lucide-react';

const ToggleSwitch = ({
  isToggled,
  onToggle,
  disabled = false,
}: {
  isToggled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => {
  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isToggled}
        onChange={onToggle}
        disabled={disabled}
      />
      <div
        className={`
        w-11 h-6 
        rounded-full 
        peer-checked:bg-[#F0EAF5]
        ${disabled ? 'bg-gray-200' : 'bg-[#F0EAF5]'}
      `}
      >
        <div
          className={`
            absolute top-0.5 
            ${isToggled ? 'left-6' : 'left-0.5'} 
            w-5 h-5 
            rounded-full 
            shadow-md 
            transition-all 
            duration-200
            ${isToggled ? 'bg-[#692E9F]' : 'bg-white'}
            ${disabled ? 'opacity-50' : ''}
          `}
        ></div>
      </div>
    </label>
  );
};

const DashboardHeader = () => {
  const [showWorkHours, setShowWorkHours] = useState(false);

  const { attendance } = useDashboardSelector();
  const {
    handleClockIn,
    handleClockOut,
    isClockingIn,
    isClockingOut,
    currentDateTime,
  } = useDashboard();

  const { user } = useAuthSelector();

  const isClockedIn = attendance?.is_clocked_in ?? false;
  const isLoading = isClockingIn || isClockingOut;

  const handleToggle = () => {
    if (isLoading) return;
    if (!isClockedIn) {
      handleClockIn();
    } else {
      handleClockOut();
    }
  };

  return (
    <>
      <div>
        {!isClockedIn && (
          <div className="flex items-center justify-center gap-2 bg-yellow-400 rounded-md p-2 border-2 border-yellow-500 bg-opacity-10 text-orange-500 font-bold mb-4">
            <Info size={18} />
            <p>You are yet to clock in</p>
          </div>
        )}
      </div>
      <div className={`w-full px-4 ${!isClockedIn ? 'pt-4' : 'pt-2'} pb-2`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[1.34rem] font-bold text-gray-800">
              Welcome back, {user?.full_name || '--'}
            </h1>
            <p className="text-sm text-gray-800 pt-2">{currentDateTime}</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowWorkHours(!showWorkHours)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Work hours information"
              >
                <Image
                  src={FrameIcon}
                  alt="Work hours icon"
                  className="h-8 w-8"
                  width={32}
                  height={32}
                />
              </button>

              {showWorkHours && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-10 text-sm font-medium animate-in slide-in-from-top-2 fade-in-0">
                  <p>4 hours worked so far</p>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: '50%' }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <ToggleSwitch
              isToggled={isClockedIn}
              onToggle={handleToggle}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
