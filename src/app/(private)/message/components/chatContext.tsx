import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  department: string;
  profilePicture?: string;
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

interface ChatContextType {
  users: User[];
  currentChat?: User;
  conversations: Record<string, Message[]>;
  chatList: User[];
  isInitialState: boolean;
  selectChat: (user: User) => void;
  addNewChat: (user: User) => void;
  sendMessage: (content: string) => void;
  setIsInitialState: (state: boolean) => void;
  updateMessageStatus: (
    userId: string,
    messageId: string,
    status: Message["status"]
  ) => void;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Emery Korsgard",
    department: "Project Manager",
    isOnline: true,
  },
  {
    id: "2",
    name: "Jason Statham",
    department: "Marketing",
    isOnline: true,
  },
  {
    id: "3",
    name: "Jakob Saris",
    department: "Human Resources",
    isOnline: false,
  },
  {
    id: "4",
    name: "Sarah Johnson",
    department: "Sales",
    isOnline: true,
  },
];

export const ChatContext = createContext<ChatContextType>({
  users: mockUsers,
  conversations: {},
  chatList: [],
  isInitialState: true,
  currentChat: undefined,
  selectChat: () => {},
  addNewChat: () => {},
  sendMessage: () => {},
  setIsInitialState: () => {},
  updateMessageStatus: () => {},
});

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users] = useState<User[]>(mockUsers);
  const [currentChat, setCurrentChat] = useState<User>();
  const [chatList, setChatList] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(
    {}
  );
  const [isInitialState, setIsInitialState] = useState(true);

  const selectChat = useCallback((user: User) => {
    setCurrentChat(user);
    setIsInitialState(false);

    // Mark all received messages as read when selecting a chat
    setConversations((prev) => {
      const userConversation = prev[user.id] || [];
      const updatedConversation = userConversation.map((message) => {
        if (message.type === "received" && message.status !== "read") {
          return { ...message, status: "read" as const };
        }
        return message;
      });

      return {
        ...prev,
        [user.id]: updatedConversation,
      };
    });  }, []);

  const addNewChat = useCallback((user: User) => {
    
    setChatList((prev) => {
      if (!prev.some((existingUser) => existingUser.id === user.id)) {
        return [...prev, user];
      }
      return prev;
    });

    
    setConversations((prev) => {
      if (!prev[user.id]) {
        return {
          ...prev,
          [user.id]: [],
        };
      }
      return prev;
    });
  }, []);

  const updateMessageStatus = useCallback(
    (userId: string, messageId: string, status: Message["status"]) => {
      setConversations((prev) => {
        const userConversation = prev[userId] || [];
        const updatedConversation = userConversation.map((message) => {
          if (message.id === messageId) {
            return { ...message, status };
          }
          return message;
        });

        return {
          ...prev,
          [userId]: updatedConversation,
        };
      });
    },
    []
  );

  const sendMessage = useCallback(
    (content: string) => {
      if (!currentChat || !content.trim()) return;
      const messageId = uuidv4();
      const newMessage: Message = {
        id: messageId,
        userId: currentChat.id,
        content: content.trim(),
        timestamp: new Date(),
        type: "sent",
        status: "sent", 
      };

      setConversations((prev) => ({
        ...prev,
        [currentChat.id]: [...(prev[currentChat.id] || []), newMessage],
      }));

      // Simulate message delivery if user is online
      if (currentChat.isOnline) {
        setTimeout(() => {
          updateMessageStatus(currentChat.id, messageId, "delivered");

          // Simulate message being read after some time
          setTimeout(() => {
            updateMessageStatus(currentChat.id, messageId, "read");
          }, 3000);
        }, 1000);
      }
    },
    [currentChat, updateMessageStatus]
  );

  return (
    <ChatContext.Provider
      value={{
        users,
        currentChat,
        conversations,
        chatList,
        isInitialState,
        selectChat,
        addNewChat,
        sendMessage,
        setIsInitialState,
        updateMessageStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
