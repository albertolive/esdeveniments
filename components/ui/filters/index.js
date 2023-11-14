import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";
import { getPlaceLabel } from "@utils/helpers";

const renderButton = ({ text, enabled, onClick, handleOpenModal }) => (
  <div
    key={text}
    className="w-1/1 flex justify-center items-center py-4 nowrap"
  >
    <div
      className={`w-1/1 flex justify-evenly items-center gap-1 bg-whiteCorp py-1 px-2 rounded-lg ease-in-out duration-300 focus:outline-none font-barlow italic uppercase ${
        enabled
          ? "border-primary border-[1px] text-primary font-semibold"
          : "border-whiteCorp border-[1px] text-bColor"
      }`}
    >
      <span
        onClick={handleOpenModal}
        className="w-full text-center uppercase tracking-wide"
      >
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
  const isAnyFilterSelected = () => place || byDate || category || distance;
  const getText = (value, defaultValue) => (value ? value : defaultValue);
  const foundByDate = BYDATES.find((item) => item.value === byDate);

  const handleByDateClick = useCallback(() => {
    if (byDate) {
      setByDate("");
      window.localStorage.removeItem("byDate");
    } else {
      setOpenModal(true);
    }
  }, [byDate, setByDate, setOpenModal]);
  const handleCategoryClick = useCallback(() => setCategory(""), [setCategory]);
  const handleDistanceClick = useCallback(() => setDistance(""), [setDistance]);

  const handleOnClick = useCallback(
    (value, fn) => () => value ? fn() : setOpenModal(true),
    [setOpenModal]
  );
  const handleOpenModal = useCallback(() => setOpenModal(true), [setOpenModal]);

  const handlePlaceClick = useCallback(() => {
    if (place) {
      setPlace("");
      setSelectedOption(undefined);
      window.localStorage.removeItem("place");
    } else {
      setOpenModal(true);
    }
  }, [place, setPlace, setSelectedOption, setOpenModal]);

  return (
    <div className="bg-whiteCorp flex justify-center items-center pl-4 pr-6">
      <div className="w-full flex justify-center items-center cursor-pointer gap-1">
        <div
          onClick={handleOpenModal}
          type="button"
          className="w-fit flex justify-center items-center gap-2 text-blackCorp bg-whiteCorp rounded-xl px-2 py-1 ease-in-out duration-300 focus:outline-none font-barlow italic uppercase font-semibold"
        >
          <AdjustmentsIcon
            className={
              isAnyFilterSelected()
                ? "w-6 h-6 text-primary"
                : "w-6 h-6 text-blackCorp"
            }
            aria-hidden="true"
          />
          <p className="font-barlow hidden md:block">Filtres</p>
        </div>
        <div className="w-full flex justify-start items-center gap-2 overflow-x-auto">
          {renderButton({
            text: getText(getPlaceLabel(place), "Població"),
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
