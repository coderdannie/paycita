"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useApiRequest from "../hooks/useApiRequest";
import { useDispatch } from "react-redux";
import {
  updateAttendance,
  updateDashboardDetails,
} from "../Redux/features/dashboardSlice";
import { updateDateTime } from "../utils/helper";
import { useGetAttendance } from "../hooks/dashboard/useDashboard";
import { useDashboardSelector } from "../Redux/selectors";
import { ToastProvider } from "./ToastContext";
import {
  PusherMessage,
  subscribeToChannel,
} from "../service/api/pusher.service";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "../app/(private)/message/components/types";
import { useGetAllChat, useGetSingleChat } from "../hooks/chat/useChatQuery";
// import { initAudio, playSentSound } from "../utils/audio";
import isEqual from "lodash.isequal";
import { v4 as uuidv4 } from "uuid";
import { QUERY_KEYS } from "../service/tanstack-query/queryKey";
import { useNotification } from "./notificationContext";
import { safeLocalStorage } from "../utils/safeLocalStorage";
import { getCurrentLocationSafe } from "../utils/locationUtils";
import toast from "react-hot-toast";

interface DashboardContextType {
  fetchDashboardDetails: () => Promise<void>;
  isDashboardDetailsFetching: boolean;
  isAttendanceLoading: boolean;
  isEmployeeAttendanceLoading: boolean;

  handleClockOut: () => void;
  handleClockIn: () => void;
  isClockingIn: boolean;
  isClockingOut: boolean;
  currentDateTime: string;

  chatList: ChatUser[];
  isChatListLoading: boolean;
  conversations: Record<string, ChatMessage[]>;
  currentChat?: ChatUser;
  selectChat: (user: ChatUser) => void;
  addNewChat: (user: ChatUser) => void;
  sendMessage: (content: string) => Promise<void>;
  ChatLoading: boolean;
  subscribeToUserChannel: (
    userId: string,
    chatId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (data: any) => void
  ) => () => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const DashboardProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { loading: isAttendanceLoading, getRequest: fetchAttendance } =
    useApiRequest();

  const { postRequest: clockIn, loading: isClockingIn } = useApiRequest();
  const { postRequest: clockOut, loading: isClockingOut } = useApiRequest();
  const { getRequest } = useApiRequest();
  const { filters } = useDashboardSelector();

  const { isPending: isEmployeeAttendanceLoading } = useGetAttendance(filters);

  const dispatch = useDispatch();
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isDashboardDetailsFetching, setIsDashboardDetailsFetching] =
    useState(false);

  const fetchDashboardDetails = useCallback(async () => {
    try {
      setIsDashboardDetailsFetching(true);
      await getRequest("hr/dashboard", (response) => {
        if (response.success) {
          dispatch(updateDashboardDetails(response.data));
        }
      });
    } catch {
      // Error is handled by the API request hook
    } finally {
      setIsDashboardDetailsFetching(false);
    }
  }, [dispatch, getRequest]);

  const getAttendance = async () => {
    await fetchAttendance("/hr/attendance", (data) => {
      if (data.success) {
        dispatch(updateAttendance(data.data));
      }
    });
  };

  const handleClockOut = async () => {
    try {
      // Get current location
      const location = await getCurrentLocationSafe((message) => {
        toast.error(message);
      });

      const payload = location ? { lat: location.lat, lng: location.lng } : {};

      await clockOut("/hr/attendance/clock-out", payload, (data) => {
        if (data.success) {
          getAttendance();
          // if (location) {
          //   toast.success("Clocked out successfully");
          // } else {
          //   toast.success("Clocked out successfully (location unavailable)");
          // }
        }
      });
    } catch (error) {
      console.error("Clock out error:", error);
      toast.error("Failed to clock out. Please try again.");
    }
  };

  const handleClockIn = async () => {
    try {
      // Get current location
      const location = await getCurrentLocationSafe((message) => {
        toast.error(message);
      });

      const payload = location ? { lat: location.lat, lng: location.lng } : {};

      await clockIn("/hr/attendance/clock-in", payload, (data) => {
        if (data.success) {
          getAttendance();
          // if (location) {
          //   toast.success("Clocked in successfully");
          // } else {
          //   toast.success("Clocked in successfully (location unavailable)");
          // }
        }
      });
    } catch (error) {
      console.error("Clock in error:", error);
      toast.error("Failed to clock in. Please try again.");
    }
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout;

    const update = () => {
      const date = updateDateTime();
      setCurrentDateTime(date);
      const now = new Date();
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000;
      timeoutId = setTimeout(update, msUntilNextMinute);
    };

    // Initial update
    update();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = safeLocalStorage.getItem("access_token");
      if (!token) {
        // Don't make API calls if user is not authenticated
        console.log("No access token found, skipping dashboard data fetch");
        return;
      }

      // Only make API calls if user is authenticated
      // Call attendance API
      fetchAttendance("/hr/attendance", (data) => {
        if (data.success) {
          dispatch(updateAttendance(data.data));
        }
      });

      // Call dashboard details API
      (async () => {
        try {
          setIsDashboardDetailsFetching(true);
          await getRequest("hr/dashboard", (response) => {
            if (response.success) {
              dispatch(updateDashboardDetails(response.data));
            }
          });
        } catch {
          // Error is handled by the API request hook
        } finally {
          setIsDashboardDetailsFetching(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryClient = useQueryClient();

  const {
    allChats,
    isLoading: isChatListInitialLoading,
    isFetching: isChatListFetching,
  } = useGetAllChat();

  const [chatList, setChatList] = useState<ChatUser[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatUser | null>(null);
  const [conversations, setConversations] = useState<
    Record<string, ChatMessage[]>
  >({});

  useEffect(() => {
    if (!Array.isArray(allChats)) return;

    const normalizedChats: ChatUser[] = allChats.map((chat) => ({
      chat_id: chat?.chat_id,
      user_id: chat?.user_id?.id ?? "",
      sender_id: chat?.user_id?.id ?? "",
      full_name: chat?.user_id?.full_name ?? "",
      email: chat?.user_id?.email ?? "",
      profile_picture: chat?.user_id?.profile_picture ?? "",
      created_at: chat?.created_at ?? new Date().toISOString(),
      updated_at:
        chat?.updated_at ??
        chat?.created_at ??
        chat?.last_message?.updated_at ??
        chat?.last_message?.created_at ??
        new Date().toISOString(),
    }));

    setChatList((prev) =>
      isEqual(prev, normalizedChats) ? prev : normalizedChats
    );
  }, [allChats]);

  useEffect(() => {
    if (chatList.length === 0 || currentChat) return;

    setCurrentChat(chatList[0]);
  }, [chatList, currentChat]);

  const prevMessagesRef = useRef<Record<string, Message[]>>({});
  const { singleChat, isLoading: ChatLoading } = useGetSingleChat(
    currentChat?.chat_id
  );

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

  const { resetChatNotification } = useNotification();
  const resetChatNotificationRef = useRef(resetChatNotification);

  useEffect(() => {
    resetChatNotificationRef.current = resetChatNotification;
  }, [resetChatNotification]);

  const selectChat = useCallback((user: ChatUser) => {
    setCurrentChat(user);
    resetChatNotificationRef.current?.(user.chat_id);
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

  const addNewChat = useCallback((user: ChatUser) => {
    setChatList((prev) =>
      prev.some((existingUser) => existingUser.chat_id === user.chat_id)
        ? prev
        : [...prev, user]
    );

    setConversations((prev) => ({
      ...prev,
      [user.chat_id]: prev[user.chat_id] || [],
    }));
    setCurrentChat(user);
  }, []);

  const sendMessage = async (content: string) => {
    if (!currentChat || !content.trim()) return;

    const messageId = uuidv4();
    const newMessage: ChatMessage = {
      id: messageId,
      user_id: currentChat.user_id,
      message: content.trim(),
      created_at: new Date().toISOString(),
      type: "sent",
      status: "sent",
      updated_at: new Date().toISOString(),
      sender_id: currentChat.sender_id,
    };

    setConversations((prev) => ({
      ...prev,
      [currentChat.chat_id]: [...(prev[currentChat.chat_id] || []), newMessage],
    }));

    // Initialize audio before playing sound
    // initAudio();
    // playSentSound();
  };

  const subscribeToUserChannel = useCallback(
    (
      userId: string,
      chatId: string,
      callback: (data: PusherMessage) => void
    ) => {
      const channelName = `chat.${userId}`;

      return subscribeToChannel(
        channelName,
        "NewMessageSent",
        userId,
        (data: PusherMessage) => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_SINGLE_CHAT, chatId],
          });

          // Only handle message if it's for the current chat
          if (data?.chat_id === chatId) {
            callback(data);
          }
        }
      );
    },
    [queryClient]
  );

  useEffect(() => {
    const isSubscribed = true;
    let unsubscribeFunc: (() => void) | undefined;

    const loadAndSubscribe = async () => {
      if (!currentChat) {
        setConversations({});
        return;
      }

      unsubscribeFunc = subscribeToChannel(
        `chat.${currentChat?.chat_id}`,
        "NewMessageSent",
        currentChat.user_id,
        async () => {
          // Only update the chat list for any new message
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_SINGLE_CHAT, currentChat?.chat_id],
          });
        }
      );
    };

    loadAndSubscribe();
    return () => {
      if (isSubscribed && unsubscribeFunc) {
        unsubscribeFunc();
      }
    };
  }, [currentChat, queryClient]);

  const value: DashboardContextType = {
    isAttendanceLoading,
    handleClockIn,
    handleClockOut,
    isClockingIn,
    isClockingOut,
    currentDateTime,
    isDashboardDetailsFetching,
    fetchDashboardDetails,
    isEmployeeAttendanceLoading,
    chatList,
    isChatListLoading: isChatListInitialLoading || isChatListFetching,
    conversations,
    ChatLoading,
    selectChat,
    addNewChat,
    sendMessage,
    subscribeToUserChannel,
    currentChat,
  };

  return (
    <DashboardContext.Provider value={value}>
      <ToastProvider>{children}</ToastProvider>
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  return useContext(DashboardContext) as DashboardContextType;
};

export default DashboardProvider;
