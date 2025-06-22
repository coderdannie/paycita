import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

// Safe storage implementation for iPhone/Safari compatibility
const createSafeStorage = () => {
  return {
    getItem: (key: string): string | null => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          return localStorage.getItem(key);
        }
      } catch (error) {
        console.warn(`Failed to get item "${key}" from localStorage:`, error);
      }
      return null;
    },
    setItem: (key: string, value: string): void => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem(key, value);
        }
      } catch (error) {
        console.warn(`Failed to set item "${key}" in localStorage:`, error);
      }
    },
    removeItem: (key: string): void => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.warn(`Failed to remove item "${key}" from localStorage:`, error);
      }
    },
  };
};

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();

      // Set up persistence with safe storage for iPhone/Safari compatibility
      try {
        const safeStorage = createSafeStorage();
        
        const persister = createSyncStoragePersister({
          storage: safeStorage,
          throttleTime: 1000,
        });

        persistQueryClient({
          queryClient: browserQueryClient,
          persister,
          maxAge: 1000 * 60 * 60 * 24, // 24 hours
        });
      } catch (error) {
        console.warn("Failed to set up query client persistence:", error);
        // Continue without persistence if localStorage is not available
      }
    }
    return browserQueryClient;
  }
}
