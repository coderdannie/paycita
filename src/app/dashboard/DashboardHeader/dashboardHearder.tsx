"use client";
import React, { useState } from "react";
import Image from "next/image";
import FrameIcon from "../../../assets/Frame.svg";

const ToggleSwitch = ({
  isToggled,
  onToggle,
}: {
  isToggled: boolean;
  onToggle: () => void;
}) => {
  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={isToggled}
        onChange={onToggle}
      />
      <div className="w-11 h-6 bg-[#F0EAF5] rounded-full relative transition-colors">
        <div
          className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-transform transform shadow-md ${
            isToggled ? "bg-[#692E9F] translate-x-5" : "bg-white"
          }`}
        ></div>
      </div>
    </label>
  );
};

const DashboardHeader = () => {
  const [showWorkHours, setShowWorkHours] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  return (
    <div className="w-full px-4 pt-7 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.34rem] font-bold text-gray-800">
            Welcome back, John!
          </h1>
          <p className="text-sm text-gray-800 pt-2">
            Monday, January 29, 2025 - 9:03 AM
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowWorkHours(!showWorkHours)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Image src={FrameIcon} alt="Frame Icon" className="h-8 w-8" />
            </button>

            {showWorkHours && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-10 text-sm font-medium animate-in slide-in-from-top-2 fade-in-0">
                <p>4 hours worked so far</p>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <ToggleSwitch isToggled={isToggled} onToggle={handleToggle} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
