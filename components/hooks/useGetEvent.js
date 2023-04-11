import useSWR, { preload } from "swr";

const fetchWithId = ([url, id]) =>
  fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}${url}?eventId=${id}`).then((r) =>
    r.json()
  );

export const useGetEvent = (props) => {
  const eventId = props.event.slug;

  preload([eventId ? `/api/getEvent` : null, eventId], fetchWithId);

  return useSWR([eventId ? `/api/getEvent` : null, eventId], fetchWithId, {
    fallbackData: props,
    refreshInterval: 300000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshWhenOffline: true,
    suspense: true,
    keepPreviousData: true,
  });
};
