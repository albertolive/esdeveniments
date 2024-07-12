import React from "react";
import { ShareIcon } from "@heroicons/react/outline";
import useCheckMobileScreen from "@components/hooks/useCheckMobileScreen";

const NativeShareButton = ({ title, text, url }) => {
  const isMobile = useCheckMobileScreen();

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <button
      onClick={handleNativeShare}
      className="flex items-center text-white rounded"
    >
      <ShareIcon className="h-6 w-6" />
    </button>
  );
};

export default NativeShareButton;
