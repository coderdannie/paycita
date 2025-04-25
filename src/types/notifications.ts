export interface Notification {
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
