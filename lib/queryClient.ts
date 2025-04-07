// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { persistQueryClient } from '@tanstack/react-query-persist-client'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

// const CACHE_VERSION = 'v1.0.0';
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
      
      // Set up persistence
      const persister = createSyncStoragePersister({
        storage: window.localStorage,
        // Optional: You can throttle the persisting to improve performance
        throttleTime: 1000,
      })
      
      persistQueryClient({
        queryClient: browserQueryClient,
        persister,
        // buster: CACHE_VERSION,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      })
    }
    return browserQueryClient
  }
}