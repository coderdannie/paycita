import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api, api2 } from "../service/api";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const globalCache: Record<string, CacheEntry<any>> = {};

const CACHE_CONFIG = {
  defaultExpiration: 5 * 60 * 1000, // 5 minutes
  maxItems: 100,
  disabledPaths: new Set<string>(), // Paths where caching is disabled
};

type UseApiRequestResult = {
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;

  getRequest: (
    url: string,
    callback?: (data: DataProps) => void,
    options?: {
      useCache?: boolean;
      cacheKey?: string;
      cacheExpiration?: number;
      forceRefresh?: boolean;
    }
  ) => Promise<void>;

  postRequest: (
    url: string,
    data: unknown,
    callback?: (data: DataProps) => void,
    options?: {
      invalidateCache?: string[];
    }
  ) => Promise<void>;

  patchRequest: (
    url: string,
    data: unknown,
    callback?: (data: DataProps) => void,
    options?: {
      invalidateCache?: string[];
    }
  ) => Promise<void>;

  putRequest: (
    url: string,
    data: unknown,
    callback?: (data: DataProps) => void,
    options?: {
      invalidateCache?: string[];
    }
  ) => Promise<void>;

  deleteRequest: (
    url: string,
    callback?: (data: DataProps) => void,
    options?: {
      invalidateCache?: string[];
    }
  ) => Promise<void>;

  invalidateCache: (keys: string[]) => void;
  clearCache: () => void;
};

type DataProps = {
  data: any;
  success: boolean;
  message: string;
  status: number;
  pagination?: PaginationProps;
};

type ErrorDataProps = {
  data: any;
  success: boolean;
  message: string;
  error: string;
  status: number;
};

// Helper function to manage cache size
const manageCacheSize = () => {
  const keys = Object.keys(globalCache);
  if (keys.length > CACHE_CONFIG.maxItems) {
    // Sort by timestamp (oldest first)
    keys.sort((a, b) => globalCache[a].timestamp - globalCache[b].timestamp);
    // Remove oldest entries
    const keysToRemove = keys.slice(0, keys.length - CACHE_CONFIG.maxItems);
    keysToRemove.forEach((key) => {
      delete globalCache[key];
    });
  }
};

// Helper function to check if cache is valid
const isCacheValid = (entry: CacheEntry<any>, expiration: number) => {
  return Date.now() - entry.timestamp < expiration;
};

// Helper function to generate cache key from URL
const generateCacheKey = (url: string): string => {
  // Remove query parameters for the base key
  const [baseUrl] = url.split("?");

  // If there are query parameters, append them to the key
  const params = new URLSearchParams(url.split("?")[1] || "");
  const paramString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}_${value}`)
    .join("_");

  return paramString ? `${baseUrl}_${paramString}` : baseUrl;
};

// Helper function to get invalidation patterns from URL
const getInvalidationPatterns = (url: string): string[] => {
  const [baseUrl] = url.split("?");
  const parts = baseUrl.split("/").filter(Boolean);

  // Generate patterns based on URL structure
  const patterns: string[] = [];

  // Add the base URL pattern
  patterns.push(baseUrl);

  // Add patterns for each level of the URL
  let currentPath = "";
  for (const part of parts) {
    currentPath += `/${part}`;
    patterns.push(currentPath);
  }

  return patterns;
};

const useApiRequest = (): UseApiRequestResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Keep track of pending requests to prevent duplicate requests
  const pendingRequests = useRef<Record<string, Promise<any>>>({});

  const reset = () => {
    setError(null);
    setMessage("");
    setIsSuccess(false);
  };

  // Function to invalidate specific cache entries
  const invalidateCache = useCallback((keys: string[]) => {
    keys.forEach((key) => {
      delete globalCache[key];
    });
  }, []);

  // Function to clear all cache
  const clearCache = useCallback(() => {
    Object.keys(globalCache).forEach((key) => {
      delete globalCache[key];
    });
  }, []);

  const makeRequest = useCallback(
    async (
      method: "get" | "post" | "patch" | "put" | "delete",
      url: string,
      data?: any,
      callback?: (data: DataProps) => void,
      options?: {
        useCache?: boolean;
        cacheKey?: string;
        cacheExpiration?: number;
        forceRefresh?: boolean;
        invalidateCache?: string[];
        disableCache?: boolean;
      }
    ) => {
      // Check internet connection before making request
      if (!navigator.onLine) {
        toast.error("No internet connection. Please check your network.", {
          position: "top-right",
        });
        return;
      }

      reset();
      setLoading(true);

      try {
        // For GET requests, handle caching automatically
        if (method === "get") {
          const shouldCache =
            !options?.disableCache && !CACHE_CONFIG.disabledPaths.has(url);
          const cacheKey = options?.cacheKey || generateCacheKey(url);
          const useCache = options?.useCache ?? shouldCache;
          const expiration =
            options?.cacheExpiration ?? CACHE_CONFIG.defaultExpiration;

          if (useCache && cacheKey && !options?.forceRefresh) {
            const cachedData = globalCache[cacheKey];
            if (cachedData && isCacheValid(cachedData, expiration)) {
              setLoading(false);
              if (callback) callback(cachedData.data);
              return;
            }
          }

          // Check if there's already a pending request for this URL
          if (url in pendingRequests.current) {
            try {
              const response = await pendingRequests.current[url];
              if (callback) callback(response.data);
              return;
            } catch (error) {
              delete pendingRequests.current[url];
            }
          }

          // Make the request
          const response = await api[method](url, data);
          pendingRequests.current[url] = Promise.resolve(response);

          const responseData: DataProps = response.data;
          if (responseData.success) {
            setIsSuccess(true);
            setMessage(responseData.message || "Success");
            if (useCache && cacheKey) {
              globalCache[cacheKey] = {
                data: responseData,
                timestamp: Date.now(),
              };
              manageCacheSize();
            }
            if (callback) callback(responseData);
          } else {
            setError(responseData.message || "Request failed");
            toast.error(responseData.message || "Request failed", {
              position: "top-right",
            });
          }
        } else {
          // For non-GET requests, handle cache invalidation automatically
          const invalidationPatterns =
            options?.invalidateCache || getInvalidationPatterns(url);

          // Use api2 only for FormData payloads in post, patch, and put requests
          const isFormData = data instanceof FormData;
          const apiInstance =
            (method === "post" || method === "patch" || method === "put") &&
            isFormData
              ? api2
              : api;

          // Make the request
          const response = await apiInstance[method](url, data);
          const responseData: DataProps = response.data;

          if (responseData.success) {
            setIsSuccess(true);
            setMessage(responseData.message || "Success");
            toast.success(responseData.message || "Success", {
              position: "top-right",
            });
            // Invalidate related caches
            invalidateCache(invalidationPatterns);
            if (callback) callback(responseData);
          } else {
            setError(responseData.message || "Request failed");
            toast.error(responseData.message || "Request failed", {
              position: "top-right",
            });
            if (callback) callback(responseData);
          }
        }
      } catch (error: any) {
        const errorData: ErrorDataProps = error?.response?.data || {};
        setError(errorData.message || errorData.error || "An error occurred");
        toast.error(
          errorData.message || errorData.error || "An error occurred",
          {
            position: "top-right",
          }
        );
        if (callback) callback(errorData);
      } finally {
        setLoading(false);
        delete pendingRequests.current[url];
      }
    },
    [invalidateCache]
  );

  // Clean up pending requests on unmount
  useEffect(() => {
    return () => {
      pendingRequests.current = {};
    };
  }, []);

  return {
    loading,
    error,
    getRequest: (url, callback, options) =>
      makeRequest("get", url, undefined, callback, options),
    postRequest: (url, formData, callback, options) =>
      makeRequest("post", url, formData, callback, options),
    patchRequest: (url, formData, callback, options) =>
      makeRequest("patch", url, formData, callback, options),
    putRequest: (url, formData, callback, options) =>
      makeRequest("put", url, formData, callback, options),
    deleteRequest: (url, callback, options) =>
      makeRequest("delete", url, {}, callback, options),
    message,
    isSuccess,
    invalidateCache,
    clearCache,
  };
};

export default useApiRequest;
