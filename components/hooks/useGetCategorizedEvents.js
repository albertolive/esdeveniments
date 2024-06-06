import { siteUrl } from "@config/index";
import useSWR, { preload } from "swr";

const fetcher = ([url, searchTerms, maxResults]) =>
  fetch(
    `${siteUrl}${url}?searchTerms=${searchTerms.join(
      ","
    )}&maxResults=${maxResults}`
  ).then((res) => res.json());

export const useGetCategorizedEvents = ({
  props = {},
  searchTerms,
  maxResults = 10,
  refreshInterval = true,
}) => {
  preload(["/api/getCategorizedEvents", searchTerms, maxResults], fetcher);

  return useSWR(
    ["/api/getCategorizedEvents", searchTerms, maxResults],
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
