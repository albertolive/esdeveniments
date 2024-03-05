import React, { useEffect, useState } from "react";
import ChartBarIcon from "@heroicons/react/outline/ChartBarIcon";
import { captureException } from "@sentry/nextjs";
import EventsAroundScroll from "../eventsAroundScroll";

const EventsAround = ({ town, region }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("EventsAround", town, region);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `/api/getEvents?q=${town + " " + region}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error(
          `Failed to fetch events for "${town}, ${region}": ${error}`
        );
        setError(error);
        captureException(
          new Error(`Failed to fetch events for "${town}, ${region}": ${error}`)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [town, region]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <ChartBarIcon className="animate-spin h-5 w-5 mr-3" />
        Loading events...
      </div>
    );
  }

  if (error) {
    return <div>Error loading events: {error.message}</div>;
  }

  return (
    <>
      {events.length > 0 ? (
        <EventsAroundScroll events={events} />
      ) : (
        <p>No events found.</p>
      )}
    </>
  );
};

export default EventsAround;
