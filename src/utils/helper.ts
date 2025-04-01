export const formatDate = (
  date: Date | string | number | null | undefined,
  fallback: string = ''
): string => {
  if (!date) return fallback;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return fallback;

  return dateObj.toLocaleDateString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const updateDateTime = () => {
  const now = new Date();
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  const formattedDateTime = now
    .toLocaleString(
      'en-US',
      //@ts-ignore
      options
    )
    .replace(/,([^,]*)$/, ' -$1')
    .replace(' AM', 'am')
    .replace(' PM', 'pm');
  return formattedDateTime;
};
