// Utility to check if we're running on client side
export const isClient = () => typeof window !== 'undefined';

// Utility to safely check if localStorage is available
export const isLocalStorageAvailable = () => {
  try {
    if (!isClient()) return false;
    
    const test = 'localStorage-test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;  } catch {
    return false;
  }
};

// Safe execution wrapper for client-side only operations
export const clientOnly = <T>(fn: () => T, fallback?: T): T | undefined => {
  if (isClient()) {
    try {
      return fn();
    } catch (error) {
      console.warn('Client-only operation failed:', error);
      return fallback;
    }
  }
  return fallback;
};
