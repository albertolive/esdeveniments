import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";
import { getPlaceLabel } from "@utils/helpers";

const renderButton = ({ text, enabled, onClick, handleOpenModal }) => (
  <div
    key={text}
    className="w-full bg-whiteCorp flex justify-cenetr items-center nowrap"
  >
    <div
      className={`w-full flex justify-center items-center gap-1 py-1 px-2 ease-in-out duration-300 focus:outline-none font-barlow italic uppercase ${
        enabled
          ? "text-primary font-medium border-b-2 border-whiteCorp hover:border-b-2 hover:border-primary"
          : "border-whiteCorp border-b-2 text-bColor hover:border-b-2 hover:border-bColor"
      }`}
    >
      <span
        onClick={handleOpenModal}
        className="w-full text-center uppercase tracking-wider"
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
    <div className="w-full md:w-2/3 bg-whiteCorp flex justify-center items-center px-0">
      <div className="w-full flex justify-start md:justify-center items-center gap-2 cursor-pointer">
        <div
          onClick={handleOpenModal}
          type="button"
          className="w-2/10 h-10 mr-3 flex justify-end items-center gap-1 cursor-pointer"
        >
          <AdjustmentsIcon
            className={
              isAnyFilterSelected()
                ? "w-4 h-4 text-primary"
                : "w-4 h-4 text-blackCorp"
            }
            aria-hidden="true"
          />
          <p className="hidden md:block md:font-barlow md:uppercase md:italic md:font-medium">Filtres</p>
        </div>
        <div className="w-8/10 h-10 flex justify-cenetr items-center gap-1 xs:gap-2 sm:gap-3 border-0 placeholder:text-bColor overflow-x-auto">
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
