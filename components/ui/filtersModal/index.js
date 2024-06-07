import { useMemo, memo, useCallback, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import RadioInput from "@components/ui/common/form/radioInput";
import RangeInput from "@components/ui/common/form/rangeInput";
import { BYDATES, CATEGORIES, DISTANCES } from "@utils/constants";
import { generateRegionsAndTownsOptions } from "@utils/helpers";
import useStore from "@store";

const Modal = dynamic(() => import("@components/ui/common/modal"), {
  loading: () => "",
});

const Select = dynamic(() => import("@components/ui/common/form/select"), {
  loading: () => "",
});

function FiltersModal({ selectedOption, setSelectedOption }) {
  const {
    openModal,
    place,
    byDate,
    category,
    distance,
    userLocation,
    setState,
  } = useStore((state) => ({
    openModal: state.openModal,
    place: state.place,
    byDate: state.byDate,
    category: state.category,
    distance: state.distance,
    userLocation: state.userLocation,
    setState: state.setState,
  }));

  const [userLocationLoading, setUserLocationLoading] = useState(false);
  const [userLocationError, setUserLocationError] = useState("");

  useEffect(() => {
    if (openModal) {
      setState("navigatedFilterModal", true);
    }
  }, [openModal, setState]);

  const regionsAndCitiesArray = useMemo(
    () => generateRegionsAndTownsOptions(),
    []
  );

  const handleStateChange = useCallback(
    (key, value) => {
      setState(key, value);
    },
    [setState]
  );

  const handleByDateChange = useCallback(
    (value) => {
      handleStateChange("byDate", value);
    },
    [handleStateChange]
  );

  const handleCategoryChange = useCallback(
    (value) => {
      handleStateChange("category", value);
    },
    [handleStateChange]
  );

  const handlePlaceChange = useCallback(
    ({ value }) => {
      handleStateChange("place", value);
      setSelectedOption(value);

      setState("page", 0);
      setState("scrollPosition", 0);
    },
    [handleStateChange, setSelectedOption, setState]
  );

  const handleUserLocation = useCallback(
    (value) => {
      if (userLocation) {
        handleStateChange("distance", value);
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

            handleStateChange("userLocation", location);
            setUserLocationLoading(false);
            handleStateChange("distance", value);
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
    [userLocation, handleStateChange]
  );

  const handleDistanceChange = useCallback(
    (event) => {
      handleUserLocation(event.target.value);
    },
    [handleUserLocation]
  );

  const disablePlace =
    distance === undefined || distance !== "" || isNaN(Number(distance));
  const disableDistance = place || userLocationLoading || userLocationError;

  return (
    <>
      <Modal
        open={openModal}
        setOpen={(value) => setState("openModal", value)}
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
                  checkedValue={category}
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
                  checkedValue={byDate}
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
                value={distance}
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
