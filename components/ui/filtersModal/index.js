import {
  useMemo,
  memo,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import dynamic from "next/dynamic";
import RadioInput from "@components/ui/common/form/radioInput";
import RangeInput from "@components/ui/common/form/rangeInput";
import { BYDATES, CATEGORIES, DISTANCES } from "@utils/constants";
import { generateRegionsAndTownsOptions } from "@utils/helpers";
import { useFilters } from "@components/hooks/useFilters";

const Modal = dynamic(() => import("@components/ui/common/modal"), {
  loading: () => "",
});

const Select = dynamic(() => import("@components/ui/common/form/select"), {
  loading: () => "",
});

function FiltersModal({ selectedOption, setSelectedOption }) {
  const { state, setFilter } = useFilters();
  const [userLocationLoading, setUserLocationLoading] = useState(false);
  const [userLocationError, setUserLocationError] = useState("");

  useEffect(() => {
    if (state.openModal) {
      setFilter("SET_NAVIGATED_FILTER_MODAL", true);
    }
  }, [state.openModal, setFilter]);

  const regionsAndCitiesArray = useMemo(
    () => generateRegionsAndTownsOptions(),
    []
  );

  const handleStateChange = useCallback(
    (type, value) => {
      setFilter(type, value);
    },
    [setFilter]
  );

  const handleByDateChange = useCallback(
    (value) => {
      if (value === state.byDate) window.localStorage.removeItem("byDate");
      handleStateChange("SET_BYDATE", value);
    },
    [state.byDate, handleStateChange]
  );

  const handleCategoryChange = useCallback(
    (value) => {
      handleStateChange("SET_CATEGORY", value);
    },
    [handleStateChange]
  );

  const handlePlaceChange = useCallback(
    ({ value }) => {
      if (!value) window.localStorage.removeItem("place");

      handleStateChange("SET_PLACE", value);
      setSelectedOption(value);

      localStorage.removeItem("currentPage");
      localStorage.removeItem("scrollPosition");
    },
    [handleStateChange, setSelectedOption]
  );

  const handleUserLocation = useCallback(
    (value) => {
      if (state.userLocation) {
        handleStateChange("SET_DISTANCE", value);
        return;
      }

      setUserLocationLoading(true);
      setUserLocationError(null);

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            handleStateChange("SET_USER_LOCATION", location);
            setUserLocationLoading(false);
            handleStateChange("SET_DISTANCE", value);
          },
          function (error) {
            console.log("Error occurred. Error code: " + error.code);
            switch (error.code) {
              case 1:
                setUserLocationError(
                  "Permission denied. The user has denied the request for geolocation."
                );
                break;
              case 2:
                setUserLocationError(
                  "Position unavailable. Location information is unavailable."
                );
                break;
              case 3:
                setUserLocationError(
                  "Timeout. The request to get user location timed out."
                );
                break;
              default:
                setUserLocationError("An unknown error occurred.");
            }
            setUserLocationLoading(false);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        setUserLocationError("Geolocation is not supported by this browser.");
        setUserLocationLoading(false);
      }
    },
    [state.userLocation, handleStateChange]
  );

  const handleDistanceChange = useCallback(
    (event) => {
      handleUserLocation(event.target.value);
    },
    [handleUserLocation]
  );

  const disablePlace =
    state.distance === undefined ||
    state.distance !== "" ||
    isNaN(Number(state.distance));
  const disableDistance =
    state.place || userLocationLoading || userLocationError;

  return (
    <>
      <Modal
        open={state.openModal}
        setOpen={(value) => setFilter("SET_MODAL", value)}
        title="Filters"
        actionButton="Apply filters"
      >
        <div className="w-full flex flex-col justify-center items-center gap-5 px-6 py-8 my-8">
          <div className="w-full flex flex-col justify-center items-center gap-2 px-6 sm:px-0">
            <p className="w-full text-primary font-semibold font-barlow uppercase italic pt-[5px]">
              Locations
            </p>
            <div className="w-full flex flex-col px-0">
              <Select
                id="options"
                options={regionsAndCitiesArray}
                value={selectedOption}
                onChange={handlePlaceChange}
                isClearable
                placeholder="Location"
                isDisabled={disablePlace}
              />
            </div>
          </div>
          <fieldset className="w-full flex flex-col justify-start items-start gap-4 px-6 sm:px-0">
            <p className="w-full text-primary font-semibold font-barlow uppercase italic">
              Categories
            </p>
            <div className="w-full h-28 flex flex-col justify-start items-start gap-2 flex-wrap">
              {Object.entries(CATEGORIES).map(([value]) => (
                <RadioInput
                  key={value}
                  id={value}
                  name="category"
                  value={value}
                  checkedValue={state.category}
                  onChange={handleCategoryChange}
                  label={value}
                />
              ))}
            </div>
          </fieldset>
          <fieldset className="w-full flex flex-col justify-start items-start gap-6 px-6 sm:px-0">
            <p className="w-full text-primary font-semibold font-barlow uppercase italic pt-[5px]">
              Date
            </p>
            <div className="w-full flex flex-col justify-start items-start gap-x-3 gap-y-3 flex-wrap">
              {BYDATES.map(({ value, label }) => (
                <RadioInput
                  key={value}
                  id={value}
                  name="byDate"
                  value={value}
                  checkedValue={state.byDate}
                  onChange={handleByDateChange}
                  label={label}
                />
              ))}
            </div>
          </fieldset>
          <fieldset className="w-full flex flex-col justify-start items-start gap-6 px-6 sm:px-0">
            <p className="w-full text-primary font-semibold font-barlow uppercase italic pt-[5px]">
              Distance
            </p>
            {(userLocationLoading || userLocationError) && (
              <div className="border-t border-bColor py-2">
                <div className="flex flex-col">
                  {userLocationLoading && (
                    <div className="text-sm text-bColor">
                      Loading location...
                    </div>
                  )}
                  {userLocationError && (
                    <div className="text-sm text-primary">
                      {userLocationError}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              className={`w-full flex flex-col justify-start items-start gap-3px-0 ${
                disableDistance ? "opacity-30" : ""
              }`}
            >
              <RangeInput
                key="distance"
                id="distance"
                name="distance"
                min={DISTANCES[0]}
                max={DISTANCES[DISTANCES.length - 1]}
                value={state.distance}
                onChange={handleDistanceChange}
                label="Events within"
                disabled={disableDistance}
              />
            </div>
          </fieldset>
        </div>
      </Modal>
    </>
  );
}

export default memo(FiltersModal);
