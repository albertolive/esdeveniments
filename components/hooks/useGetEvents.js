import { siteUrl } from "@config/index";
import useSWR, { preload } from "swr";

const fetcher = ([url, pageIndex, q, maxResults, town]) =>
  fetch(
    `${siteUrl}${url}?page=${pageIndex}&q=${q}&maxResults=${maxResults}&town=${town}`
  ).then((res) => res.json());

export const useGetEvents = ({
  props = {},
  pageIndex,
  q = "",
  refreshInterval = true,
  maxResults = 10,
  town = "",
}) => {
  preload(["/api/getEvents", pageIndex, q, maxResults, town], fetcher);

  return useSWR(["/api/getEvents", pageIndex, q, maxResults, town], fetcher, {
    fallbackData: props,
    refreshInterval: refreshInterval ? 300000 : 0,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshWhenOffline: false,
    suspense: true,
    keepPreviousData: true,
  });
};
