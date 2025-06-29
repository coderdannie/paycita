import Pusher from 'pusher-js';
import { playMessageSound } from '@/src/utils/audio';
import toast from 'react-hot-toast';
import { safeLocalStorage } from '@/src/utils/safeLocalStorage';

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
    'Missing required environment variables. Please ensure NEXT_PUBLIC_PUSHER_APP_KEY and NEXT_PUBLIC_PUSHER_APP_CLUSTER are set in your .env.local file.'
  );
}

const pusher = new Pusher(PUSHER_APP_KEY, {
  cluster: PUSHER_APP_CLUSTER,
  forceTLS: true,
  enableStats: false, // Disable stats for better iPhone compatibility
  activityTimeout: 120000, // Increase timeout for mobile networks (2 minutes)
  pongTimeout: 30000, // Increase pong timeout (30 seconds)
  unavailableTimeout: 10000, // Time to wait before attempting reconnection
  // Better transport configuration for iPhone Safari
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
  // Connection configuration for mobile stability
  wsHost: undefined, // Let Pusher determine the best host
  wsPort: 443,
  wssPort: 443,
  httpHost: undefined, // Let Pusher determine the best host
  httpPort: 80,
  httpsPort: 443, // Add auth endpoint if needed - can be extended for private channels
  authorizer: () => {
    return {
      authorize: (
        socketId: string,
        callback: (
          error: Error | null,
          authData: { auth: string } | null
        ) => void
      ) => {
        try {
          // Add custom authorization logic if needed
          // For now, return empty auth for public channels
          callback(null, { auth: '' });
        } catch (error) {
          callback(error as Error, null);
        }
      },
    };
  },
});

// Add connection state logging
pusher.connection.bind('state_change', (states: PusherConnectionState) => {
  if (states.current === 'connected') {
    // Store connection state in safe storage for debugging
    safeLocalStorage.setItem('pusher_connection_state', 'connected');
    safeLocalStorage.setItem('pusher_last_connected', new Date().toISOString());
  } else if (states.current === 'disconnected') {
    safeLocalStorage.setItem('pusher_connection_state', 'disconnected');
  } else if (states.current === 'connecting') {
    safeLocalStorage.setItem('pusher_connection_state', 'connecting');
  }
});

pusher.connection.bind('error', (err: PusherError) => {
  safeLocalStorage.setItem(
    'pusher_last_error',
    JSON.stringify({
      error: err,
      timestamp: new Date().toISOString(),
    })
  );

  // Attempt reconnection after a delay for mobile networks
  if (err.type === 'WebSocketError' || err.status >= 4000) {
    setTimeout(() => {
      pusher.connect();
    }, 5000);
  }
});

pusher.connection.bind('reconnecting', () => {
  safeLocalStorage.setItem('pusher_connection_state', 'reconnecting');
});

pusher.connection.bind('reconnected', () => {
  safeLocalStorage.setItem('pusher_connection_state', 'reconnected');
  safeLocalStorage.setItem('pusher_last_reconnected', new Date().toISOString());
});

export const subscribeToChannel = (
  channelName: string,
  eventName: string,
  currentUserId: string,
  callback: (data: PusherMessage) => void
) => {
  const channel = pusher.subscribe(channelName);

  channel.bind(eventName, async (data: PusherMessage) => {
    try {
      // Only show notification and play sound if the message is from someone else
      if (currentUserId && data.sender_id !== currentUserId) {
        await playMessageSound();

        toast.success('New Message\nKindly Reply', { duration: 5000 });

        // Safely check for Notification API availability (iPhone Safari compatibility)
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('New Message', {
              body: `${data.message}`,
              icon: '/logo.jpg',
              tag: data.chat_id || 'default-chat',
            });
          } else if (Notification.permission === 'default') {
            try {
              const permission = await Notification.requestPermission();
              if (permission === 'granted') {
                new Notification('New Message', {
                  body: `${data.message}`,
                  icon: '/logo.jpg',
                  tag: data.chat_id || 'default-chat',
                });
              }
            } catch (error) {
              console.warn('Notification permission request failed:', error);
            }
          }
        } else {
          ('Notification API not available on this browser');
        }
      }

      callback(data);
    } catch (error) {
      // Still call callback to ensure message processing continues
      callback(data);
    }
  });
  return () => {
    try {
      channel.unbind(eventName);
      pusher.unsubscribe(channelName);
    } catch (error) {}
  };
};

// Utility functions for Pusher health and debugging
export const getPusherConnectionState = () => {
  return pusher.connection.state;
};

export const getPusherConnectionInfo = () => {
  return {
    state: pusher.connection.state,
    socketId: pusher.connection.socket_id,
    lastConnected: safeLocalStorage.getItem('pusher_last_connected'),
    lastReconnected: safeLocalStorage.getItem('pusher_last_reconnected'),
    lastError: safeLocalStorage.getItem('pusher_last_error'),
    connectionState: safeLocalStorage.getItem('pusher_connection_state'),
  };
};

export const forcePusherReconnect = () => {
  try {
    pusher.disconnect();
    setTimeout(() => {
      pusher.connect();
    }, 1000);
  } catch (error) {}
};

export const isPusherConnected = () => {
  return pusher.connection.state === 'connected';
};

// Enhanced subscription with error handling and retry logic
export const subscribeToChannelWithRetry = (
  channelName: string,
  eventName: string,
  currentUserId: string,
  callback: (data: PusherMessage) => void,
  maxRetries: number = 3
) => {
  let retryCount = 0;

  const attemptSubscription = (): (() => void) | null => {
    try {
      return subscribeToChannel(
        channelName,
        eventName,
        currentUserId,
        callback
      );
    } catch (error) {
      retryCount++;

      if (retryCount < maxRetries) {
        setTimeout(() => {
          attemptSubscription();
        }, 2000);
      } else {
      }
      return null;
    }
  };

  return attemptSubscription();
};

export default pusher;
