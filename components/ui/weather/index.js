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
    <div className="flex justify-start items-center gap-2 text-xs">
      {icon && (
        <div className="flex justify-center items-center">
          <Image
            alt={weatherDescription}
            src={icon}
            width="30"
            height="30"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      )}{" "}
      <div className="flex justify-center items-center gap-1">
        <p>{weatherDescription ? weatherDescription : ""}{" "}</p>
        <h3 className="font-barlow">{temp ? `- ${temp}º` : ""}</h3>
      </div>
    </div>
  );
});
