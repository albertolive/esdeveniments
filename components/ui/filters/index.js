import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";
import { getPlaceLabel } from "@utils/helpers";
import { useRouter } from "next/router";
import useStore from "@store";

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

const Filters = ({ setSelectedOption, scrollToTop }) => {
  const router = useRouter();
  const { place, byDate, category, distance, openModal, setState } = useStore(
    (state) => ({
      place: state.place,
      byDate: state.byDate,
      category: state.category,
      distance: state.distance,
      openModal: state.openModal,
      setState: state.setState,
    })
  );

  const isAnyFilterSelected = () => place || byDate || category || distance;
  const getText = (value, defaultValue) => (value ? value : defaultValue);
  const foundByDate = BYDATES.find((item) => item.value === byDate);

  const handleByDateClick = useCallback(() => {
    if (byDate) {
      setState("byDate", "");
    } else {
      setState("openModal", true);
    }
  }, [byDate, setState]);

  const handleCategoryClick = useCallback(() => {
    setState("category", "");
  }, [setState]);

  const handleDistanceClick = useCallback(() => {
    setState("distance", "");
  }, [setState]);

  const handleOnClick = useCallback(
    (value, fn) => () => value ? fn() : setState("openModal", true),
    [setState]
  );

  const handlePlaceClick = useCallback(() => {
    if (place) {
      setState("place", "");
      setSelectedOption(undefined);

      if (place) {
        router.push(`/`);
      }
    } else {
      setState("openModal", true);
    }
  }, [place, setState, setSelectedOption, router]);

  return (
    <div
      className={`w-full bg-whiteCorp flex justify-center items-center px-0 ${
        openModal
          ? "opacity-50 animate-pulse text-bColor pointer-events-none"
          : ""
      }`}
    >
      <div className="w-full flex justify-start items-center gap-2 cursor-pointer">
        <div
          onClick={() => setState("openModal", true)}
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
          <p className="hidden md:block uppercase italic font-semibold font-barlow">
            Filtres
          </p>
        </div>
        <div className="w-8/10 h-10 flex items-center gap-1 sm:gap-2 border-0 placeholder:text-bColor overflow-x-auto">
          {renderButton({
            text: getText(getPlaceLabel(place), "Població"),
            enabled: place,
            onClick: handlePlaceClick,
            handleOpenModal: () => setState("openModal", true),
            scrollToTop,
          })}
          {renderButton({
            text: getText(category, "Categoria"),
            enabled: category,
            onClick: handleOnClick(category, handleCategoryClick),
            handleOpenModal: () => setState("openModal", true),
            scrollToTop,
          })}
          {renderButton({
            text: getText(foundByDate && foundByDate.label, "Data"),
            enabled: foundByDate,
            onClick: handleOnClick(foundByDate, handleByDateClick),
            handleOpenModal: () => setState("openModal", true),
            scrollToTop,
          })}
          {renderButton({
            text: getText(distance ? `${distance} km` : null, "Distància"),
            enabled: distance,
            onClick: handleOnClick(distance, handleDistanceClick),
            handleOpenModal: () => setState("openModal", true),
            scrollToTop,
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(Filters);
