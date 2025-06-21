// Safe localStorage utility for iPhone/Safari compatibility
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn(`localStorage.getItem(${key}) failed:`, error);
    }
    return null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`localStorage.setItem(${key}) failed:`, error);
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`localStorage.removeItem(${key}) failed:`, error);
    }
  },

  clear: (): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.clear();
      }
    } catch (error) {
      console.warn("localStorage.clear() failed:", error);
    }
  }
};
