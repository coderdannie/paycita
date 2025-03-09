// hooks/useGetCountriesStates.ts
import { useQuery, UseQueryOptions } from 'react-query';
import { getCountries } from '../api/location';

export const useGetCountries = (
  options?: UseQueryOptions<{ label: string; value: string }[], Error>
) => {
  const { data, isLoading, refetch } = useQuery<
    { label: string; value: string }[],
    Error
  >(['COUNTRIES'], getCountries, {
    ...options,
  });

  return { data, isLoading, refetch };
};
