import { memo, useCallback, useState } from "react";
import Modal from "@components/ui/common/modal";
import RadioInput from "@components/ui/common/form/radioInput";
import { BYDATES, CATEGORIES, DISTANCES } from "@utils/constants";

function FiltersModal({
  openModal,
  setOpenModal,
  byDate,
  setByDate,
  category,
  setCategory,
  userLocation,
  setUserLocation,
  distance,
  setDistance,
}) {
  const [userLocationLoading, setUserLocationLoading] = useState(false);
  const [userLocationError, setUserLocationError] = useState("");
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

  const handleDistanceChange = useCallback(
    (value) => {
      handleUserLocation(value);
    },
    [handleUserLocation]
  );

  const handleUserLocation = useCallback(
    (value) => {
      if (userLocation) {
        handleStateChange(setDistance, value);
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

            setUserLocation(location);
            setUserLocationLoading(false);
            handleStateChange(setDistance, value);
          },
          function (error) {
            console.log("Error occurred. Error code: " + error.code);
            switch (error.code) {
              case 1:
                setUserLocationError(
                  "Permís denegat. L'usuari no ha permès la sol·licitud de geolocalització."
                );
                break;
              case 2:
                setUserLocationError(
                  "Posició no disponible. No s'ha pogut obtenir la informació de la ubicació."
                );
                break;
              case 3:
                setUserLocationError(
                  "Temps d'espera esgotat. La sol·licitud per obtenir la ubicació de l'usuari ha superat el temps d'espera."
                );
                break;
              default:
                setUserLocationError("S'ha produït un error desconegut.");
            }
            setUserLocationLoading(false);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        setUserLocationError(
          "La geolocalització no és compatible amb aquest navegador."
        );
        setUserLocationLoading(false);
      }
    },
    [
      userLocation,
      setUserLocation,
      setUserLocationLoading,
      setUserLocationError,
      handleStateChange,
      setDistance,
    ]
  );

  const disableDistance = userLocationLoading || userLocationError;

  return (
    <>
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        title="Filtres"
        actionButton="Veure resultats"
      >
        <div className="space-y-2">
          <fieldset className="pt-2 pb-2">
            <legend className="text-sm font-medium">Categories</legend>
            <div className="mt-3 space-y-3">
              <div className="flex flex-col">
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
            </div>
          </fieldset>
          <fieldset className="pt-2 pb-2">
            <legend className="text-sm font-medium">Data</legend>
            <div className="mt-3 space-y-3">
              <div className="flex flex-col">
                {BYDATES.map(({ value, label }) => (
                  <RadioInput
                    key={value}
                    id={value}
                    name="date"
                    value={value}
                    checkedValue={byDate}
                    onChange={handleByDateChange}
                    label={label}
                  />
                ))}
              </div>
            </div>
          </fieldset>
          <fieldset className="pt-2 pb-2">
            <legend className="text-sm font-medium">
              Esdeveniments a prop meu
            </legend>
            {(userLocationLoading || userLocationError) && (
              <div className="mt-3 space-y-3">
                <div className="flex flex-col">
                  {userLocationLoading && (
                    <div className="text-sm text-blackCorp">
                      Carregant localització...
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

            <div className="mt-3 space-y-3">
              <div
                className={`flex flex-col ${
                  disableDistance ? "opacity-30" : ""
                }`}
              >
                {DISTANCES.map((value) => (
                  <RadioInput
                    key={value}
                    id={value}
                    name="distances"
                    value={value}
                    checkedValue={distance}
                    onChange={handleDistanceChange}
                    label={`${value} km`}
                    disabled={disableDistance}
                  />
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
