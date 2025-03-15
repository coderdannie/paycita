'use client';
import { useState, useEffect } from "react";
import EmptyState from "./EmptyState";
import EventList from "./EventList";
import Pagination from "../leave-mgt/Pagination/pagination";
import EventModal from "./EventModal";
import { LuPlus } from "react-icons/lu";

export interface Event {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
}

const EventsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 7;

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; 
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCreateEvent = (event: Omit<Event, "id">) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Events</h1>
          <button
            onClick={toggleModal}
            className="bg-[#692E9F] hover:bg-purple-800 text-white px-4 py-2 rounded-md flex items-center"
          >
            <LuPlus className="mr-2 text-[#692E9F] rounded-[.2rem] bg-white" />
            Create Event
          </button>
        </div>

        {events.length === 0 ? (
          <EmptyState onCreateEvent={toggleModal} />
        ) : (
          <>
            <EventList events={currentEvents} />
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(events.length / eventsPerPage)}
                onPageChange={paginate}
              />
            </div>
          </>
        )}
      </div>

      {showModal && (
        <EventModal onClose={toggleModal} onSubmit={handleCreateEvent} />
      )}
    </div>
  );
};

export default EventsPage;
