import React, { memo } from "react";
import Image from "next/image";
import { getFormattedDate } from "@utils/helpers";
import { normalizeWeather } from "@utils/normalize";
import { useGetWeather } from "@components/hooks/useGetWeather";

export default memo(function Weather({ startDate }) {
  const { isLessThanFiveDays, startDate: start } = getFormattedDate(startDate);
  const { data, error } = useGetWeather(isLessThanFiveDays);

  if (!data || error) return null;

  const weather = normalizeWeather(start, data);
  const { temp, description: weatherDescription, icon } = weather || {};

  return (
    <div className="flex items-center gap-2 text-xs">
      {icon && (
        <div className="pt-2">
          <Image
            alt={weatherDescription}
            src={icon}
            width="25"
            height="25"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      )}{" "}
      <div className="pt-1">
        {weatherDescription ? weatherDescription : ""}{" "}
        {temp ? `- ${temp}º` : ""}
      </div>
    </div>
  );
});
