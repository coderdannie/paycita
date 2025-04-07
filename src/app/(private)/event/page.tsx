"use client";
import { useState, useEffect, useCallback } from "react";
import EmptyState from "./EmptyState";
import EventList from "./EventList";
import EventModal from "./EventModal";
import { LuPlus } from "react-icons/lu";
import {
  useCreateEvent,
  useDeleteEvent,
  useGetAllEvents,
  useUpdateEvent,
} from "@/src/api/hooks/events/useEvents";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import CustomPagination from "@/src/components/common/pagination/Pagination";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventSchemaType } from "@/src/utils/validations";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import { useToast } from "@/src/context/ToastContext";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../components/common/ConfirmationModal";

export interface Event {
  description: string;
  meeting_link: string;
  id: string;
  event_name: string;
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  participants: string[];
}

const EventsPage = () => {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentPage = searchParams.get("page") || "1";

  const {
    events,
    pagination,
    isLoading: isPending,
  } = useGetAllEvents({
    page: currentPage.toString(),
  });

  const goToPage = useCallback(
    (page: number) => {
      updateSearchParams(
        { page: page.toString() },
        {
          scroll: true,
        }
      );
    },
    [updateSearchParams]
  );

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
    setIsEdit(null);
    reset();
  };

  const [notificationType, setNotificationType] = useState<string>("all");

  const form = useForm<EventSchemaType>({
    resolver: zodResolver(eventSchema(notificationType)),
    defaultValues: {
      event_name: "",
      emails: "",
      description: "",
      date: "",
      time: "",
      meeting_link: "",
      notification_type: notificationType,
      department_id: "",
    },
  });

  const { reset } = form;

  const handleNotificationTypeChange = useCallback(
    (type: string) => {
      setNotificationType(type);
      form.setValue("notification_type", type);
    },
    [form]
  );

  const { mutate: mutateCreateEvent, isPending: isPendingCreateEvent } =
    useCreateEvent();

  const { mutate: mutateUpdateEvent, isPending: isPendingUpdateEvent } =
    useUpdateEvent();

  const onSubmit = useCallback(
    (data: EventSchemaType) => {
      // const [startTime, endTime] = data.time.split("-").map((t) => t.trim());

      let newEvent = {};

      if (data.notification_type === "department" && data.department_id) {
        delete data.emails;
        newEvent = { ...data, department_id: data.department_id };
      } else if (data.notification_type === "emails" && data.emails) {
        delete data.department_id;
        const emailArray = data.emails.split(",").map((e) => e.trim());
        newEvent = { ...data, emails: emailArray };
      } else {
        delete data.department_id;
        delete data.emails;
        newEvent = { ...data };
      }

      if (isEdit) {
        delete data.notification_type;
        newEvent = { ...data };
      }

      if (isEdit) {
        mutateUpdateEvent(
          { ...newEvent, id: isEdit?.id },
          {
            onSuccess: (res) => {
              addToast(
                res.data.message || "Event Updated Successfully",
                "success"
              );
              reset();
              setShowModal(false);
            },
            onError: (error) => {
              if (error instanceof AxiosError) {
                const errorMessage =
                  error.response?.data?.message || "Failed to update event";
                addToast(errorMessage, "error");
              }
            },
          }
        );
        return;
      }

      mutateCreateEvent(newEvent, {
        onSuccess: (res) => {
          addToast(
            res.data.message || "Employee Added Successfully",
            "success"
          );

          reset();
          setShowModal(false);
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const errorMessage =
              error.response?.data?.message || "Failed to create event";
            addToast(errorMessage, "error");
          }
        },
      });
    },
    [addToast, isEdit, mutateCreateEvent, mutateUpdateEvent, reset]
  );

  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  const handleDelete = useCallback((event: Event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteEvent = () => {
    deleteEvent(eventToDelete?.id, {
      onSuccess: () => {
        toast.success("Event deleted successfully");
        setIsDeleteModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleEdit = useCallback(
    (leave: Event) => {
      setShowModal(!showModal);
      setIsEdit(leave);
      form.setValue("event_name", leave.event_name);
      form.setValue("description", leave.description);
      form.setValue("date", leave.date);
      form.setValue("time", leave.time);
      form.setValue("meeting_link", leave.meeting_link);
    },
    [form, showModal]
  );

  if (isPending) {
    return <LoadingOverlay />;
  }
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

        {events?.length === 0 ? (
          <EmptyState onCreateEvent={toggleModal} />
        ) : (
          <>
            <EventList
              events={events}
              onDeleteClick={handleDelete}
              onEditClick={handleEdit}
            />
            <div className="mt-6">
              {pagination?.total_pages > 1 && (
                <CustomPagination
                  totalPages={pagination?.total_pages}
                  currentPage={+currentPage}
                  goToPage={goToPage}
                />
              )}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <EventModal
          handleNotificationTypeChange={handleNotificationTypeChange}
          guestType={notificationType}
          form={form}
          onClose={toggleModal}
          onSubmit={onSubmit}
          isPending={isPendingCreateEvent}
          isUpdating={isPendingUpdateEvent}
          isEdit={!!isEdit}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        actionLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default EventsPage;
