import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";

const renderButton = ({ text, enabled, onClick, handleOpenModal }) => (
  <div key={text} className="flex justify-center items-center py-4">
    <div
      className={`flex justify-center items-center gap-2 text-sm bg-whiteCorp rounded-xl py-1 px-3 ease-in-out duration-300 border focus:outline-none font-barlow italic uppercase font-semibold ${
        enabled ? "border-primary text-primary" : "border-bColor text-bColor"
      }`}
    >
      <span onClick={handleOpenModal} className="uppercase tracking-wide">
        {text}
      </span>
      {enabled ? (
        <XIcon className="h-4 w-4" aria-hidden="true" onClick={onClick} />
      ) : (
        <ChevronDownIcon
          className="h-4 w-4"
          aria-hidden="true"
          onClick={onClick}
        />
      )}
    </div>
  </div>
);

const Filters = ({
  setOpenModal,
  place,
  setPlace,
  byDate,
  setByDate,
  category,
  setCategory,
  distance,
  setDistance,
}) => {
  const getText = (value, defaultValue) => (value ? value : defaultValue);
  const foundByDate = BYDATES.find((item) => item.value === byDate);
  const handleReset = useCallback((setter) => () => setter(""), []);
  const handlePlaceClick = handleReset(setPlace);
  const handleByDateClick = handleReset(setByDate);
  const handleCategoryClick = handleReset(setCategory);
  const handleDistanceClick = handleReset(setDistance);
  const handleOnClick = useCallback(
    (value, fn) => () => value ? fn() : setOpenModal(true),
    [setOpenModal]
  );
  const handleOpenModal = useCallback(() => setOpenModal(true), [setOpenModal]);

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full flex flex-col justify-center items-center cursor-pointer gap-1">
        <div
          onClick={handleOpenModal}
          type="button"
          className="w-full flex justify-center items-center gap-2 text-blackCorp bg-whiteCorp rounded-xl py-2 px-6 ease-in-out duration-300 border border-bColor focus:outline-none font-barlow italic uppercase font-semibold"
        >
          <AdjustmentsIcon className="w-4 h-4" aria-hidden="true" />
          <p className="font-barlow">Filtres</p>
        </div>
        <div className="w-full flex justify-between items-center overflow-x-auto">
          {renderButton({
            text: getText(place, "Població"),
            enabled: place,
            onClick: handleOnClick(place, handlePlaceClick),
            handleOpenModal,
          })}
          {renderButton({
            text: getText(category, "Categories"),
            enabled: category,
            onClick: handleOnClick(category, handleCategoryClick),
            handleOpenModal,
          })}
          {renderButton({
            text: getText(foundByDate && foundByDate.label, "Data"),
            enabled: foundByDate,
            onClick: handleOnClick(foundByDate, handleByDateClick),
            handleOpenModal,
          })}
          {renderButton({
            text: getText(distance ? `${distance} km` : null, "Distància"),
            enabled: distance,
            onClick: handleOnClick(distance, handleDistanceClick),
            handleOpenModal,
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(Filters);
