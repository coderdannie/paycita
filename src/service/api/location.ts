import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// export const COUNTRIES = 'https://countriesnow.space/api/v0.1/countries';

type CountryApiResponse = {
  status: number;
  success: boolean;
  message: string;
  data: Array<{ name: string }>;
  pagination: null;
};

export const getCountries = async (): Promise<
  { label: string; value: string }[]
> => {
  const res = await axios.get<CountryApiResponse>(`${baseURL}country`);

  return res.data.data.map((country) => ({
    label: country.name,
    value: country.name,
  }));
};
