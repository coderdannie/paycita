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
