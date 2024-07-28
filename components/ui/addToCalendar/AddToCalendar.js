import { useState, useCallback, lazy, Suspense, memo } from "react";
import CalendarButton from "./CalendarButton";
import { generateCalendarUrls } from "@utils/calendarUtils";

const LazyCalendarList = lazy(() => import("./CalendarList"));

const AddToCalendar = ({
  title,
  description,
  location,
  startDate,
  endDate,
  canonical,
  hideText = false,
}) => {
  const [showAgendaList, setShowAgendaList] = useState(false);

  const toggleAgendaList = useCallback(() => {
    setShowAgendaList((prev) => !prev);
  }, []);

  const calendarUrls = useCallback(
    () =>
      generateCalendarUrls({
        title,
        description,
        location,
        startDate,
        endDate,
        canonical,
      }),
    [title, description, location, startDate, endDate, canonical]
  );

  return (
    <div className="relative">
      <CalendarButton onClick={toggleAgendaList} hideText={hideText} />
      {showAgendaList && (
        <Suspense fallback={<div>Carregant...</div>}>
          <LazyCalendarList getUrls={calendarUrls} title={title} />
        </Suspense>
      )}
    </div>
  );
};

export default memo(AddToCalendar);
