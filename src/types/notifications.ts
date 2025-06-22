// Custom notification type to avoid conflict with browser's Notification API
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp?: string;
  read: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
  isSelected?: boolean;
}

// Type alias for API responses that might return different structure
export interface ApiNotificationResponse {
  id: string;
  title: string;
  message: string;
  timestamp?: string;
  read: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
  isSelected?: boolean;
}
