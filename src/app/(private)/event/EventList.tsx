import { formatTimeString } from '@/src/utils/helper';
import { Event } from './page';
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';

interface EventListProps {
  events: Event[];
  onEditClick: (event: Event) => void;
  onDeleteClick: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  onDeleteClick,
  onEditClick,
}) => {
  return (
    <div className="space-y-4">
      {events?.map((event) => (
        <div
          key={event?.id}
          className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-800">
              {event?.event_name}
            </h3>
            <p className="text-sm text-gray-600">
              {new Date(event?.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' · '}
              {formatTimeString(event?.time)}
              {/* - {event.endTime} */}
            </p>
          </div>
          <div className="flex -space-x-2 capitalize">
            <div className="flex items-center gap-3">
              {Array.isArray(event?.participants)
                ? event?.participants.slice(0, 3).map((_, index) => (
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
                  ))
                : event?.participants}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => onEditClick(event)}
                  className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                >
                  <Pencil className="w-4 h-4" />
                </button>{' '}
                <button
                  onClick={() => onDeleteClick(event)}
                  className="text-red-400 hover:text-red-600 w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
