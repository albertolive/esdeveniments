import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";
import { getPlaceLabel } from "@utils/helpers";
import { useRouter } from "next/router";

const renderButton = ({
  text,
  enabled,
  onClick,
  handleOpenModal,
  scrollToTop,
}) => (
  <div
    key={text}
    className="w-full bg-whiteCorp flex justify-center items-center nowrap"
  >
    <div
      className={`w-full h-8 flex justify-center items-center gap-1 px-1 ease-in-out duration-300 focus:outline-none ${
        enabled
          ? "text-primary font-medium border-b-2 border-primary"
          : "border-whiteCorp border-b-2 text-blackCorp hover:border-b-2 hover:border-bColor"
      }`}
    >
      <span onClick={handleOpenModal} className="w-full text-center">
        {text}
      </span>
      {enabled ? (
        <XIcon
          className="h-4 w-4"
          aria-hidden="true"
          onClick={() => {
            onClick();
            scrollToTop();
          }}
        />
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
  placeProps,
  setPlace,
  byDate,
  byDateProps,
  setByDate,
  category,
  setCategory,
  distance,
  setDistance,
  setSelectedOption,
  scrollToTop,
}) => {
  const router = useRouter();
  const isAnyFilterSelected = () => place || byDate || category || distance;
  const getText = (value, defaultValue) => (value ? value : defaultValue);
  const foundByDate = BYDATES.find((item) => item.value === byDate);

  const handleByDateClick = useCallback(() => {
    if (byDate) {
      setByDate("");
      window.localStorage.removeItem("byDate");

      if (byDateProps) {
        router.push(`/${placeProps}`);
      }
    } else {
      setOpenModal(true);
    }
  }, [byDate, byDateProps, placeProps, router, setByDate, setOpenModal]);
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

      if (placeProps) {
        router.push(`/`);
      }
    } else {
      setOpenModal(true);
    }
  }, [place, setPlace, setSelectedOption, placeProps, router, setOpenModal]);

  return (
    <div className="w-full bg-whiteCorp flex justify-center items-center px-0">
      <div className="w-full flex justify-start items-center gap-2 cursor-pointer">
        <div
          onClick={handleOpenModal}
          type="button"
          className="w-2/10 h-10 mr-3 flex justify-center items-center gap-1 cursor-pointer"
        >
          <AdjustmentsIcon
            className={
              isAnyFilterSelected()
                ? "w-5 h-5 text-primary"
                : "w-5 h-5 text-blackCorp"
            }
            aria-hidden="true"
          />
          <p className="hidden md:block md:font-barlow md:uppercase md:italic md:font-medium">
            Filtres
          </p>
        </div>
        <div className="w-8/10 h-10 flex justify-cenetr items-center gap-1 sm:gap-2 border-0 placeholder:text-bColor overflow-x-auto">
          {renderButton({
            text: getText(getPlaceLabel(place), "Població"),
            enabled: place,
            onClick: handlePlaceClick,
            handleOpenModal,
            scrollToTop,
          })}
          {renderButton({
            text: getText(category, "Categoria"),
            enabled: category,
            onClick: handleOnClick(category, handleCategoryClick),
            handleOpenModal,
            scrollToTop,
          })}
          {renderButton({
            text: getText(foundByDate && foundByDate.label, "Data"),
            enabled: foundByDate,
            onClick: handleOnClick(foundByDate, handleByDateClick),
            handleOpenModal,
            scrollToTop,
          })}
          {renderButton({
            text: getText(distance ? `${distance} km` : null, "Distància"),
            enabled: distance,
            onClick: handleOnClick(distance, handleDistanceClick),
            handleOpenModal,
            scrollToTop,
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(Filters);
