export const sendGoogleEvent = (event, obj) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, obj);
  }
};
