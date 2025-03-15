import { FaCalendarAlt } from "react-icons/fa";

interface EmptyStateProps {
  onCreateEvent: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateEvent }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className=" p-4 rounded-md mb-4">
        <FaCalendarAlt className="text-[#344054] text-5xl" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        No Upcoming Events
      </h2>
      <p className="text-gray-600 mb-6">
        It looks like there are no events scheduled at the moment.
      </p>
      <button
        onClick={onCreateEvent}
        className="bg-[#692E9F] hover:bg-purple-800 text-white px-6 py-2 rounded-md"
      >
        Create Event
      </button>
    </div>
  );
};

export default EmptyState;
