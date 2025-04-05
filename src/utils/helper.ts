export const formatDate = (
  date: Date | string | number | null | undefined,
  fallback: string = ""
): string => {
  if (!date) return fallback;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return fallback;

  return dateObj.toLocaleDateString("default", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const updateDateTime = () => {
  const now = new Date();
  const options = {
    weekday: "long" as const,
    month: "long" as const,
    day: "numeric" as const,
    year: "numeric" as const,
    hour: "numeric" as const,
    minute: "2-digit" as const,
    hour12: true,
  };
  const formattedDateTime = now
    .toLocaleString("en-US", options)
    .replace(/,([^,]*)$/, " -$1")
    .replace(" AM", "am")
    .replace(" PM", "pm");
  return formattedDateTime;
};

export const formatTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const date = new Date(dateString);
  return date.toLocaleString("en-US", options);
};
