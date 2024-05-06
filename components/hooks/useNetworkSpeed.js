import { useState, useEffect } from "react";

export const useNetworkSpeed = () => {
  const [quality, setQuality] = useState(70); // Default quality

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    const setConnectionQuality = () => {
      if (!connection) {
        return;
      }
      if (
        connection.effectiveType.includes("slow-2g") ||
        connection.effectiveType.includes("2g")
      ) {
        setQuality(30); // Lower quality for slower connections
      } else if (connection.effectiveType.includes("3g")) {
        setQuality(50); // Medium quality for 3G
      } else if (connection.effectiveType.includes("4g")) {
        setQuality(80); // High quality for 4G
      } else if (connection.effectiveType.includes("wifi")) {
        setQuality(100); // Full quality for WiFi
      } else {
        setQuality(70); // Higher quality for 4G and WiFi
      }
    };

    setConnectionQuality();
    connection.addEventListener("change", setConnectionQuality);

    return () => {
      connection.removeEventListener("change", setConnectionQuality);
    };
  }, []);

  return quality;
};
