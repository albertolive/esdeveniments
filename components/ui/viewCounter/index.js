import { useEffect, useState } from "react";
import ChartBarIcon from "@heroicons/react/outline/ChartBarIcon";
import { captureException } from "@sentry/nextjs";
import { env } from "@utils/helpers";

const ViewCounter = ({ slug, hideText }) => {
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      if (env === "dev") {
        setLoading(false);
      } else {
        try {
          const response = await fetch(`/api/fetchView`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slug }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setViews(data.views || 0);
        } catch (error) {
          const errorMessage = `Failed to fetch views for slug "${slug}": ${error}`;
          console.error(errorMessage);
          captureException(new Error(errorMessage));
        } finally {
          setLoading(false);
        }
      }
    };

    fetchViews();
  }, [slug]);

  return (
    <div className="flex justify-center items-center">
      <ChartBarIcon className="inline-block w-4 h-4 mr-1" />
      {loading ? (
        <div className="flex space-x-2">
          <div className="animate-ping h-1 w-1 bg-blackCorp rounded-full"></div>
          <div className="animate-ping delay-150 h-1 w-1 bg-blackCorp rounded-full"></div>
          <div className="animate-ping delay-300 h-1 w-1 bg-blackCorp rounded-full"></div>
        </div>
      ) : hideText ? (
        views
      ) : (
        `${views} visit${views === 1 ? "a" : "es"}`
      )}
    </div>
  );
};

export default ViewCounter;
