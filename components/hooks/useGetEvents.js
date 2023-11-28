import { siteUrl } from "@config/index";
import useSWR, { preload } from "swr";

const fetcher = ([url, pageIndex, q, maxResults, shuffleItems]) =>
  fetch(
    `${siteUrl}${url}?page=${pageIndex}&q=${q}&maxResults=${maxResults}&shuffleItems=${shuffleItems}`
  ).then((res) => res.json());

export const useGetEvents = ({
  props = {},
  pageIndex,
  q = "",
  refreshInterval = true,
  maxResults = 10,
  shuffleItems = false,
}) => {
  preload(["/api/getEvents", pageIndex, q, maxResults, shuffleItems], fetcher);

  return useSWR(
    ["/api/getEvents", pageIndex, q, maxResults, shuffleItems],
    fetcher,
    {
      fallbackData: props,
      refreshInterval: refreshInterval ? 300000 : 0,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshWhenOffline: false,
      suspense: true,
      keepPreviousData: true,
      revalidateOnMount: false,
    }
  );
};
