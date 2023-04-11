import useSWR, { preload } from "swr";

const fetchWeather = (url) =>
  fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}${url}`
  ).then((r) => r.json());

export const useGetWeather = (isLessThanFiveDays) => {
  return useSWR([isLessThanFiveDays ? `/api/getWeather` : null], fetchWeather);
};
