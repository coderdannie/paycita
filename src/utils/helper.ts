export const formatDate = (
  date: Date | string | number | null | undefined,
  fallback: string = ""
): string => {
  if (!date) return fallback;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return fallback;

  // Format date in local timezone
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
};

export const updateDateTime = (timeZone: string = 'UTC') => {
  const now = new Date();
  // Use the provided timeZone to ensure consistent formatting
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone
  };
  
  const formattedDateTime = now
    .toLocaleString('en-US', options)
    .replace(/,([^,]*)$/, ' -$1')
    .replace(' AM', 'am')
    .replace(' PM', 'pm');
  return formattedDateTime;
};

export const formatTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC'
  };

  const date = new Date(dateString);
  return date.toLocaleString('en-US', options);
};

export const parseDateString = (dateString: string): Date => {
  if (!dateString) return new Date();
  
  // Create date object and set time to start of day in local timezone
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};
