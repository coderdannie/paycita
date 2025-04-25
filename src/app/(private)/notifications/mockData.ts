import { Notification } from "@/src/types/notifications";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome Aboard",
    message:
      "Welcome to PayCita by Bizshift! Your account has been successfully set up.",
    read: false,
    isSelected: false,
  },
  {
    id: "2",
    title: "Profile Updated",
    message: "Your profile has been updated.",
    read: false,
    isSelected: false,
  },
  {
    id: "3",
    title: "New Message",
    message: "You have a new message from",
    timestamp: "2 minute ago",
    read: false,
    user: {
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
    },
    isSelected: false,
  },
  {
    id: "4",
    title: "Appraisal Started",
    message:
      "Your appraisal for Q2 has started. Please complete it before May 5, 2025",
    read: false,
    isSelected: false,
  },
  {
    id: "5",
    title: "Loan Request Submitted",
    message: "Your loan request of ₦150,000 has been submitted.",
    read: false,
    isSelected: false,
  },
  {
    id: "6",
    title: "System Downtime Notice",
    message: "System update scheduled for Sunday, 11:00 PM - 2:00 AM",
    read: false,
    isSelected: false,
  },
];
