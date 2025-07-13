/**
 * Geolocation utility for capturing user location
 * Provides functions to get current location with proper error handling
 * and browser compatibility (including mobile/Safari)
 */

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationError {
  message: string;
  code: number;
}

/**
 * Get current user location using browser's geolocation API
 * @param options - Geolocation options for accuracy and timeout
 * @returns Promise resolving to location coordinates or rejecting with error
 */
export const getCurrentLocation = (
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000, // 10 seconds timeout
    maximumAge: 5 * 60 * 1000, // Accept cached location up to 5 minutes old
  }
): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject({
        message: "Geolocation is not supported by this browser",
        code: -1,
      } as LocationError);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: LocationCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        resolve(coordinates);
      },
      (error) => {
        let errorMessage = "Unknown location error";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        reject({
          message: errorMessage,
          code: error.code,
        } as LocationError);
      },
      options
    );
  });
};

/**
 * Get current location with user-friendly error handling
 * Shows appropriate messages for different error scenarios
 * @param showToast - Optional toast function to show error messages
 * @returns Promise resolving to location coordinates or null if failed
 */
export const getCurrentLocationSafe = async (
  showToast?: (message: string, type?: 'error' | 'warning') => void
): Promise<LocationCoordinates | null> => {
  try {
    const location = await getCurrentLocation();
    return location;
  } catch (error) {
    const locationError = error as LocationError;
    
    // Show user-friendly error messages
    if (showToast) {
      if (locationError.code === 1) {
        showToast("Please enable location access for attendance tracking", "warning");
      } else if (locationError.code === 3) {
        showToast("Location request timed out. Please try again", "error");
      } else {
        showToast("Unable to get your location. Please try again", "error");
      }
    }
    
    console.warn("Location error:", locationError.message);
    return null;
  }
};

/**
 * Request location permission explicitly (useful for setup flows)
 * @returns Promise resolving to permission state
 */
export const requestLocationPermission = async (): Promise<PermissionState | 'unsupported'> => {
  try {
    // Check if permissions API is supported
    if (!navigator.permissions) {
      return 'unsupported';
    }

    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state;
  } catch (error) {
    console.warn("Permissions API not fully supported:", error);
    return 'unsupported';
  }
};

/**
 * Check if location services are available and enabled
 * @returns Boolean indicating if location can be accessed
 */
export const isLocationAvailable = (): boolean => {
  return 'geolocation' in navigator;
};

/**
 * Format location for display purposes
 * @param location - Location coordinates
 * @param precision - Number of decimal places (default: 6)
 * @returns Formatted location string
 */
export const formatLocation = (
  location: LocationCoordinates, 
  precision: number = 6
): string => {
  return `${location.lat.toFixed(precision)}, ${location.lng.toFixed(precision)}`;
};

/**
 * Calculate distance between two locations (in meters)
 * Uses Haversine formula for accuracy
 * @param loc1 - First location
 * @param loc2 - Second location
 * @returns Distance in meters
 */
export const calculateDistance = (
  loc1: LocationCoordinates, 
  loc2: LocationCoordinates
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (loc1.lat * Math.PI) / 180;
  const φ2 = (loc2.lat * Math.PI) / 180;
  const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};
