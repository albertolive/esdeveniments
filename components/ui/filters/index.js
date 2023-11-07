import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";

const renderButton = ({ text, enabled, onClick, handleOpenModal }) => (
  <div key={text} className="w-full flex justify-center items-center py-4 nowrap">
    <div
      className={`w-full flex justify-evenly items-center gap-1 bg-whiteCorp py-0 px-2 ease-in-out duration-300 focus:outline-none font-barlow italic uppercase ${
        enabled ? "border-primary border-l-[3px] text-blackCorp font-medium" : "border-whiteCorp border-l-[3px] text-bColor"
      }`}
    >
      <span onClick={handleOpenModal} className="w-full uppercase tracking-wider">
        {text}
      </span>
      {enabled ? (
        <XIcon className="h-5 w-5" aria-hidden="true" onClick={onClick} />
      ) : (
        <ChevronDownIcon
          className="h-4 w-4 hidden"
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
  setSelectedOption,
}) => {
  const getText = (value, defaultValue) => (value ? value : defaultValue);
  const foundByDate = BYDATES.find((item) => item.value === byDate);
  const handleReset = useCallback((setter) => () => setter(undefined), []);
  const handleByDateClick = handleReset(setByDate);
  const handleCategoryClick = handleReset(setCategory);
  const handleDistanceClick = handleReset(setDistance);
  const handleOnClick = useCallback(
    (value, fn) => () => value ? fn() : setOpenModal(true),
    [setOpenModal]
  );
  const handleOpenModal = useCallback(() => setOpenModal(true), [setOpenModal]);

  const handlePlaceClick = useCallback(() => {
    if (place) {
      setPlace(undefined);
      setSelectedOption(undefined);
    } else {
      setOpenModal(true);
    }
  }, [place, setPlace, setSelectedOption, setOpenModal]);

  return (
    <div className="bg-whiteCorp flex justify-center items-center px-4">
      <div className="w-full flex justify-center items-center cursor-pointer gap-1">
        <div
          onClick={handleOpenModal}
          type="button"
          className="w-fit flex justify-center items-center gap-2 text-blackCorp bg-whiteCorp rounded-xl p-3 ease-in-out duration-300 focus:outline-none font-barlow italic uppercase font-semibold"
        >
          <AdjustmentsIcon className="w-6 h-6" aria-hidden="true" />
          <p className="font-barlow hidden md:block">Filtres</p>
        </div>
        <div className="w-full flex justify-between items-center gap-2 px-3 overflow-x-auto">
          {renderButton({
            text: getText(place, "Població"),
            enabled: place,
            onClick: handlePlaceClick,
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
            text: getText(distance ? `${distance}km${distance > 1 ? "s" : ""}` : null, "Distància"),
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
