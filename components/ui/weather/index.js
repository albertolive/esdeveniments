import React, { memo } from 'react';
import Image from "next/image";
import { getFormattedDate } from "@utils/helpers";
import { normalizeWeather } from "@utils/normalize";
import { useGetWeather } from '@components/hooks/useGetWeather';

export default memo(function Weather({ startDate }) {
  const { isLessThanFiveDays, startDate: start } = getFormattedDate(startDate)
  const { data, error } = useGetWeather(isLessThanFiveDays);

  if (!data || error) return null;

  const weather = normalizeWeather(start, data)
  const { temp, description: weatherDescription, icon } = weather || {};

  return (
    <div className="flex items-center text-xs">
      {icon && <div className="mr-1 mt-2"><Image alt={weatherDescription} src={icon} width="30px" height="30px" /></div>} {weatherDescription ? weatherDescription : ""} {temp ? `- ${temp}º` : ""}
    </div>
  );
});

