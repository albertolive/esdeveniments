import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import { BYDATES } from "@utils/constants";

const renderButton = (value, onClick) => (
  <div key={value} className="flex-none">
    <button
      className="flex items-center border border-primarydark px-2 py-1 rounded-md"
      onClick={onClick}
    >
      <span className="text-primarydark capitalize">{value}</span>
      <XIcon className="h-4 w-4 text-primarydark" aria-hidden="true" />
    </button>
  </div>
);

const Filters = ({
  byDate,
  setByDate,
  category,
  setCategory,
  userLocation,
  setUserLocation,
}) => {
  const foundByDate = byDate && BYDATES.find((item) => item.value === byDate);

  const handleByDateClick = useCallback(() => setByDate(""), [setByDate]);
  const handleCategoryClick = useCallback(() => setCategory(""), [setCategory]);
  const handleUserLocationClick = useCallback(
    () => setUserLocation(""),
    [setUserLocation]
  );

  if (
    !foundByDate &&
    !category &&
    !(userLocation && Object.keys(userLocation).length)
  ) {
    return null;
  }

  return (
    <div className="max-w-screen flex p-4 gap-4 overflow-x-auto">
      <div className="flex space-x-2">
        {foundByDate && renderButton(foundByDate.label, handleByDateClick)}
        {category && renderButton(category, handleCategoryClick)}
        {userLocation &&
          Object.keys(userLocation).length &&
          renderButton("A prop meu", handleUserLocationClick)}
      </div>
    </div>
  );
};

export default memo(Filters);
