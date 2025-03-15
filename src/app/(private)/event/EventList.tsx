import Image from 'next/image';
import { Event } from './page';

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-800">{event.name}</h3>
            <p className="text-sm text-gray-600">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {event.startTime} - {event.endTime}
            </p>
          </div>
          <div className="flex -space-x-2">
            {event.attendees.slice(0, 3).map((_, index) => (
              <div
                key={index}
                className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white"
              >
                <Image
                  src={`/avatar-${index + 1}.svg`}
                  alt="Attendee"
                  width={32}
                  height={32}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;