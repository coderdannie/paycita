import { getCountries } from '@/src/service/api/location';
import { useQuery } from '@tanstack/react-query';

export const useGetCountries = () => {
  const { data, isPending } = useQuery({
    queryKey: ['COUNTRIES'],
    queryFn: getCountries,
  });

  return {
    countries: data,
    isPending,
  };
};
