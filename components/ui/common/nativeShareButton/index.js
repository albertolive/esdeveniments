import React, { useCallback, memo } from "react";
import { ShareIcon } from "@heroicons/react/outline";
import useCheckMobileScreen from "@components/hooks/useCheckMobileScreen";
import { sendGoogleEvent } from "@utils/analytics";
import { truncateString } from "@utils/helpers";

const NativeShareButton = ({
  title,
  text,
  url,
  startDate,
  endDate,
  location,
}) => {
  const isMobile = useCheckMobileScreen();

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      // Format the dates
      const formatDate = (date) =>
        new Date(date).toLocaleString("ca-ES", {
          dateStyle: "full",
          timeStyle: "short",
        });

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = endDate ? formatDate(endDate) : null;
      const truncatedDescription = truncateString(text || "", 100);

      // Construct the share text
      const shareText = `
${truncatedDescription}

Data: ${formattedStartDate}${formattedEndDate ? ` - ${formattedEndDate}` : ""}
Lloc: ${location}

Més informació: ${url}
      `.trim();

      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        });
        sendGoogleEvent("share", { method: "native", content: title });
      } catch (error) {
        console.error("Error sharing:", error);
        sendGoogleEvent("share_error", {
          method: "native",
          error: error.message,
        });
      }
    }
  }, [title, text, url, startDate, endDate, location]);

  if (!isMobile) {
    return null;
  }

  return (
    <button
      onClick={handleNativeShare}
      className="flex items-center text-primary hover:text-primary-dark transition-colors duration-200"
      aria-label="Compartir"
    >
      <ShareIcon className="h-6 w-6" />
    </button>
  );
};

export default memo(NativeShareButton);
