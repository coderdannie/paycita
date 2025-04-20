import Pusher from "pusher-js";
import { playMessageSound } from "@/src/utils/audio";
import toast from "react-hot-toast";

interface PusherError {
  type: string;
  error: string;
  status: number;
}

export interface PusherMessage {
  sender_id: string;
  sender_name: string;
  message: string;
  chat_id: string;
  created_at: string;
}

interface PusherConnectionState {
  current: string;
  previous: string;
}

const PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const PUSHER_APP_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

if (!PUSHER_APP_KEY || !PUSHER_APP_CLUSTER) {
  throw new Error(
    "Missing required environment variables. Please ensure NEXT_PUBLIC_PUSHER_APP_KEY and NEXT_PUBLIC_PUSHER_APP_CLUSTER are set in your .env.local file."
  );
}

const pusher = new Pusher(PUSHER_APP_KEY, {
  cluster: PUSHER_APP_CLUSTER,
  forceTLS: true,

  enableStats: true,
  activityTimeout: 30000,
  pongTimeout: 10000,
  // Add reconnection settings
  enabledTransports: ["ws", "wss"],
  disableStats: false,
});

// Add connection state logging
pusher.connection.bind("state_change", (states: PusherConnectionState) => {
  console.log("Pusher connection state changed:", states);
  if (states.current === "connected") {
    console.log("Pusher reconnected successfully");
    // Re-subscribe to all channels
    pusher.allChannels().forEach((channel) => {
      if (!channel.subscribed) {
        channel.subscribe();
      }
    });
  }
});

pusher.connection.bind("error", (err: PusherError) => {
  console.error("Pusher connection error:", err);
});

pusher.connection.bind("reconnecting", () => {
  console.log("Pusher attempting to reconnect...");
});

pusher.connection.bind("reconnected", () => {
  console.log("Pusher reconnected successfully");
});

export const subscribeToChannel = (
  channelName: string,
  eventName: string,
  currentUserId: string,
  callback: (data: PusherMessage) => void
) => {
  const channel = pusher.subscribe(channelName);

  channel.bind(eventName, async (data: PusherMessage) => {
    // Only show notification and play sound if the message is from someone else

    if (currentUserId && data.sender_id === currentUserId) {
      await playMessageSound();

      toast.success("New Message\nKindly Reply", { duration: 5000 });
      if (Notification.permission === "granted") {
        new Notification("New Message", {
          body: `${data.message}`,
          icon: "/logo.jpg",
          tag: data.chat_id || "default-chat",
        });
      } else if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("New Message", {
            body: `${data.message}`,
            icon: "/logo.jpg",
            tag: data.chat_id || "default-chat",
          });
        }
      }
    }

    callback(data);
  });

  return () => {
    channel.unbind(eventName);
    pusher.unsubscribe(channelName);
  };
};

export default pusher;
