import { useState, useRef, useEffect } from "react";
import {FaClock, FaLink, FaTimes } from "react-icons/fa";
import Image from "next/image";

interface EventModalProps {
  onClose: () => void;
  onSubmit: (event: {
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    meetingLink: string;
    attendees: string[];
  }) => void;
}

const EventModal: React.FC<EventModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [email, setEmail] = useState("");
  const [attendees, setAttendees] = useState<string[]>([
    "../../../assets/avatar-1.svg",
    "../../../assets/avatar-2.svg",
    "../../../assets/avatar-3.svg",
  ]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const [startTime, endTime] = time.split("-").map((t) => t.trim());

    onSubmit({
      name,
      description,
      date,
      startTime,
      endTime,
      meetingLink,
      attendees,
    });
  };

  const handleAddAttendee = () => {
    if (email && !attendees.includes(email)) {
      setAttendees([...attendees, email]);
      setEmail("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Create Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Event Name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md h-24"
              placeholder="Description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border rounded-md appearance-none" // Added appearance-none to help remove default calendar icon
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border rounded-md pl-8"
                  placeholder="02:00PM"
                  required
                />
                <FaClock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#667085] mb-1">
              Meeting Link
            </label>
            <div className="relative">
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full p-2 border rounded-md pl-8"
                placeholder="Link to the meeting"
              />
              <FaLink className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xl font-medium text-gray-700 mb-3">
              Add Gest
            </label>
            <div className="relative flex border rounded-lg overflow-hidden p-1 border-gray-200">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-1 border-0 focus:outline-none text-[#667085] text-lg"
                placeholder="@email.com"
              />
              <button
                type="button"
                onClick={handleAddAttendee}
                className="bg-white border border-gray-200 rounded-lg px-6 py-[.2rem] text-lg font-medium hover:bg-gray-50"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {attendees.map((_, index) => (
                <div
                  key={index}
                  className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white"
                >
                  <Image
                    src={`/assets/avatar-${index + 1}.svg`}
                    alt="Attendee"
                    width={32}
                    height={32}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#692E9F] hover:bg-purple-800 text-white py-2 rounded-md"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
