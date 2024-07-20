import React, { useCallback, memo } from "react";
import { ShareIcon } from "@heroicons/react/outline";
import useCheckMobileScreen from "@components/hooks/useCheckMobileScreen";
import { sendGoogleEvent } from "@utils/analytics";

const NativeShareButton = ({ title, url, date, location }) => {
  const isMobile = useCheckMobileScreen();

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      const shareText = `
${title}

Data: ${date}
Lloc: ${location}
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
  }, [title, date, location, url]);

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
