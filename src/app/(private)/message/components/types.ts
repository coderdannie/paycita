export interface User {
  id: string;
  name: string;
  department: string;
  profilePicture: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: "sent" | "received";
  status: "sent" | "delivered" | "read"; 
}


export interface ChatContextType {
  users: User[];
  currentChat?: User;
  conversations: Record<string, Message[]>;
  selectChat: (user: User) => void;
  addNewChat: (user: User) => void;
}
