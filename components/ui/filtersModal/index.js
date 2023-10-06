import { memo, useCallback, useState } from "react";
import Modal from "@components/ui/common/modal";
import { BYDATES, CATEGORIES, DISTANCES } from "@utils/constants";
import GlobeIcon from "@heroicons/react/solid/GlobeIcon";

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
      handleStateChange(setDistance, value);
    },
    [handleStateChange, setDistance]
  );

  const handleUserLocation = useCallback(() => {
    if (userLocation) {
      setUserLocation(null);
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
  }, [
    userLocation,
    setUserLocation,
    setUserLocationLoading,
    setUserLocationError,
  ]);

  const disableDistance =
    !userLocation || userLocationLoading || userLocationError;

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
                  <button
                    type="button"
                    id="user-location"
                    name="date"
                    className="flex px-2 py-1 text-blackCorp focus:outline-none rounded border-2 border-blackCorp"
                    onClick={handleUserLocation}
                  >
                    <GlobeIcon className="h-5 w-5 mr-1" />
                    {userLocation ? "Desactivar" : "Activar"} localització
                  </button>
                </div>
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
            <div className="mt-3 space-y-3">
              <div
                className={`flex flex-col ${
                  disableDistance ? "opacity-30" : ""
                }`}
              >
                {DISTANCES.map((value) => (
                  <div key={value} className="flex pb-4">
                    <input
                      id={value}
                      name="distances"
                      type="radio"
                      className="form-radio h-5 w-5"
                      checked={distance === value}
                      onClick={() => handleDistanceChange(value)}
                      readOnly
                      disabled={disableDistance}
                    />
                    <label htmlFor={value} className="ml-3 text-sm">
                      {value} km
                    </label>
                  </div>
                ))}
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
