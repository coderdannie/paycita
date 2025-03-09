// api/locations.ts
import axios from 'axios';

export const COUNTRIES = 'https://countriesnow.space/api/v0.1/countries';

export const getCountries = async (): Promise<
  { label: string; value: string }[]
> => {
  const res = await axios.get<{ data: { country: string }[] }>(COUNTRIES);

  // Transform the data into the format expected by react-select
  return res.data.data.map((country) => ({
    label: country.country,
    value: country.country,
  }));
};
