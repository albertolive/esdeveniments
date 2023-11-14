import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";
import { getPlaceLabel } from "@utils/helpers";

const renderButton = ({ text, enabled, onClick, handleOpenModal }) => (
  <div
    key={text}
    className="w-1/1 bg-whiteCorp flex justify-between items-center nowrap"
  >
    <div
      className={`w-1/1 flex justify-evenly items-center gap-1 py-1 px-2 rounded-xl border-[1px] border-whiteCorp hover:border-[1px] hover:border-bColor ease-in-out duration-300 focus:outline-none font-barlow italic uppercase ${
        enabled
          ? "text-primary font-medium rounded-xl"
          : "border-whiteCorp border-[1px] text-bColor rounded-xl"
      }`}
    >
      <span
        onClick={handleOpenModal}
        className="w-full text-center uppercase tracking-wide"
      >
        {text}
      </span>
      {enabled ? (
        <XIcon className="h-4 w-4" aria-hidden="true" onClick={onClick} />
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
    <div className="w-full bg-whiteCorp flex justify-center items-center px-0">
      <div className="w-full flex justify-start items-center cursor-pointer">
        <div
          onClick={handleOpenModal}
          type="button"
          className="w-1/12 h-12 mr-3 flex justify-end items-center cursor-pointer"
        >
          <AdjustmentsIcon
            className={
              isAnyFilterSelected()
                ? "w-5 h-5 text-primary"
                : "w-5 h-5 text-blackCorp"
            }
            aria-hidden="true"
          />
          <p className="font-barlow hidden md:block">Filtres</p>
        </div>
        <div className="h-12 flex justify-cenetr items-center border-0 placeholder:text-bColor overflow-x-auto">
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
