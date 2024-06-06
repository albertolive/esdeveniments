import { memo, useCallback } from "react";
import XIcon from "@heroicons/react/solid/XIcon";
import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import { BYDATES } from "@utils/constants";
import { getPlaceLabel } from "@utils/helpers";
import { useRouter } from "next/router";
import { useFilters } from "@components/hooks/useFilters";

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
  const { state, setOpenModal, setPlace, setByDate, setCategory, setDistance } =
    useFilters();
  const router = useRouter();

  const isAnyFilterSelected = () =>
    state.place || state.byDate || state.category || state.distance;
  const getText = (value, defaultValue) => (value ? value : defaultValue);
  const foundByDate = BYDATES.find((item) => item.value === state.byDate);

  const handleByDateClick = useCallback(() => {
    if (state.byDate) {
      setByDate("");
      window.localStorage.removeItem("byDate");

      if (state.byDateProps) {
        router.push(`/${state.placeProps}`);
      }
    } else {
      setOpenModal(true);
    }
  }, [
    state.byDate,
    state.byDateProps,
    state.placeProps,
    router,
    setByDate,
    setOpenModal,
  ]);

  const handleCategoryClick = useCallback(() => {
    setCategory("");
  }, [setCategory]);

  const handleDistanceClick = useCallback(() => {
    setDistance("");
  }, [setDistance]);

  const handleOnClick = useCallback(
    (value, fn) => () => value ? fn() : setOpenModal(true),
    [setOpenModal]
  );

  const handlePlaceClick = useCallback(() => {
    if (state.place) {
      setPlace("");
      setSelectedOption(undefined);
      window.localStorage.removeItem("place");

      if (state.placeProps) {
        router.push(`/`);
      }
    } else {
      setOpenModal(true);
    }
  }, [
    state.place,
    state.placeProps,
    setPlace,
    setSelectedOption,
    router,
    setOpenModal,
  ]);

  return (
    <div
      className={`w-full bg-whiteCorp flex justify-center items-center px-0 ${
        state.openModal
          ? "opacity-50 animate-pulse text-bColor pointer-events-none"
          : ""
      }`}
    >
      <div className="w-full flex justify-start items-center gap-2 cursor-pointer">
        <div
          onClick={() => setOpenModal(true)}
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
            text: getText(getPlaceLabel(state.place), "Població"),
            enabled: state.place,
            onClick: handlePlaceClick,
            handleOpenModal: () => setOpenModal(true),
            scrollToTop,
          })}
          {renderButton({
            text: getText(state.category, "Categoria"),
            enabled: state.category,
            onClick: handleOnClick(state.category, handleCategoryClick),
            handleOpenModal: () => setOpenModal(true),
            scrollToTop,
          })}
          {renderButton({
            text: getText(foundByDate && foundByDate.label, "Data"),
            enabled: foundByDate,
            onClick: handleOnClick(foundByDate, handleByDateClick),
            handleOpenModal: () => setOpenModal(true),
            scrollToTop,
          })}
          {renderButton({
            text: getText(
              state.distance ? `${state.distance} km` : null,
              "Distància"
            ),
            enabled: state.distance,
            onClick: handleOnClick(state.distance, handleDistanceClick),
            handleOpenModal: () => setOpenModal(true),
            scrollToTop,
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(Filters);
