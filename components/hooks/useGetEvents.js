import { siteUrl } from "@config/index";
import useSWR, { preload } from "swr";

const fetcher = ([url, pageIndex, q, maxResults, shuffleItems, town]) =>
  fetch(
    `${siteUrl}${url}?page=${pageIndex}&q=${q}&maxResults=${maxResults}&shuffleItems=${shuffleItems}&town=${town}`
  ).then((res) => res.json());

export const useGetEvents = ({
  pageIndex,
  q = "",
  refreshInterval = true,
  maxResults = 10,
  shuffleItems = false,
  town = "",
}) => {
  // preload(
  //   ["/api/getEvents", pageIndex, q, maxResults, shuffleItems, town],
  //   fetcher
  // );

  return useSWR(
    ["/api/getEvents", pageIndex, q, maxResults, shuffleItems, town],
    fetcher,
    {
      refreshInterval: refreshInterval ? 300000 : 0,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshWhenOffline: false,
    }
  );
};
