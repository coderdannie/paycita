"use client";
import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CalendarIcon from "../../../../assets/calendar.svg";
import PlaneIcon from "../../../../assets/Vector.svg";
import SpiralCalendar from "../../../../assets/SpiralCalendar.svg";
import EventProfile from "../../../../assets/eventProfile.svg";
import  SendIcon from "@/src/assets/Send.svg";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * A component that renders an event indicator, which is a vertical line that spans
 * the height of the parent component and is colored in a specific way to represent
 * the event type. The component also includes two lines of text: the first line is
 * the title of the event, and the second line is the time of the event.
 *
 * @param {{ title: string, time: string }} props
 * @returns {JSX.Element}
 */
/******  d0d957d3-63d7-4e36-944e-9aaaff53c400  *******/
const EventIndicator = ({ title, time }: { title: string; time: string }) => {
  return (
    <div className="bg-[#F7F8FA] p-1 rounded-lg flex space-x-3 items-center relative w-full">
      <div className="relative flex flex-col items-center w-3 h-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-[#9B73BF]/20 rounded-full" />
        <div
          className="w-3 h-12 bg-[#9B73BF] rounded-full relative"
          style={{ top: "2px" }}
        />
      </div>
      <div className="h-16 w-full flex flex-col justify-center">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

const EventsCard = () => {
  return (
    <Card className="bg-white w-full h-full shadow-sm border-gray-100 rounded-xl p-4">
      <CardHeader className="pb-2">
        <div className="flex gap-2">
          <Image
            src={SpiralCalendar}
            alt="Spiral Calendar"
            width={24}
            height={24}
          />
          <CardTitle className="text-lg font-semibold text-gray-800 self-start">
            Events
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
            <Image
              src={CalendarIcon}
              alt="Calendar"
              width={16}
              height={16}
              className="mr-2 text-gray-600"
            />
            Today
          </h3>
          <div className="space-y-2 pb-4">
            <EventIndicator title="Daily Standup" time="08:00 AM to 09:00 AM" />
            <EventIndicator
              title="Web Team Progress Update"
              time="11:00 AM to 12:30 PM"
            />
          </div>
        </div>
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
            <Image
              src={CalendarIcon}
              alt="Calendar"
              width={16}
              height={16}
              className="mr-2 text-gray-600"
            />
            Tomorrow
          </h3>
          <div className="space-y-2 pb-4">
            <EventIndicator title="Daily Standup" time="08:00 AM to 09:00 PM" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
            <Image
              src={PlaneIcon}
              alt="Plane"
              width={16}
              height={16}
              className="mr-2 text-gray-600"
            />
            Leave
          </h3>
          <EventIndicator title="Bahamas" time="20 days left" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
            <Image
              src={CalendarIcon}
              alt="Birthday"
              width={16}
              height={16}
              className="mr-2 text-gray-600"
            />
            Birthday Anniversary
          </h3>
          <div className="bg-[#F7F8FA] p-1 rounded-lg flex space-x-3 items-center relative w-full">
            <div className="relative flex flex-col items-center w-3 h-16">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-[#9B73BF]/20 rounded-full" />
              <div
                className="w-3 h-12 bg-[#9B73BF] rounded-full relative"
                style={{ top: "2px" }}
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <Image
                  src={EventProfile}
                  alt="Cameron Williamson"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Cameron Williamson
                  </p>
                  <p className="text-xs text-gray-500">Human Resources</p>
                </div>
              </div>
              <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <Image src={SendIcon} alt="Send" width={20} height={20} />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsCard;
