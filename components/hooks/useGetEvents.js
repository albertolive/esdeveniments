import { siteUrl } from "@config/index";
import useSWR, { preload } from "swr";

const fetcher = ([url, pageIndex, q, maxResults]) =>
  fetch(
    `${siteUrl}${url}?page=${pageIndex}&q=${q}&maxResults=${maxResults}`
  ).then((res) => res.json());

export const useGetEvents = ({
  props = {},
  pageIndex,
  q = "",
  refreshInterval = true,
  maxResults = 10,
}) => {
  preload(["/api/getEvents", pageIndex, q, maxResults], fetcher);

  return useSWR(["/api/getEvents", pageIndex, q, maxResults], fetcher, {
    fallbackData: props,
    refreshInterval: refreshInterval ? 300000 : 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshWhenOffline: false,
    suspense: true,
    keepPreviousData: true,
    revalidateOnMount: false,
  });
};
