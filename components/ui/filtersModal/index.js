import { memo, useCallback } from "react";
import Modal from "@components/ui/common/modal";
import { BYDATES, CATEGORIES } from "@utils/constants";

function FiltersModal({
  openModal,
  setOpenModal,
  byDate,
  setByDate,
  category,
  setCategory,
  userLocation,
  setUserLocation,
}) {
  const handleStateChange = useCallback((setState, value) => {
    setState((prevValue) => (prevValue === value ? "" : value));
  }, []);

  const handleByDateChange = useCallback(
    (value) => {
      handleStateChange(setByDate, value);
    },
    [handleStateChange, setByDate]
  );

  const handleCategoryChange = useCallback(
    (value) => {
      handleStateChange(setCategory, value);
    },
    [handleStateChange, setCategory]
  );

  const handleUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(location);
        setUserLocation(location);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    if (userLocation) {
      setUserLocation(null);
    }
  };

  return (
    <>
      <Modal open={openModal} setOpen={setOpenModal} title="Filtres">
        <div className="space-y-8">
          <fieldset className="pt-4 pb-2">
            <legend className="text-sm font-medium">
              Esdeveniments a prop meu
            </legend>
            <div className="mt-3 space-y-3">
              <div className="flex flex-col">
                <div className="flex pb-4">
                  <input
                    id="user-location"
                    name="date"
                    type="radio"
                    className="form-radio h-5 w-5"
                    checked={!!userLocation}
                    onClick={handleUserLocation}
                    readOnly
                  />
                  <label htmlFor="user-location" className="ml-3 text-sm">
                    La meva ubicació actual
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset className="pt-4 pb-2">
            <legend className="text-sm font-medium">Data</legend>
            <div className="mt-3 space-y-3">
              <div className="flex flex-col">
                {BYDATES.map(({ value, label }) => (
                  <div key={value} className="flex pb-4">
                    <input
                      id={value}
                      name="date"
                      type="radio"
                      className="form-radio h-5 w-5"
                      checked={byDate === value}
                      onClick={() => handleByDateChange(value)}
                      readOnly
                    />
                    <label htmlFor={value} className="ml-3 text-sm">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
          <fieldset className="pt-4 pb-2">
            <legend className="text-sm font-medium">Categories</legend>
            <div className="mt-3 space-y-3">
              <div className="flex flex-col">
                {Object.entries(CATEGORIES).map(([value]) => (
                  <div key={value} className="flex pb-4">
                    <input
                      id={value}
                      name="category"
                      type="radio"
                      className="form-radio h-5 w-5"
                      checked={category === value}
                      onClick={() => handleCategoryChange(value)}
                      readOnly
                    />
                    <label htmlFor={value} className="ml-3 text-sm">
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
        </div>
      </Modal>
    </>
  );
}

export default memo(FiltersModal);
