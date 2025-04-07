import { useState, useRef, useEffect } from "react";
import { FaLink, FaTimes } from "react-icons/fa";

import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { EventSchemaType } from "@/src/utils/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useGetDepartments } from "@/src/api/hooks/dashboard/useDashboard";
import { Spinner } from "react-activity";

interface EventModalProps {
  form: UseFormReturn<EventSchemaType>;
  onClose: () => void;
  onSubmit: SubmitHandler<EventSchemaType>;
  handleNotificationTypeChange: (type: string) => void;
  guestType: string;
  isPending: boolean;
}

const EventModal: React.FC<EventModalProps> = ({
  form,
  onClose,
  onSubmit,
  handleNotificationTypeChange,
  guestType,
  isPending,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [email, setEmail] = useState("");
  // const [startTime, setStartTime] = useState("");
  // const [endTime, setEndTime] = useState("");
  // const [timeError, setTimeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [departmentError, setDepartmentError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  const { departmentOptions, isPending: isPendingDepartment } =
    useGetDepartments();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is on a select element or its content
      const target = event.target as HTMLElement;
      const isSelectElement =
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]') ||
        target.closest("[data-radix-select-trigger]");

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !isSelectElement
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleGuestTypeChange = (value: string) => {
    setEmail("");
    setSelectedDepartment("");
    setEmailError("");
    setDepartmentError("");

    handleNotificationTypeChange(value);
  };

  const validateEmail = (emailValue: string) => {
    if (!emailValue) {
      setEmailError("Email is required");
      return false;
    }

    // Split by commas and filter out empty strings
    const emails = emailValue
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);

    if (emails.length === 0) {
      setEmailError("At least one email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const email of emails) {
      if (!emailRegex.test(email)) {
        setEmailError("Please enter valid email addresses");
        return false;
      }
    }

    setEmailError("");
    return true;
  };

  const validateDepartment = (deptValue: string) => {
    if (!deptValue) {
      setDepartmentError("Department is required");
      return false;
    }

    setDepartmentError("");
    return true;
  };

  // useEffect(() => {
  //   const validateTimes = () => {
  //     if (!startTime || !endTime) {
  //       setTimeError("Both start and end times are required");
  //       return false;
  //     }

  //     const start = new Date(`2000-01-01T${startTime}`);
  //     const end = new Date(`2000-01-01T${endTime}`);

  //     if (end <= start) {
  //       setTimeError("End time must be after start time");
  //       return false;
  //     }

  //     setTimeError("");
  //     return true;
  //   };

  //   const updateTimeField = () => {
  //     if (validateTimes()) {
  //       form.setValue("time", `${startTime} - ${endTime}`);
  //     }
  //   };

  //   updateTimeField();
  // }, [startTime, endTime, form, setTimeError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form.formState.errors);
    let isValid = true;

    if (guestType === "emails") {
      isValid = validateEmail(email) && isValid;
    } else if (guestType === "department") {
      isValid = validateDepartment(selectedDepartment) && isValid;
    }

    if (isValid) {
      form.handleSubmit(onSubmit)(e);
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
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <input
              {...form.register("event_name")}
              className="w-full p-2 border rounded-md"
              placeholder="Event Name"
            />
            {form.formState.errors.event_name && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.event_name.message}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...form.register("description")}
              className="w-full p-2 border rounded-md h-24"
              placeholder="Description"
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                {...form.register("date")}
                type="date"
                className="w-full p-2 border rounded-md appearance-none"
              />
              {form.formState.errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
            <div className="relative flex-1">
              {" "}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                {...form.register("time")}
                type="time"
                // value={startTime}
                // onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border rounded-md pl-8 appearance-none"
              />
            </div>
          </div>

          {/* <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border rounded-md pl-8 appearance-none"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative flex-1">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border rounded-md pl-8 appearance-none"
                />
              </div>
            </div>
            {timeError && (
              <p className="text-red-500 text-sm mt-1">{timeError}</p>
            )}
            {form.formState.errors.time && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.time.message}
              </p>
            )}
          </div> */}

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#667085] mb-1">
              Meeting Link
            </label>
            <div className="relative">
              <input
                {...form.register("meeting_link")}
                type="url"
                className="w-full p-2 border rounded-md pl-8"
                placeholder="Link to the meeting"
              />
              <FaLink className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {form.formState.errors.meeting_link && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.meeting_link.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xl font-medium text-gray-700 mb-3">
              Add Guest
            </label>
            <div className="flex border rounded-lg overflow-hidden p-1 border-gray-200">
              <div className="w-1/3">
                <Select value={guestType} onValueChange={handleGuestTypeChange}>
                  <SelectTrigger className="h-full border-0 border-r border-gray-200 rounded-none">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                    <SelectItem value="emails">Email</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {guestType === "department" ? (
                <div className="flex-1">
                  <select
                    className="w-full h-full px-3 py-1 border-0 focus:outline-none text-[#667085] text-lg appearance-none bg-transparent"
                    value={selectedDepartment}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log(value);
                      setSelectedDepartment(value);
                      form.setValue("department_id", value);
                      validateDepartment(value);
                    }}
                    disabled={isPendingDepartment}
                  >
                    <option value="">Select department</option>
                    {departmentOptions?.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                  {departmentError && (
                    <p className="text-red-500 text-sm mt-1">
                      {departmentError}
                    </p>
                  )}
                </div>
              ) : guestType === "all" ? (
                <div className="flex-1 flex items-center px-3 py-1 text-[#667085] text-lg">
                  All
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <input
                    type={"text"}
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(value);
                      if (guestType === "emails") {
                        // Store the raw comma-separated string in the form
                        form.setValue("emails", value);
                        validateEmail(value);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Allow comma key in email input
                      if (e.key === ",") {
                        e.stopPropagation();
                      }
                    }}
                    className="flex-1 px-3 py-1 border-0 focus:outline-none text-[#667085] text-lg"
                    placeholder={
                      guestType === "emails"
                        ? "email1@example.com, email2@example.com"
                        : "Search..."
                    }
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
                </div>
              )}
            </div>
            {guestType === "emails" && (
              <div className="text-xs text-gray-500 mt-1">
                Separate multiple emails with commas
              </div>
            )}
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#692E9F] hover:bg-purple-800 flex items-center justify-center gap-3 text-white py-2 rounded-md"
          >
            {isPending && <Spinner />}{" "}
            {isPending ? "Creating Event..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
