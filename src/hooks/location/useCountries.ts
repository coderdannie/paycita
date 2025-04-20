import { getCountries } from "@/src/service/api/location";
import { useQuery } from "@tanstack/react-query";

export const useGetCountries = () => {
  const { data, isPending } = useQuery<
    { label: string; value: string }[],
    Error
  >({
    queryKey: ["COUNTRIES"],
    queryFn: async () => getCountries(),
  });

  const countries = data?.map((country) => ({
    label: country.label,
    value: country.value,
  }));

  return { countries, isPending };
};
