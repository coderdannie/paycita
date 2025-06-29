// Debug utility for iPhone Safari issues
export const iPhoneDebug = {
  log: (message: string, data?: unknown) => {
    if (typeof window !== 'undefined') {
      // Also try to store debug info in sessionStorage for debugging
      try {
        const debugInfo = {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          message,
          data,
        };
        sessionStorage.setItem(
          `debug_${Date.now()}`,
          JSON.stringify(debugInfo)
        );
      } catch (error) {
        console.warn('Failed to store debug info:', error);
      }
    }
  },

  checkEnvironment: () => {
    if (typeof window === 'undefined') {
      return {
        isClient: false,
        isIOS: false,
        isSafari: false,
        hasLocalStorage: false,
      };
    }

    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);

    let hasLocalStorage = false;
    try {
      const test = 'localStorage_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      hasLocalStorage = true;
    } catch (error) {
      console.warn('localStorage not available:', error);
    }

    const env = {
      isClient: true,
      isIOS,
      isSafari,
      hasLocalStorage,
      userAgent,
    };

    return env;
  },

  getDebugLogs: () => {
    if (typeof window === 'undefined') return [];

    try {
      const logs = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('debug_')) {
          const value = sessionStorage.getItem(key);
          if (value) {
            logs.push(JSON.parse(value));
          }
        }
      }
      return logs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    } catch (error) {
      console.warn('Failed to get debug logs:', error);
      return [];
    }
  },

  clearDebugLogs: () => {
    if (typeof window === 'undefined') return;

    try {
      const keysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('debug_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => sessionStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear debug logs:', error);
    }
  },
};

// Expose to window for debugging in production
if (typeof window !== 'undefined') {
  (window as typeof window & { iPhoneDebug: typeof iPhoneDebug }).iPhoneDebug =
    iPhoneDebug;
}
