import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { subscribeToChannel } from "@/src/service/api/pusher.service";
import { playReceivedSound, playSentSound } from "@/src/utils/audio";
import { useGetSingleChat } from "@/src/api/hooks/chat/useChatQuery";
import isEqual from "lodash.isequal";

export interface User {
  sender_id: string;
  chat_id: string;
  user_id: string;
  full_name: string;
  profile_picture: string;
  isOnline: boolean;
}

export interface Message {
  updated_at: string 
  sender_id: string;
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  type: "sent" | "received";
  status: "sent" | "delivered" | "read";
}

interface ChatContextType {
  currentChat?: User;
  conversations: Record<string, Message[]>;
  chatList: User[];
  selectChat: (user: User) => void;
  addNewChat: (user: User) => void;
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatContext = createContext<ChatContextType>({
  conversations: {},
  chatList: [],
  selectChat: () => {},
  addNewChat: () => {},
  sendMessage: async () => {},
  isLoading: false,
});

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentChat, setCurrentChat] = useState<User | null>(null);
  const [chatList, setChatList] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(
    {}
  );

  const prevMessagesRef = useRef<Record<string, Message[]>>({});
  const { singleChat, isLoading } = useGetSingleChat(currentChat?.chat_id);

  // Update conversations when singleChat data changes
  useEffect(() => {
    if (!singleChat?.messages || !currentChat?.chat_id) return;

    const chatId = currentChat.chat_id;
    const newMessages = singleChat.messages;
    const prevMessages = prevMessagesRef.current[chatId] || [];

    // Only update if messages have changed
    if (!isEqual(prevMessages, newMessages)) {
      prevMessagesRef.current[chatId] = newMessages;
      setConversations((prev) => ({
        ...prev,
        [chatId]: newMessages,
      }));
    }
  }, [singleChat?.messages, currentChat?.chat_id]);

  const selectChat = useCallback((user: User) => {
    setCurrentChat(user);
  }, []);

  // Mark messages as read in a separate effect
  useEffect(() => {
    if (!currentChat?.chat_id) return;

    setConversations((prev) => {
      const chatMessages = prev[currentChat.chat_id] || [];
      const hasUnreadMessages = chatMessages.some(
        (message) => message.type === "received" && message.status !== "read"
      );

      if (!hasUnreadMessages) return prev;

      const updatedMessages = chatMessages.map((message) =>
        message.type === "received" && message.status !== "read"
          ? { ...message, status: "read" as const }
          : message
      );

      return {
        ...prev,
        [currentChat.chat_id]: updatedMessages,
      };
    });
  }, [currentChat?.chat_id]);

  const addNewChat = useCallback((user: User) => {
    setChatList((prev) =>
      prev.some((existingUser) => existingUser.chat_id === user.chat_id)
        ? prev
        : [...prev, user]
    );

    setConversations((prev) => ({
      ...prev,
      [user.chat_id]: prev[user.chat_id] || [],
    }));
  }, []);

  const sendMessage = async (content: string) => {
    if (!currentChat || !content.trim()) return;

    const messageId = uuidv4();
    const newMessage: Message = {
      id: messageId,
      user_id: currentChat.user_id,
      message: content.trim(),
      created_at: new Date().toISOString(),
      type: "sent",
      status: "sent",
      updated_at: new Date().toISOString(),
      sender_id: currentChat.sender_id
    };

    setConversations((prev) => ({
      ...prev,
      [currentChat.chat_id]: [...(prev[currentChat.chat_id] || []), newMessage],
    }));

    playSentSound();
  };

  useEffect(() => {
    if (!currentChat?.chat_id) return;

    const unsubscribe = subscribeToChannel(
      currentChat.user_id,
      currentChat.chat_id,
      (data) => {
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

    return () => {
      unsubscribe();
    };
  }, [currentChat?.chat_id, currentChat?.user_id]);

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        conversations,
        chatList,
        selectChat,
        addNewChat,
        sendMessage,
        isLoading,
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
