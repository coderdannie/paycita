'use client';
import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CalendarIcon from '../../../../assets/calendar.svg';
import PlaneIcon from '../../../../assets/Vector.svg';
import SpiralCalendar from '../../../../assets/SpiralCalendar.svg';
import { useDashboardSelector } from '@/src/Redux/selectors';
import { BirthdayCelebrant, Event } from '@/src/types/dashboard';
import { LeaveInfo } from '@/src/types/dashboard';
import { useDashboard } from '@/src/context/dashboardContext';
import { Skeleton } from '@/components/ui/skeleton';

const EventIndicator = ({
  title,
  time,
  desc,
  loading,
  meeting,
  profilePicture,
}: {
  title?: string;
  time?: string;
  desc?: string;
  loading?: boolean;
  meeting?: string;
  profilePicture?: string;
}) => {
  if (loading) {
    return (
      <div className="bg-[#F7F8FA] p-1 rounded-lg flex space-x-3 items-center relative w-full">
        <div className="relative flex flex-col items-center w-3 h-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-[#9B73BF]/20 rounded-full" />
          <div
            className="w-3 h-12 bg-[#9B73BF] rounded-full relative"
            style={{ top: '2px' }}
          />
        </div>
        <div className="h-16 w-full flex flex-col justify-center space-y-2">
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-3 w-[40%]" />
          <Skeleton className="h-3 w-[80%]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8FA] p-1 py-2 rounded-lg flex space-x-3 items-center relative w-full">
      <div className="relative flex flex-col items-center w-3 h-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-[#9B73BF]/20 rounded-full" />
        <div
          className="w-3 h-12 bg-[#9B73BF] rounded-full relative"
          style={{ top: '2px' }}
        />
      </div>
      <div className="h-16 w-full flex flex-col justify-center">
        <div className="flex gap-2">
          <p className="text-sm font-medium text-gray-800">{title}</p>{' '}
          {profilePicture && (
            <Image src={profilePicture} width={30} height={30} alt={title} />
          )}
        </div>

        <p className="text-xs text-gray-500">{time}</p>
        <p className="text-xs text-gray-500">{desc}</p>
        {meeting && (
          <p className="text-xs text-gray-500">
            Join meeting: <span className="font-bold"> {meeting}</span>
          </p>
        )}
      </div>
    </div>
  );
};

const EventsCard = () => {
  const { dashboardDetails } = useDashboardSelector();
  const events = dashboardDetails?.events;
  const todayEvents = events?.event_today as Event[] | undefined;
  const tomorrowEvents = events?.event_tomorrow as Event[] | undefined;
  const birthdayCelebrants = events?.birthday_celebrant as
    | BirthdayCelebrant[]
    | undefined;
  const leave = events?.leave as LeaveInfo | undefined;

  const { isDashboardDetailsFetching } = useDashboard();
  const isLeaveHasValue =
    events?.leave && Object.values(events?.leave).some((value) => value);

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
        {isDashboardDetailsFetching ? (
          <>
            <EventIndicator loading />
            <EventIndicator loading />
            <EventIndicator loading />
            <EventIndicator loading />
            <EventIndicator loading />
            <EventIndicator loading />
          </>
        ) : (
          <>
            {events?.event_today && events.event_today.length > 0 ? (
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
                {todayEvents?.map((event, i) => (
                  <div key={i}>
                    <div className="space-y-2 pb-4">
                      <EventIndicator
                        title={event?.event_name}
                        time={event?.time}
                        desc={event?.description}
                        meeting={event?.meeting_link}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className=" text-gray-500">No event available for today</p>
            )}

            {events?.event_tomorrow && events?.event_tomorrow.length > 0 ? (
              <div className="mb-4">
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
                {tomorrowEvents?.map((event, i) => (
                  <div key={i}>
                    <div className="space-y-2 pb-4">
                      <EventIndicator
                        title={event?.event_name}
                        time={event?.time}
                        desc={event?.description}
                        meeting={event?.meeting_link}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className=" text-gray-500">No event available for tomorrow</p>
            )}

            {events?.birthday_celebrant &&
            events?.birthday_celebrant?.length > 0 ? (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <Image
                    src={CalendarIcon}
                    alt="Calendar"
                    width={16}
                    height={16}
                    className="mr-2 text-gray-600"
                  />
                  Birthday Anniversaries
                </h3>
                {birthdayCelebrants?.map((event, i) => (
                  <div key={i}>
                    <div className="space-y-2 pb-4">
                      <EventIndicator
                        title={event?.full_name}
                        profilePicture={event?.profile_picture}
                        desc={event?.department}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className=" text-gray-500">No Birthday Celebrants yet</p>
            )}

            {isLeaveHasValue ? (
              <div className="mb-4">
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

                <div>
                  <div className="space-y-2 pb-4">
                    <EventIndicator
                      title={leave?.leave_type}
                      time={leave?.days_left}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className=" text-gray-500">No leave available</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsCard;
