import Pusher from "pusher-js";

// Check for required environment variables
const PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const PUSHER_APP_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

if (!PUSHER_APP_KEY || !PUSHER_APP_CLUSTER) {
  throw new Error(
    "Missing required environment variables. Please ensure NEXT_PUBLIC_PUSHER_APP_KEY and NEXT_PUBLIC_PUSHER_APP_CLUSTER are set in your .env.local file."
  );
}

// Create a single Pusher instance that will be reused across the app
const pusher = new Pusher(PUSHER_APP_KEY, {
  cluster: PUSHER_APP_CLUSTER,
  forceTLS: true,
});

export default pusher;

// Helper function to subscribe to a channel and event
export const subscribeToChannel = (
  channelName: string,
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (data: any) => void
) => {
  try {
    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName);
      pusher.unsubscribe(channelName);
    };
  } catch (error) {
    console.error(`Error subscribing to channel ${channelName}:`, error);
  }
};

export const subscribeToUserPresence = (
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPresenceChange: (data: any) => void
) => {
  const channel = pusher.subscribe(`presence-user-${userId}`);

  channel.bind("presence", onPresenceChange);

  return () => {
    channel.unbind("presence", onPresenceChange);
    pusher.unsubscribe(`presence-user-${userId}`);
  };
};
