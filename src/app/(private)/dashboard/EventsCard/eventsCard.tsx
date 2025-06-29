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
import Progress from '@/src/components/common/Progress';
import NoDataState from '@/src/components/common/NoDataState';

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
      <div className="bg-[#F7F8FA] p-3 rounded-lg flex space-x-3 items-center relative w-full">
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
    <Card className="bg-white w-full  shadow-sm border-gray-100 rounded-xl h-[600px] md:max-h-[600px] overflow-y-auto">
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
        {!isDashboardDetailsFetching &&
          !todayEvents?.length &&
          !tomorrowEvents?.length &&
          !birthdayCelebrants?.length &&
          !isLeaveHasValue && (
            <NoDataState
              icon={
                <Image
                  src={SpiralCalendar}
                  alt="Calendar"
                  width={48}
                  height={48}
                />
              }
              header="No Upcoming Events"
              subheader="You're all caught up. No scheduled events, birthdays, or leaves for today or tomorrow."
            />
          )}
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
            {events?.event_today && events?.event_today.length > 0 ? (
              <section className="p-4 mt-4">
                <h2 className="flex space-x-2">
                  <Image
                    src={CalendarIcon}
                    alt="calendar"
                    width={30}
                    height={30}
                    className="mb-1"
                  />
                  <span className="text-lg">Today</span>
                </h2>
                {todayEvents?.map((event, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 py-5 mt-3 flex items-center gap-3 px-4 justify-start rounded-lg relative"
                  >
                    <Progress />
                    <div className="pl-[-2rem]">
                      <p className="font-semibold">{event?.event_name}</p>
                      <p className="text-sm text-gray-600">{event?.time}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {event?.description}
                      </p>
                      <a
                        href={event?.meeting_link}
                        target="blank"
                        className="mt-2 text-pry underline text-sm"
                      >
                        Join Event
                      </a>
                    </div>
                  </div>
                ))}
              </section>
            ) : null}

            {events?.event_tomorrow && events?.event_tomorrow.length > 0 ? (
              <section className="p-4 mt-1">
                <h2 className="flex space-x-2">
                  <Image
                    src={SpiralCalendar}
                    alt="calendar"
                    width={30}
                    height={30}
                    className="mb-1"
                  />
                  <span className="text-lg">Tomorrow</span>
                </h2>
                {tomorrowEvents?.map((event, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 py-5 mt-3 flex items-center gap-3 px-4 justify-start rounded-lg relative"
                  >
                    <Progress />
                    <div className="pl-[-2rem]">
                      <p className="font-semibold">{event.event_name}</p>
                      <p className="text-sm text-gray-600">{event.time}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.description}
                      </p>
                      <button className="mt-2 text-pry underline text-sm">
                        Join Event
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            ) : null}

            {events?.birthday_celebrant &&
            events?.birthday_celebrant?.length > 0 ? (
              <section className="p-4 mt-1">
                <h2 className="flex space-x-3">
                  <Image
                    src={'/assets/cake.svg'}
                    alt="birthday"
                    width={30}
                    height={30}
                    className="mb-1"
                  />
                  <span className="text-lg">Birthday Anniversaries</span>
                </h2>

                {birthdayCelebrants?.map((celebrant) => (
                  <div
                    key={celebrant?.user_id}
                    className="bg-gray-100 py-4 mt-3  rounded-lg px-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={celebrant?.profile_picture}
                        alt={celebrant?.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                        width={30}
                        height={30}
                      />
                      <div>
                        <p className="font-semibold">{celebrant?.full_name}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {celebrant?.department}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ) : null}
            {isLeaveHasValue ? (
              <section className="p-4 mt-1">
                <h2 className="flex space-x-3">
                  <Image
                    src={PlaneIcon}
                    alt="calendar"
                    width={30}
                    height={30}
                    className="mb-1"
                  />
                  <span className="text-lg">Leave</span>
                </h2>
                <div className="bg-gray-100 py-5 mt-3 flex items-center gap-3 px-4 justify-start rounded-lg relative">
                  <Progress />
                  <div className="pl-[-2rem]">
                    <p>{leave?.leave_type}</p>
                    <p>{leave?.days_left}</p>
                  </div>
                </div>
              </section>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsCard;
