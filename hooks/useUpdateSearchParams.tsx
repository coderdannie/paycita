import { useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type FilterValue = string | number | undefined | null;
type Filters = Record<string, FilterValue>;

interface UpdateSearchParamsOptions {
  /**
   * How to handle existing params:
   * - 'merge': merge with existing params (default)
   * - 'replace': replace all existing params
   */
  strategy?: 'merge' | 'replace';
  /**
   * Path to use instead of current path
   */
  pathname?: string;
  /**
   * Scroll to top after navigation
   */
  scroll?: boolean;
  /**
   * Debounce time in milliseconds
   */
  debounce?: number;
  /**
   * Disable scroll behavior for specific paths
   */
  disableScroll?: boolean;
}

export function useUpdateSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateSearchParams = useCallback(
    (filters: Filters, options: UpdateSearchParamsOptions = {}) => {
      // Clear any pending debounce
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const executeUpdate = () => {
        try {
          let params: URLSearchParams;

          if (options.strategy === 'replace') {
            params = new URLSearchParams();
          } else {
            params = new URLSearchParams(searchParams.toString());
          }

          for (const key in filters) {
            if (Object.prototype.hasOwnProperty.call(filters, key)) {
              const value = filters[key];

              if (value === '' || value === null || value === undefined) {
                params.delete(key);
              } else {
                params.set(key, String(value));
              }
            }
          }

          const path = options.pathname || window.location.pathname;
          router.push(`${path}?${params.toString()}`, {
            scroll: false, // Always disable Next.js router scroll
          });

          // Only scroll if explicitly enabled and not disabled
          if (options.scroll === true && !options.disableScroll) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        } catch (error) {}
      };

      if (options.debounce && options.debounce > 0) {
        timeoutRef.current = setTimeout(executeUpdate, options.debounce);
      } else {
        executeUpdate();
      }
    },
    [searchParams, router]
  );

  // Clean up timeout on unmount or when searchParams changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [searchParams]);

  return updateSearchParams;
}
