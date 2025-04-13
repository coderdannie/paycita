import { useGetAllColleagues } from "@/src/api/hooks/chat/useChatQuery";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { subscribeToChannel } from "@/src/service/api/pusher.service";
import { playReceivedSound, playSentSound } from "@/src/utils/audio";

export interface User {
  email: ReactNode;
  profile_picture: string;
  chat_id: string;
  user_id: string;
  job_title: string;
  full_name: string;
  id: string;
  profilePicture?: string;
  isOnline: boolean;
}

export interface Message {
  created_at: string | number | Date;
  message: string;
  id: string;
  user_id: string;
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
  sendMessage: (content: string) => Promise<void>;
  setIsInitialState: (state: boolean) => void;
  updateMessageStatus: (
    userId: string,
    messageId: string,
    status: Message["status"]
  ) => void;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  searchTerm: string;
}

export const ChatContext = createContext<ChatContextType>({
  users: {} as User[],
  conversations: {},
  chatList: [],
  isInitialState: true,
  currentChat: undefined,
  selectChat: () => {},
  addNewChat: () => {},
  sendMessage: async () => {},
  setIsInitialState: () => {},
  updateMessageStatus: () => {},
  setSearchTerm: () => {},
  searchTerm: "",
});

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { colleagues } = useGetAllColleagues();

  const [users] = useState<User[]>(colleagues);
  const [currentChat, setCurrentChat] = useState<User | null>(null);
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
      const userConversation = prev[user.chat_id] || [];
      const updatedConversation = userConversation.map((message) => {
        if (message.type === "received" && message.status !== "read") {
          return { ...message, status: "read" as const };
        }
        return message;
      });

      return {
        ...prev,
        [user.chat_id]: updatedConversation,
      };
    });
  }, []);

  const addNewChat = useCallback((user: User) => {
    setChatList((prev) => {
      if (!prev.some((existingUser) => existingUser.chat_id === user.chat_id)) {
        return [...prev, user];
      }
      return prev;
    });

    setConversations((prev) => {
      if (!prev[user.chat_id]) {
        return {
          ...prev,
          [user.chat_id]: [],
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

  const sendMessage = async (content: string) => {
    try {
      if (!currentChat || !content.trim()) return;
      const messageId = uuidv4();
      const newMessage: Message = {
        id: messageId,
        user_id: currentChat.user_id,
        content: content.trim(),
        timestamp: new Date(),
        type: "sent",
        status: "sent",
        created_at: "",
        message: "",
      };

      setConversations((prev) => ({
        ...prev,
        [currentChat.id]: [...(prev[currentChat.id] || []), newMessage],
      }));

      playSentSound();

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
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Subscribe to Pusher channel when currentChat changes
  useEffect(() => {
    if (!currentChat?.chat_id) return;

    // Subscribe to the specific chat channel
    const unsubscribe = subscribeToChannel(
      `chat-${currentChat.chat_id}`,
      "new-message",
      (data) => {
        // Play sound based on message sender
        if (data.message.sender_id !== currentChat.user_id) {
          playReceivedSound();
        }

        setConversations((prev) => ({
          ...prev,
          [currentChat.chat_id]: [
            ...(prev[currentChat.chat_id] || []),
            data.message,
          ],
        }));
      }
    );

    // Cleanup subscription on unmount or when chat changes
    return () => {
      unsubscribe();
    };
  }, [currentChat?.chat_id, currentChat?.user_id]);

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
        setSearchTerm,
        searchTerm,
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
