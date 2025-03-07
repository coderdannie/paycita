'use client'
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CalendarIcon from "../../../assets/calendar.svg";
import PlaneIcon from "../../../assets/Vector.svg";
import SpiralCalendar from "../../../assets/Spiralcalendar.svg";

const ScrollableEvent = ({ title, time }: { title: string; time: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const handleDrag = (e: MouseEvent) => {
    if (!containerRef.current || !scrollbarRef.current) return;
    const container = containerRef.current;
    const scrollbar = scrollbarRef.current;
    const maxScroll = container.scrollHeight - container.clientHeight;
    const maxScrollbarMove =
      (scrollbar.parentElement?.clientHeight ?? 0) - scrollbar.clientHeight;

    let newY = scrollY + e.movementY;
    newY = Math.max(0, Math.min(newY, maxScrollbarMove));

    const scrollRatio = maxScroll / maxScrollbarMove;
    container.scrollTop = newY * scrollRatio;
    setScrollY(newY);
  };

  return (
    <div className="bg-[#F7F8FA] p-1 rounded-lg flex space-x-3 items-center relative w-full">
      <div className="relative flex flex-col items-center w-3 h-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-[#9B73BF]/20 rounded-full" />
        <div
          ref={scrollbarRef}
          className="w-3 h-12 bg-[#9B73BF] rounded-full cursor-pointer relative"
          style={{ transform: `translateY(${scrollY}px)` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const onMouseMove = (moveEvent: MouseEvent) => handleDrag(moveEvent);
            const onMouseUp = () => {
              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
            };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
          }}
        />
      </div>
      <div ref={containerRef} className="overflow-hidden h-16 w-full">
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
            <ScrollableEvent
              title="Daily Standup"
              time="08:00 AM to 09:00 AM"
            />
            <ScrollableEvent
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
            <ScrollableEvent title="No Upcoming Events" time="" />
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
          <div className="bg-[#F7F8FA] p-3 rounded-lg">
            <p className="text-sm text-gray-500">No leave available</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsCard;