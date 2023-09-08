import { siteUrl } from "@config/index";
import useSWR from "swr";

const fetchWeather = (url) => fetch(`${siteUrl}${url}`).then((r) => r.json());

export const useGetWeather = (isLessThanFiveDays) => {
  return useSWR([isLessThanFiveDays ? `/api/getWeather` : null], fetchWeather);
};
